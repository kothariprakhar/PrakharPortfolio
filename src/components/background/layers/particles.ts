import type { AmbientParticle } from "../types";
import { BG } from "../config";

// ── Initialize ambient particles ──
export function initParticles(w: number, h: number, isMobile: boolean): AmbientParticle[] {
  const count = isMobile ? BG.ambientParticles.mobile : BG.ambientParticles.desktop;
  const [minSpeed, maxSpeed] = BG.ambientParticles.speedRange;
  const [minSize, maxSize] = BG.ambientParticles.sizeRange;
  const [minAlpha, maxAlpha] = BG.ambientParticles.alphaRange;

  return Array.from({ length: count }, (_, i) => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 2 * (minSpeed + Math.random() * (maxSpeed - minSpeed)),
    vy: (Math.random() - 0.5) * 2 * (minSpeed + Math.random() * (maxSpeed - minSpeed)),
    alpha: minAlpha + Math.random() * (maxAlpha - minAlpha),
    size: minSize + Math.random() * (maxSize - minSize),
    phase: Math.random() * Math.PI * 2,
  }));
}

// ── Draw ambient particles ──
export function drawParticles(
  ctx: CanvasRenderingContext2D,
  particles: AmbientParticle[],
  w: number,
  h: number,
  time: number
) {
  const sr = BG.colors.starWhite[0], sg = BG.colors.starWhite[1], sb = BG.colors.starWhite[2];
  const cr = BG.colors.accentCyan[0], cg = BG.colors.accentCyan[1], cb = BG.colors.accentCyan[2];
  const gdr = BG.colors.nodeGold[0], gdg = BG.colors.nodeGold[1], gdb = BG.colors.nodeGold[2];

  for (const p of particles) {
    // Update position
    p.x += p.vx;
    p.y += p.vy;

    // Wrap around
    if (p.x < -10) p.x = w + 10;
    if (p.x > w + 10) p.x = -10;
    if (p.y < -10) p.y = h + 10;
    if (p.y > h + 10) p.y = -10;

    // Alpha modulation
    const alphaModulation = 0.6 + 0.4 * Math.sin(time * 0.5 + p.phase);
    const alpha = p.alpha * alphaModulation;

    // Occasional color tint
    const colorChoice = Math.floor(p.phase * 10) % 5;
    let r: number = sr, g: number = sg, b: number = sb;
    if (colorChoice === 0) { r = cr; g = cg; b = cb; }
    else if (colorChoice === 1) { r = gdr; g = gdg; b = gdb; }

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
    ctx.fill();
  }
}
