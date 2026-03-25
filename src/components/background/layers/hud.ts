import type { HudReadout } from "../types";
import { BG } from "../config";

const HUD_TEXTS: { lines: string[]; color: "cyan" | "gold" }[] = [
  { lines: ["NEURAL_NET_V2.1", "STATUS: ACTIVE", "NODES: 5"], color: "cyan" },
  { lines: ["TENSOR_FLOW // 01", "LATENCY: 0.003ms", "SYNC: 99.7%"], color: "gold" },
  { lines: ["SPACETIME_GRID", "CURVATURE: 0.847", "FIELD: STABLE"], color: "cyan" },
  { lines: ["SYNAPSE_MAP", "DENSITY: 0.923", "SIGNAL: STRONG"], color: "gold" },
];

// ── Initialize HUD readouts ──
export function initHud(w: number, h: number): HudReadout[] {
  const margin = 30;
  const positions = [
    { x: margin, y: margin + 10 },
    { x: w - margin - 140, y: margin + 10 },
    { x: margin, y: h - margin - 50 },
    { x: w - margin - 150, y: h - margin - 50 },
  ];

  return HUD_TEXTS.map((text, i) => ({
    x: positions[i].x,
    y: positions[i].y,
    lines: text.lines,
    fadePhase: (i / HUD_TEXTS.length) * Math.PI * 2,
    color: text.color,
  }));
}

// ── Draw HUD readouts ──
export function drawHud(
  ctx: CanvasRenderingContext2D,
  readouts: HudReadout[],
  time: number
) {
  const [cr, cg, cb] = BG.colors.accentCyan;
  const [gr, gg, gb] = BG.colors.nodeGold;

  ctx.save();
  ctx.font = `${BG.hud.fontSize}px "JetBrains Mono", monospace`;
  ctx.textBaseline = "top";

  for (const readout of readouts) {
    // Fade cycle
    const fade = 0.5 + 0.5 * Math.sin(time * (Math.PI * 2 / BG.hud.fadeCycle) + readout.fadePhase);
    const alpha = BG.hud.alpha * fade;
    if (alpha < 0.02) continue;

    const [r, g, b] = readout.color === "cyan" ? [cr, cg, cb] : [gr, gg, gb];

    for (let i = 0; i < readout.lines.length; i++) {
      let text = readout.lines[i];

      // Animate numeric values
      if (text.includes("0.003")) {
        text = text.replace("0.003", (0.002 + Math.sin(time * 0.7) * 0.001).toFixed(3));
      }
      if (text.includes("0.847")) {
        text = text.replace("0.847", (0.84 + Math.sin(time * 0.3) * 0.02).toFixed(3));
      }
      if (text.includes("0.923")) {
        text = text.replace("0.923", (0.92 + Math.cos(time * 0.4) * 0.015).toFixed(3));
      }
      if (text.includes("99.7")) {
        text = text.replace("99.7", (99.5 + Math.sin(time * 0.2) * 0.4).toFixed(1));
      }

      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
      ctx.fillText(text, readout.x, readout.y + i * (BG.hud.fontSize + 4));
    }
  }

  ctx.restore();
}
