import type { GravityWell } from "../types";

export function computeGridDisplacement(
  gridX: number,
  gridY: number,
  wells: GravityWell[],
  mouseX: number,
  mouseY: number,
  mouseStrength: number,
  mouseRadius: number
): { dy: number; intensityBoost: number } {
  let dy = 0;
  let intensityBoost = 0;

  // Gravity wells (under nodes)
  for (const well of wells) {
    const dx = gridX - well.x;
    const dwy = gridY - well.y;
    const distSq = dx * dx + dwy * dwy;
    const radiusSq = well.radius * well.radius;
    const warp = well.strength * Math.exp(-distSq / (2 * radiusSq));
    dy += warp;
    intensityBoost += Math.exp(-distSq / (3 * radiusSq)) * 0.6;
  }

  // Mouse warp
  const mdx = gridX - mouseX;
  const mdy = gridY - mouseY;
  const mDistSq = mdx * mdx + mdy * mdy;
  const mRadiusSq = mouseRadius * mouseRadius;
  dy += mouseStrength * Math.exp(-mDistSq / (2 * mRadiusSq));

  return { dy, intensityBoost: Math.min(intensityBoost, 1.0) };
}
