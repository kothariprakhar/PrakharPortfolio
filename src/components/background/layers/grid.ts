import type { GravityWell } from "../types";
import { BG } from "../config";
import { computeGridDisplacement } from "../math/gravityWell";

export function drawSpacetimeGrid(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  time: number,
  mouseX: number,
  mouseY: number,
  wells: GravityWell[],
  alphaMultiplier = 1.0
) {
  const { horizonY: horizFrac, horizontalLines, verticalLines, perspectiveExp } = BG.grid;
  const horizonY = h * horizFrac;
  const [gr, gg, gb] = BG.colors.gridPurple;
  const [cr, cg, cb] = BG.colors.accentCyan;

  ctx.save();

  // ── Horizontal lines (receding into distance) ──
  for (let i = 0; i <= horizontalLines; i++) {
    const t = i / horizontalLines;
    const perspective = Math.pow(t, perspectiveExp);
    const baseY = horizonY + (h - horizonY) * perspective;
    const segments = 50;

    ctx.beginPath();
    for (let s = 0; s <= segments; s++) {
      const sx = (s / segments) * w;
      const { dy, intensityBoost } = computeGridDisplacement(
        sx, baseY, wells, mouseX, mouseY,
        BG.grid.mouseWarpStrength * perspective,
        BG.grid.mouseWarpRadius
      );

      // Ambient wave
      const wave = Math.sin(sx * 0.006 + time * 0.4) * 1.5 * perspective;
      const py = baseY + dy + wave;

      if (s === 0) ctx.moveTo(sx, py);
      else ctx.lineTo(sx, py);
    }

    const baseAlpha = (0.06 + perspective * 0.12) * alphaMultiplier;
    // Check intensity near wells for color shift
    const midDisp = computeGridDisplacement(w / 2, baseY, wells, mouseX, mouseY, 0, 1);
    const boost = midDisp.intensityBoost;

    const r = Math.round(gr + (cr - gr) * boost * 0.4);
    const g = Math.round(gg + (cg - gg) * boost * 0.4);
    const b = Math.round(gb + (cb - gb) * boost * 0.4);

    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${baseAlpha + boost * 0.08})`;
    ctx.lineWidth = 0.5 + perspective * 0.8 + boost * 0.3;
    ctx.stroke();
  }

  // ── Vertical lines (converging to vanishing point) ──
  const vanishX = w * 0.5;
  for (let i = 0; i <= verticalLines; i++) {
    const t = i / verticalLines;
    const bottomX = t * w * 1.5 - w * 0.25;

    ctx.beginPath();
    const steps = 35;
    for (let s = 0; s <= steps; s++) {
      const st = s / steps;
      const perspective = Math.pow(st, perspectiveExp);
      const y = horizonY + (h - horizonY) * perspective;
      const x = vanishX + (bottomX - vanishX) * perspective;

      const { dy } = computeGridDisplacement(
        x, y, wells, mouseX, mouseY,
        BG.grid.mouseWarpStrength * perspective,
        BG.grid.mouseWarpRadius
      );

      const py = y + dy;
      if (s === 0) ctx.moveTo(x, py);
      else ctx.lineTo(x, py);
    }

    // Gentle edge fade — keep verticals visible across full width
    const edgeFade = 1 - Math.abs(t - 0.5) * 0.6; // 0.7 at edges, 1.0 at center
    const alpha = (0.08 + 0.06 * edgeFade) * alphaMultiplier;
    ctx.strokeStyle = `rgba(${gr}, ${gg}, ${gb}, ${alpha})`;
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }

  ctx.restore();
}
