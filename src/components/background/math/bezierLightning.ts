import type { Vec2 } from "../types";

// ── Simple seeded pseudo-random ──
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// ── Evaluate cubic bezier at t ──
function cubicBezier(p0: Vec2, p1: Vec2, p2: Vec2, p3: Vec2, t: number): Vec2 {
  const t2 = t * t;
  const t3 = t2 * t;
  const mt = 1 - t;
  const mt2 = mt * mt;
  const mt3 = mt2 * mt;
  return {
    x: mt3 * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t3 * p3.x,
    y: mt3 * p0.y + 3 * mt2 * t * p1.y + 3 * mt * t2 * p2.y + t3 * p3.y,
  };
}

// ── Simple fractal noise for displacement ──
function fractalNoise(t: number, seed: number, octaves: number = 3): number {
  let value = 0;
  let amp = 1;
  let freq = 1;
  for (let i = 0; i < octaves; i++) {
    value += Math.sin(t * freq * 6.2831 + seed * (i + 1) * 1.7) * amp;
    amp *= 0.5;
    freq *= 2;
  }
  return value;
}

// ── Generate lightning-like path between two points ──
export function generateLightningPath(
  start: Vec2,
  end: Vec2,
  cp1: Vec2,
  cp2: Vec2,
  time: number,
  seed: number,
  samples: number = 40
): Vec2[] {
  const points: Vec2[] = [];
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  // Perpendicular direction
  const nx = -dy / len;
  const ny = dx / len;

  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const p = cubicBezier(start, cp1, cp2, end, t);

    // Fractal noise displacement, stronger in the middle
    const envelope = Math.sin(t * Math.PI); // 0 at endpoints, 1 in middle
    const noise = fractalNoise(t + time * 0.3, seed) * envelope * (len * 0.04);

    points.push({
      x: p.x + nx * noise,
      y: p.y + ny * noise,
    });
  }
  return points;
}

// ── Generate branching tendrils off main path ──
export function generateBranches(
  mainPath: Vec2[],
  branchCount: number,
  maxLen: number,
  seed: number,
  time: number
): Vec2[][] {
  const rng = seededRandom(seed + Math.floor(time * 0.5)); // slowly evolving branches
  const branches: Vec2[][] = [];

  for (let b = 0; b < branchCount; b++) {
    const pathIdx = Math.floor(rng() * (mainPath.length - 4)) + 2;
    const origin = mainPath[pathIdx];
    const prev = mainPath[pathIdx - 1];

    // Direction perpendicular to path
    const dx = origin.x - prev.x;
    const dy = origin.y - prev.y;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;

    // Random side
    const side = rng() > 0.5 ? 1 : -1;
    const branchLen = maxLen * (0.4 + rng() * 0.6);
    const angle = (rng() - 0.5) * 1.2; // slight random angle

    const endX = origin.x + (-dy / len * side + dx / len * angle) * branchLen;
    const endY = origin.y + (dx / len * side + dy / len * angle) * branchLen;

    const branch: Vec2[] = [];
    const steps = 8;
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const noise = fractalNoise(t + time * 0.5 + b, seed + b * 7) * branchLen * 0.08 * Math.sin(t * Math.PI);
      branch.push({
        x: origin.x + (endX - origin.x) * t + noise * (-dy / len),
        y: origin.y + (endY - origin.y) * t + noise * (dx / len),
      });
    }
    branches.push(branch);
  }

  return branches;
}
