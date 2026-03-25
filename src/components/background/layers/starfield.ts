import type { Star } from "../types";
import { BG } from "../config";

// ── Initialize stars ──
export function initStars(w: number, h: number): Star[] {
  const stars: Star[] = [];
  const count = BG.stars.count;
  for (let i = 0; i < count; i++) {
    // Golden angle distribution for even coverage
    const angle = i * 137.508 * (Math.PI / 180);
    const r = Math.sqrt(i / count) * Math.max(w, h) * 0.75;
    const x = w / 2 + Math.cos(angle) * r + (Math.random() - 0.5) * 80;
    const y = h / 2 + Math.sin(angle) * r + (Math.random() - 0.5) * 80;

    stars.push({
      x: ((x % w) + w) % w,
      y: ((y % h) + h) % h,
      size: BG.stars.minSize + Math.random() * (BG.stars.maxSize - BG.stars.minSize),
      brightness: 0.15 + Math.random() * 0.6,
      twinkleSpeed: 0.5 + Math.random() * 1.5,
      twinklePhase: Math.random() * Math.PI * 2,
    });
  }
  return stars;
}

// ── Render static starfield + nebula to offscreen canvas ──
export function renderStaticStarfield(w: number, h: number, stars: Star[]): HTMLCanvasElement {
  const offscreen = document.createElement("canvas");
  offscreen.width = w;
  offscreen.height = h;
  const ctx = offscreen.getContext("2d")!;

  // Nebula blobs
  for (const blob of BG.nebula.blobs) {
    const gradient = ctx.createRadialGradient(
      blob.cx * w, blob.cy * h, 0,
      blob.cx * w, blob.cy * h, blob.r
    );
    gradient.addColorStop(0, `rgba(${blob.color[0]}, ${blob.color[1]}, ${blob.color[2]}, ${blob.alpha})`);
    gradient.addColorStop(1, "transparent");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
  }

  // Static stars
  const [sr, sg, sb] = BG.colors.starWhite;
  for (const star of stars) {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${sr}, ${sg}, ${sb}, ${star.brightness * 0.6})`;
    ctx.fill();
  }

  return offscreen;
}

// ── Draw twinkling stars (per frame, only the brightest) ──
export function drawTwinkle(ctx: CanvasRenderingContext2D, stars: Star[], time: number) {
  const [sr, sg, sb] = BG.colors.starWhite;
  const [gr, gg, gb] = BG.colors.nodeGold;

  // Only twinkle the brightest stars
  for (let i = 0; i < Math.min(BG.stars.twinkleCount, stars.length); i++) {
    const star = stars[i];
    const twinkle = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(time * star.twinkleSpeed + star.twinklePhase));
    const alpha = star.brightness * twinkle * 0.8;

    // Occasional gold tint for warmth
    const isGold = i % 7 === 0;
    const r = isGold ? gr : sr;
    const g = isGold ? gg : sg;
    const b = isGold ? gb : sb;

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size * (0.8 + twinkle * 0.4), 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
    ctx.fill();

    // Subtle glow on brighter stars
    if (star.brightness > 0.5) {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.1})`;
      ctx.fill();
    }
  }
}
