import type { NeuralNode, GravityWell } from "../types";
import { BG } from "../config";

// ── Initialize nodes as gradient orb anchors ──
export function initNodes(
  w: number,
  h: number,
  isMobile: boolean
): { nodes: NeuralNode[]; wells: GravityWell[] } {
  const configs = isMobile ? BG.nodes.mobile : BG.nodes.desktop;

  const nodes: NeuralNode[] = configs.map((cfg, i) => ({
    id: i,
    baseX: cfg.cx * w,
    baseY: cfg.cy * h,
    screenX: cfg.cx * w,
    screenY: cfg.cy * h,
    radius: cfg.radius,
    color: cfg.color,
    phase: Math.random() * Math.PI * 2,
    pulseSpeed: 0.3 + Math.random() * 0.3,
    importance: cfg.importance,
  }));

  // Create gravity wells under each node
  const wells: GravityWell[] = nodes.map((n) => ({
    x: n.baseX,
    y: n.baseY + n.radius * 1.5,
    strength: 20 * n.importance,
    radius: n.radius * 3,
  }));

  return { nodes, wells };
}

// ── Draw gradient orbs ──
export function drawNodes(
  ctx: CanvasRenderingContext2D,
  nodes: NeuralNode[],
  time: number,
  mouseX: number,
  mouseY: number
) {
  for (const node of nodes) {
    const pulse =
      1.0 +
      Math.sin(time * node.pulseSpeed + node.phase) * BG.nodes.pulseAmplitude;

    // Mouse interaction — attract toward cursor
    const dx = mouseX - node.baseX;
    const dy = mouseY - node.baseY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const attraction = Math.max(
      0,
      1 - dist / BG.mouse.nodeAttractionRadius
    );
    const glowBoost = attraction * BG.mouse.nodeGlowBoost;

    node.screenX =
      node.baseX + dx * attraction * BG.mouse.nodeAttractionStrength;
    node.screenY =
      node.baseY + dy * attraction * BG.mouse.nodeAttractionStrength;

    const sx = node.screenX;
    const sy = node.screenY;
    const r = node.radius * pulse;
    const [cr, cg, cb] = node.color;

    // ── Layer 1: Outer glow (very large, very soft) ──
    const outerR = r * BG.nodes.glowRadiusMultiplier;
    const outerAlpha = (BG.nodes.outerGlowAlpha + glowBoost * 0.03) * pulse;
    const outerGrad = ctx.createRadialGradient(sx, sy, r * 0.3, sx, sy, outerR);
    outerGrad.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, ${outerAlpha})`);
    outerGrad.addColorStop(0.4, `rgba(${cr}, ${cg}, ${cb}, ${outerAlpha * 0.3})`);
    outerGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.beginPath();
    ctx.arc(sx, sy, outerR, 0, Math.PI * 2);
    ctx.fillStyle = outerGrad;
    ctx.fill();

    // ── Layer 2: Inner glow (medium, main visible body) ──
    const innerR = r * 1.8;
    const innerAlpha = (BG.nodes.innerGlowAlpha + glowBoost * 0.08) * pulse;
    const innerGrad = ctx.createRadialGradient(sx, sy, 0, sx, sy, innerR);
    innerGrad.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, ${innerAlpha})`);
    innerGrad.addColorStop(0.5, `rgba(${cr}, ${cg}, ${cb}, ${innerAlpha * 0.4})`);
    innerGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.beginPath();
    ctx.arc(sx, sy, innerR, 0, Math.PI * 2);
    ctx.fillStyle = innerGrad;
    ctx.fill();

    // ── Layer 3: Core (small, bright, warm white tint) ──
    const coreR = r * 0.3;
    const coreAlpha = (BG.nodes.coreAlpha + glowBoost * 0.15) * pulse;
    // Blend toward warm white at the core center
    const warmR = Math.min(255, cr + 80);
    const warmG = Math.min(255, cg + 60);
    const warmB = Math.min(255, cb + 40);
    const coreGrad = ctx.createRadialGradient(sx, sy, 0, sx, sy, coreR);
    coreGrad.addColorStop(0, `rgba(${warmR}, ${warmG}, ${warmB}, ${coreAlpha})`);
    coreGrad.addColorStop(0.6, `rgba(${cr}, ${cg}, ${cb}, ${coreAlpha * 0.5})`);
    coreGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.beginPath();
    ctx.arc(sx, sy, coreR, 0, Math.PI * 2);
    ctx.fillStyle = coreGrad;
    ctx.fill();
  }
}
