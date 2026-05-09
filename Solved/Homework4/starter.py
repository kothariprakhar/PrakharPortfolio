#!/usr/bin/env python3
"""
Starter code for pixel-space DDPM training on 64x64 RGB images.

Please implement the missing member functions in the PixelDDPM class. This
starter code already handles:
    a. dataset loading
    b. EMA helper
    c. sinusoidal timestep embedding
    d. U-Net denoiser
    e. training loop
    f. checkpointing
    g. saving sample generations in a 1x10 grid

The goal is to focus on the diffusion process itself, specifically:
    a. forward noising q(x_t | x_0)
    b. the training objective
    c. the reverse denoising process, including epsilon_theta
    d. the sampling process
"""

import math
import os
import copy
import random
import time
from pathlib import Path

from PIL import Image

import torch
import torch.nn as nn
import torch.nn.functional as F
from torch.utils.data import Dataset, DataLoader, Subset
from torchvision import transforms
from torchvision.utils import save_image


# These are the hyper-parameters that I used to generate my samples.  Please
# feel free to experiment with different settings

DATA_DIR = Path("faces64")
OUT_DIR = Path("weights")
SAMPLES_DIR = OUT_DIR / "samples"

IMAGE_SIZE = 64
CHANNELS = 3

T = 200
BETA_START = 1e-4
BETA_END = 2e-2
TIME_DIM = 256
BASE_CHANNELS = 96

EPOCHS = 2000
BATCH_SIZE = 64
LR = 5e-5
WEIGHT_DECAY = 1e-6
NUM_WORKERS = min(16, os.cpu_count() or 4)
SAVE_EVERY = 50
SAVE_AT_EPOCH_ZERO = False
SAMPLE_GRID_N = 10

EMA_BETA = 0.995
EMA_START = 200

if torch.cuda.is_available():
    DEVICE = torch.device("cuda")
elif torch.backends.mps.is_available():
    DEVICE = torch.device("mps")
else:
    DEVICE = torch.device("cpu")


if DEVICE.type == "mps":
    NUM_WORKERS = 0


# ImageDataset loads training images from the faces64 directory.
class ImageDataset(Dataset):
    def __init__(self, root, transform=None):
        self.root = Path(root)
        self.transform = transform
        self.paths = sorted([p for p in self.root.iterdir() if p.is_file()])
        if not self.paths:
            raise FileNotFoundError("No images found in {}".format(self.root.resolve()))

    def __len__(self):
        return len(self.paths)

    def __getitem__(self, idx):
        img = Image.open(self.paths[idx]).convert("RGB")
        return self.transform(img) if self.transform is not None else img

# EMA() implements exponential moving average to add stability during training
class EMA:
    def __init__(self, beta):
        self.beta = beta
        self.step = 0

    def update_average(self, old, new):
        return new if old is None else old * self.beta + (1.0 - self.beta) * new

    def update_model_average(self, ema_model, model):
        for p, ema_p in zip(model.parameters(), ema_model.parameters()):
            ema_p.data = self.update_average(ema_p.data, p.data)

    def step_ema(self, ema_model, model, step_start_ema=200):
        if self.step < step_start_ema:
            ema_model.load_state_dict(model.state_dict())
        else:
            self.update_model_average(ema_model, model)
        self.step += 1

# SinusoidalTimeEmbedding maps each timestep t to a richer feature vector so the
# U-Net can condition its predictions on where it is in the diffusion process.
class SinusoidalTimeEmbedding(nn.Module):
    def __init__(self, dim):
        super().__init__()
        self.dim = dim

    def forward(self, t):
        half = self.dim // 2
        freqs = torch.exp(
            -math.log(10000.0) * torch.arange(0, half, device=t.device).float() / max(half - 1, 1)
        )
        args = t.float()[:, None] * freqs[None, :]
        emb = torch.cat([torch.sin(args), torch.cos(args)], dim=1)
        return F.pad(emb, (0, 1)) if self.dim % 2 else emb

# SelfAttention lets the U-Net relate distant spatial positions in the feature
# map, which helps it model long-range structure and global consistency.
class SelfAttention(nn.Module):
    def __init__(self, channels):
        super().__init__()
        self.mha = nn.MultiheadAttention(channels, 4, batch_first=True)
        self.ln = nn.LayerNorm(channels)
        self.ff = nn.Sequential(
            nn.LayerNorm(channels),
            nn.Linear(channels, channels),
            nn.GELU(),
            nn.Linear(channels, channels),
        )

    def forward(self, x):
        b, c, h, w = x.shape
        y = x.view(b, c, h * w).transpose(1, 2)
        y_ln = self.ln(y)
        a, _ = self.mha(y_ln, y_ln, y_ln)
        y = y + a
        y = y + self.ff(y)
        return y.transpose(1, 2).view(b, c, h, w)

# ResidualBlock applies two convolutional layers to extract and refine features.
# When residual=True, it also adds a skip connection so the U-Net can preserve
# information and train more stably.
class ResidualBlock(nn.Module):
    def __init__(self, in_ch, out_ch, residual=False):
        super().__init__()
        self.residual = residual
        self.skip = None if in_ch == out_ch else nn.Conv2d(in_ch, out_ch, 1)
        g = 8 if out_ch >= 8 else 1
        self.block = nn.Sequential(
            nn.Conv2d(in_ch, out_ch, 3, padding=1, bias=False),
            nn.GroupNorm(g, out_ch),
            nn.SiLU(),
            nn.Conv2d(out_ch, out_ch, 3, padding=1, bias=False),
            nn.GroupNorm(g, out_ch),
        )

    def forward(self, x):
        y = self.block(x)
        if not self.residual:
            return y
        return F.silu(y + (x if self.skip is None else self.skip(x)))

# Down and Up are the encoder and decoder blocks of the U-Net. They change
# spatial resolution, apply residual feature processing, and inject timestep information.
class Down(nn.Module):
    def __init__(self, in_ch, out_ch, time_dim):
        super().__init__()
        self.net = nn.Sequential(
            nn.MaxPool2d(2),
            ResidualBlock(in_ch, in_ch, residual=True),
            ResidualBlock(in_ch, out_ch),
        )
        self.emb = nn.Sequential(nn.SiLU(), nn.Linear(time_dim, out_ch))

    def forward(self, x, t):
        x = self.net(x)
        e = self.emb(t)[:, :, None, None].expand(-1, -1, x.shape[-2], x.shape[-1])
        return x + e


class Up(nn.Module):
    def __init__(self, in_ch, skip_ch, out_ch, time_dim):
        super().__init__()
        self.up = nn.Upsample(scale_factor=2, mode="bilinear", align_corners=True)
        self.net = nn.Sequential(
            ResidualBlock(in_ch + skip_ch, in_ch + skip_ch, residual=True),
            ResidualBlock(in_ch + skip_ch, out_ch),
        )
        self.emb = nn.Sequential(nn.SiLU(), nn.Linear(time_dim, out_ch))

    def forward(self, x, skip, t):
        x = self.up(x)
        x = self.net(torch.cat([skip, x], dim=1))
        e = self.emb(t)[:, :, None, None].expand(-1, -1, x.shape[-2], x.shape[-1])
        return x + e

# UNet is the denoiser network used by the DDPM. It predicts the noise present
# in x_t while conditioning on the timestep embedding.
class UNet(nn.Module):
    def __init__(self, c_in=3, c_out=3, time_dim=256, base=96):
        super().__init__()
        b = base
        self.time = SinusoidalTimeEmbedding(time_dim)

        self.inc = ResidualBlock(c_in, b)
        self.down1 = Down(b, b * 2, time_dim)
        self.down2 = Down(b * 2, b * 4, time_dim)
        self.attn1 = SelfAttention(b * 4)
        self.down3 = Down(b * 4, b * 4, time_dim)

        self.bot1 = ResidualBlock(b * 4, b * 8)
        self.bot2 = ResidualBlock(b * 8, b * 8, residual=True)
        self.bot3 = ResidualBlock(b * 8, b * 4)

        self.up1 = Up(b * 4, b * 4, b * 2, time_dim)
        self.attn2 = SelfAttention(b * 2)
        self.up2 = Up(b * 2, b * 2, b, time_dim)
        self.up3 = Up(b, b, b, time_dim)

        self.out = nn.Conv2d(b, c_out, 1)

    def forward(self, x, t):
        t = self.time(t)
        x1 = self.inc(x)
        x2 = self.down1(x1, t)
        x3 = self.attn1(self.down2(x2, t))
        x4 = self.down3(x3, t)

        x4 = self.bot3(self.bot2(self.bot1(x4)))

        x = self.attn2(self.up1(x4, x3, t))
        x = self.up2(x, x2, t)
        x = self.up3(x, x1, t)
        return self.out(x)


class PixelDDPM(nn.Module):

    def __init__(self, T=200, beta_start=1e-4, beta_end=2e-2, time_dim=256, base_channels=96):
        super().__init__()
        self.T = T
        self.eps_model = UNet(CHANNELS, CHANNELS, time_dim, base_channels)

        # Set up the linear noise schedule used by DDPM.
        # beta_t controls how much fresh noise gets added at each step.
        betas = torch.linspace(beta_start, beta_end, T, dtype=torch.float32)
        alphas = 1.0 - betas
        alpha_bars = torch.cumprod(alphas, dim=0)

        # alpha_bar_prev is alpha_bar shifted right by one timestep.
        # At t=0 we define the previous cumulative alpha as 1.0 by convention.
        alpha_bars_prev = torch.cat([
            torch.tensor([1.0], dtype=torch.float32),
            alpha_bars[:-1],
        ])

        # These precomputed terms appear repeatedly in q_sample and p_sample,
        # so storing them once keeps the code cleaner and avoids extra work.
        sqrt_alpha_bars = torch.sqrt(alpha_bars)
        sqrt_one_minus_alpha_bars = torch.sqrt(1.0 - alpha_bars)
        sqrt_recip_alphas = torch.sqrt(1.0 / alphas)

        # Closed-form posterior variance from the DDPM derivation.
        # We clamp to a tiny positive value for numerical stability.
        posterior_variance = betas * (1.0 - alpha_bars_prev) / (1.0 - alpha_bars)
        posterior_variance = posterior_variance.clamp(min=1e-20)

        # Keep diffusion coefficients as buffers (not trainable parameters),
        # but still move/save with the module state.
        self.register_buffer("betas", betas)
        self.register_buffer("alphas", alphas)
        self.register_buffer("alpha_bars", alpha_bars)
        self.register_buffer("alpha_bars_prev", alpha_bars_prev)
        self.register_buffer("sqrt_alpha_bars", sqrt_alpha_bars)
        self.register_buffer("sqrt_one_minus_alpha_bars", sqrt_one_minus_alpha_bars)
        self.register_buffer("sqrt_recip_alphas", sqrt_recip_alphas)
        self.register_buffer("posterior_variance", posterior_variance)

    def q_sample(self, x0, t, noise=None):
        # Forward diffusion in one shot:
        # x_t = sqrt(alpha_bar_t) * x_0 + sqrt(1 - alpha_bar_t) * epsilon.
        if noise is None:
            noise = torch.randn_like(x0)

        # Each item can have a different timestep, so we gather coefficients
        # per sample and reshape to broadcast across C, H, and W.
        sqrt_alpha_bar_t = self.sqrt_alpha_bars[t].view(-1, 1, 1, 1)
        sqrt_one_minus_alpha_bar_t = self.sqrt_one_minus_alpha_bars[t].view(-1, 1, 1, 1)

        xt = sqrt_alpha_bar_t * x0 + sqrt_one_minus_alpha_bar_t * noise
        return xt, noise

    def forward(self, x0):
        # Sample random timesteps so one batch teaches the model multiple
        # denoising difficulty levels instead of only one fixed noise level.
        b = x0.shape[0]
        t = torch.randint(0, self.T, (b,), device=x0.device, dtype=torch.long)

        # Create x_t and keep the exact epsilon used; that epsilon is the target.
        xt, noise = self.q_sample(x0, t)

        # Standard DDPM training loss: MSE between predicted and true epsilon.
        pred_noise = self.eps_model(xt, t)
        return F.mse_loss(pred_noise, noise)

    @torch.no_grad()
    def p_sample(self, xt, t_scalar, model):
        # Single reverse step: estimate the mean of p(x_{t-1} | x_t)
        # from the predicted noise epsilon_theta.
        b = xt.shape[0]
        t = torch.full((b,), t_scalar, device=xt.device, dtype=torch.long)

        eps_theta = model(xt, t)

        beta_t = self.betas[t].view(-1, 1, 1, 1)
        sqrt_recip_alpha_t = self.sqrt_recip_alphas[t].view(-1, 1, 1, 1)
        sqrt_one_minus_alpha_bar_t = self.sqrt_one_minus_alpha_bars[t].view(-1, 1, 1, 1)

        model_mean = sqrt_recip_alpha_t * (
            xt - (beta_t / sqrt_one_minus_alpha_bar_t) * eps_theta
        )

        # No stochastic term on the final step; use only the model mean.
        if t_scalar == 0:
            return model_mean

        posterior_var_t = self.posterior_variance[t].view(-1, 1, 1, 1)
        noise = torch.randn_like(xt)
        return model_mean + torch.sqrt(posterior_var_t) * noise

    @torch.no_grad()
    def sample(self, n, model):
        # Sampling starts at pure noise x_T, then repeatedly applies p_sample
        # until we reach x_0.
        x = torch.randn(n, CHANNELS, IMAGE_SIZE, IMAGE_SIZE, device=self.betas.device)
        for t in reversed(range(self.T)):
            x = self.p_sample(x, t, model)
        return x

    @torch.no_grad()
    def save_sample_grid(self, epoch, out_dir, model, n=10):
        # Usually we pass the EMA denoiser here for more stable sample quality.
        samples = self.sample(n, model)

        # Training uses normalized images in [-1, 1], so map back to [0, 1]
        # for visualization and clamp any tiny out-of-range values.
        samples = ((samples + 1.0) / 2.0).clamp(0.0, 1.0)

        out_dir = Path(out_dir)
        out_dir.mkdir(parents=True, exist_ok=True)
        save_image(samples, out_dir / "epoch_{:06d}.png".format(epoch), nrow=10)


def main():
    random.seed(161)
    torch.manual_seed(161)
    if DEVICE.type == "cuda":
        torch.cuda.manual_seed_all(161)

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    SAMPLES_DIR.mkdir(parents=True, exist_ok=True)

    print("Using device:", DEVICE)
    if DEVICE.type == "cuda":
        props = torch.cuda.get_device_properties(0)
        print("GPU:", torch.cuda.get_device_name(0))
        print("VRAM: {:.2f} GB".format(props.total_memory / (1024 ** 3)))
    elif DEVICE.type == "mps":
        print("GPU: Apple Silicon (MPS backend)")

    transform = transforms.Compose([
        transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
        transforms.ToTensor(),
        transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5)),
    ])

    dataset = ImageDataset(DATA_DIR, transform=transform)

    loader = DataLoader(
        dataset,
        batch_size=min(BATCH_SIZE, len(dataset)),
        shuffle=True,
        num_workers=NUM_WORKERS if len(dataset) > 16 else 0,
        pin_memory=(DEVICE.type == "cuda"),
        persistent_workers=(NUM_WORKERS > 0 and len(dataset) > 16),
    )

    ddpm = PixelDDPM(T, BETA_START, BETA_END, TIME_DIM, BASE_CHANNELS).to(DEVICE)
    ema_model = copy.deepcopy(ddpm.eps_model).eval().to(DEVICE)
    for p in ema_model.parameters():
        p.requires_grad = False

    ema = EMA(EMA_BETA)
    optimizer = torch.optim.AdamW(ddpm.parameters(), lr=LR, weight_decay=WEIGHT_DECAY)

    print("Total training images:", len(dataset))
    print("T = {}, LR = {}, BASE_CHANNELS = {}".format(T, LR, BASE_CHANNELS))
    print("Sample grid every {} epochs".format(SAVE_EVERY))
    print("DataLoader workers:", NUM_WORKERS)

    if SAVE_AT_EPOCH_ZERO:
        ddpm.eval()
        ddpm.save_sample_grid(0, SAMPLES_DIR, ema_model, n=SAMPLE_GRID_N)
        print("Saved sample grid for epoch 0")

    best_loss = float("inf")

    for epoch in range(1, EPOCHS + 1):
        start = time.time()
        ddpm.train()
        running_loss, n_seen = 0.0, 0

        for images in loader:
            images = images.to(DEVICE, non_blocking=True)

            optimizer.zero_grad(set_to_none=True)
            loss = ddpm(images)
            loss.backward()
            optimizer.step()

            ema.step_ema(ema_model, ddpm.eps_model, step_start_ema=EMA_START)

            running_loss += loss.item() * images.size(0)
            n_seen += images.size(0)

        epoch_loss = running_loss / max(n_seen, 1)
        epoch_time = time.time() - start

        print("Epoch [{:06d}/{}] loss={:.8f} time_per_epoch={:.2f}s".format(
            epoch, EPOCHS, epoch_loss, epoch_time
        ))

        ckpt = {
            "epoch": epoch,
            "ddpm_state_dict": ddpm.state_dict(),
            "ema_model_state_dict": ema_model.state_dict(),
            "optimizer_state_dict": optimizer.state_dict(),
            "best_loss": best_loss,
        }
        torch.save(ckpt, OUT_DIR / "pixel_diffusion_latest.pt")

        if epoch_loss < best_loss:
            best_loss = epoch_loss
            torch.save(ckpt, OUT_DIR / "pixel_diffusion_best.pt")

        if epoch % SAVE_EVERY == 0:
            ddpm.eval()
            ddpm.save_sample_grid(epoch, SAMPLES_DIR, ema_model, n=SAMPLE_GRID_N)
            print("Saved sample grid for epoch {}".format(epoch))

    print("\nTraining complete.")
    print("Best diffusion loss: {:.8f}".format(best_loss))
    print("Saved checkpoints to:", OUT_DIR.resolve())


if __name__ == "__main__":
    main()