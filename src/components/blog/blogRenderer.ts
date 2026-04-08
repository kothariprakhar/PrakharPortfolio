import type { BlogMass } from "./blogPhysics";
import { jaccardSimilarity } from "./blogPhysics";

// ── Ambient particles ────────────────────────────────────────
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
}

let particles: Particle[] = [];

export function initParticles(w: number, h: number) {
  particles = Array.from({ length: 50 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.15,
    vy: (Math.random() - 0.5) * 0.1,
    alpha: 0.02 + Math.random() * 0.06,
    size: 0.5 + Math.random() * 1.2,
  }));
}

export function drawParticles(ctx: CanvasRenderingContext2D, w: number, h: number) {
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0) p.x = w;
    if (p.x > w) p.x = 0;
    if (p.y < 0) p.y = h;
    if (p.y > h) p.y = 0;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
    ctx.fill();
  }
}

// ── Attention beams ──────────────────────────────────────────
interface FlowDot {
  progress: number;
  speed: number;
}

const beamFlowDots = new Map<string, FlowDot[]>();

export function drawAttentionBeams(
  ctx: CanvasRenderingContext2D,
  masses: BlogMass[],
  hoveredIndex: number,
  beamAlpha: number,
  time: number
) {
  if (hoveredIndex < 0 || beamAlpha < 0.01) return;

  const source = masses[hoveredIndex];

  for (let i = 0; i < masses.length; i++) {
    if (i === hoveredIndex) continue;
    const target = masses[i];
    const sim = jaccardSimilarity(source.tags, target.tags);
    if (sim < 0.2) continue;

    const alpha = beamAlpha * (0.08 + 0.35 * sim);
    const width = 0.8 + 2.5 * sim;

    // Beam line
    const gradient = ctx.createLinearGradient(source.x, source.y, target.x, target.y);
    gradient.addColorStop(0, source.glowColor.replace(/[\d.]+\)$/, `${alpha})`));
    gradient.addColorStop(1, target.glowColor.replace(/[\d.]+\)$/, `${alpha})`));

    ctx.beginPath();
    ctx.moveTo(source.x, source.y);
    ctx.lineTo(target.x, target.y);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = width;
    ctx.stroke();

    // Flow particles along beam
    const key = `${hoveredIndex}-${i}`;
    if (!beamFlowDots.has(key)) {
      beamFlowDots.set(
        key,
        Array.from({ length: 3 }, () => ({
          progress: Math.random(),
          speed: 0.003 + Math.random() * 0.004,
        }))
      );
    }

    const dots = beamFlowDots.get(key)!;
    for (const dot of dots) {
      dot.progress = (dot.progress + dot.speed) % 1;
      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const px = source.x + dx * dot.progress;
      const py = source.y + dy * dot.progress;

      ctx.beginPath();
      ctx.arc(px, py, 1.5 + sim * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${beamAlpha * 0.4})`;
      ctx.fill();
    }
  }

  // Clean up old flow dots
  if (hoveredIndex < 0) beamFlowDots.clear();
}

// ── Mass orbs ────────────────────────────────────────────────
export function drawMassOrbs(
  ctx: CanvasRenderingContext2D,
  masses: BlogMass[],
  hoveredIndex: number,
  time: number
) {
  for (let i = 0; i < masses.length; i++) {
    const m = masses[i];
    const isHovered = i === hoveredIndex;
    const pulse = 1 + 0.08 * Math.sin(time * m.pulseSpeed + m.pulsePhase);
    const scale = isHovered ? 1.2 : 1;
    const coreR = m.radius * pulse * scale;
    const glowR = coreR * 4.5;

    // Outer glow
    const glowAlpha = isHovered ? 0.16 : 0.07;
    const glow = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, glowR);
    glow.addColorStop(0, m.glowColor.replace(/[\d.]+\)$/, `${glowAlpha})`));
    glow.addColorStop(0.4, m.glowColor.replace(/[\d.]+\)$/, `${glowAlpha * 0.4})`));
    glow.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(m.x, m.y, glowR, 0, Math.PI * 2);
    ctx.fill();

    // Inner core
    const coreAlpha = isHovered ? 0.9 : 0.6;
    const core = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, coreR);
    core.addColorStop(0, `rgba(255, 255, 255, ${coreAlpha})`);
    core.addColorStop(0.5, m.glowColor.replace(/[\d.]+\)$/, `${coreAlpha * 0.7})`));
    core.addColorStop(1, m.glowColor.replace(/[\d.]+\)$/, "0)"));
    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.arc(m.x, m.y, coreR, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ── Cluster labels (zoomed out) ──────────────────────────────
export function drawClusterLabels(
  ctx: CanvasRenderingContext2D,
  clusters: { label: string; cx: number; cy: number; color: string }[]
) {
  ctx.font = "10px 'JetBrains Mono', monospace";
  ctx.textAlign = "center";

  for (const c of clusters) {
    // Faint boundary
    ctx.beginPath();
    ctx.arc(c.cx, c.cy, 80, 0, Math.PI * 2);
    ctx.strokeStyle = c.color.replace(/[\d.]+\)$/, "0.06)");
    ctx.lineWidth = 0.5;
    ctx.setLineDash([4, 6]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Label
    ctx.fillStyle = c.color.replace(/[\d.]+\)$/, "0.2)");
    ctx.fillText(c.label.toUpperCase(), c.cx, c.cy - 90);
  }
}
