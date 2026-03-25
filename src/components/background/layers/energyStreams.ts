import type { NeuralNode, EnergyStream, Vec2 } from "../types";
import { BG } from "../config";
import { generateLightningPath, generateBranches } from "../math/bezierLightning";

// ── Initialize energy streams ──
export function initEnergyStreams(nodes: NeuralNode[]): EnergyStream[] {
  if (nodes.length < 2) return [];

  const streams: EnergyStream[] = [];
  const centralNode = nodes[0]; // Highest importance

  // Connect all satellite nodes to the central node
  for (let i = 1; i < nodes.length; i++) {
    const satellite = nodes[i];
    const dx = satellite.baseX - centralNode.baseX;
    const dy = satellite.baseY - centralNode.baseY;

    // Control points at 1/3 and 2/3 along the line, offset perpendicular
    const perpX = -dy * 0.15;
    const perpY = dx * 0.15;

    streams.push({
      fromNodeId: 0,
      toNodeId: i,
      baseControlPoints: [
        { x: centralNode.baseX + dx * 0.33 + perpX, y: centralNode.baseY + dy * 0.33 + perpY },
        { x: centralNode.baseX + dx * 0.66 - perpX, y: centralNode.baseY + dy * 0.66 - perpY },
      ],
      branchSeeds: Array.from({ length: BG.energy.branchCount }, (_, j) => i * 100 + j * 17 + 42),
      flowParticles: Array.from({ length: BG.energy.flowParticlesPerStream }, () => ({
        t: Math.random(),
        speed: BG.energy.flowSpeed * (0.7 + Math.random() * 0.6),
        size: 1.0 + Math.random() * 1.0,
      })),
      intensity: 1.0,
    });
  }

  // Connect a couple satellite pairs for visual density
  if (nodes.length >= 4) {
    streams.push(createStream(nodes, 1, 3));
  }
  if (nodes.length >= 5) {
    streams.push(createStream(nodes, 2, 4));
  }

  return streams;
}

function createStream(nodes: NeuralNode[], fromId: number, toId: number): EnergyStream {
  const from = nodes[fromId];
  const to = nodes[toId];
  const dx = to.baseX - from.baseX;
  const dy = to.baseY - from.baseY;
  const perpX = -dy * 0.1;
  const perpY = dx * 0.1;

  return {
    fromNodeId: fromId,
    toNodeId: toId,
    baseControlPoints: [
      { x: from.baseX + dx * 0.33 + perpX, y: from.baseY + dy * 0.33 + perpY },
      { x: from.baseX + dx * 0.66 - perpX, y: from.baseY + dy * 0.66 - perpY },
    ],
    branchSeeds: [fromId * 200 + toId * 13, fromId * 150 + toId * 7 + 99],
    flowParticles: Array.from({ length: 5 }, () => ({
      t: Math.random(),
      speed: BG.energy.flowSpeed * (0.7 + Math.random() * 0.6),
      size: 0.8 + Math.random() * 0.8,
    })),
    intensity: 0.6,
  };
}

// ── Evaluate bezier at t ──
function evalBezier(p0: Vec2, p1: Vec2, p2: Vec2, p3: Vec2, t: number): Vec2 {
  const mt = 1 - t;
  return {
    x: mt * mt * mt * p0.x + 3 * mt * mt * t * p1.x + 3 * mt * t * t * p2.x + t * t * t * p3.x,
    y: mt * mt * mt * p0.y + 3 * mt * mt * t * p1.y + 3 * mt * t * t * p2.y + t * t * t * p3.y,
  };
}

// ── Draw energy streams ──
export function drawEnergyStreams(
  ctx: CanvasRenderingContext2D,
  streams: EnergyStream[],
  nodes: NeuralNode[],
  time: number,
  mouseX: number,
  mouseY: number,
  deltaTime: number
) {
  const [cr, cg, cb] = BG.colors.accentCyan;
  const [gr, gg, gb] = BG.colors.nodeGold;

  for (const stream of streams) {
    const fromNode = nodes[stream.fromNodeId];
    const toNode = nodes[stream.toNodeId];
    const start: Vec2 = { x: fromNode.screenX, y: fromNode.screenY };
    const end: Vec2 = { x: toNode.screenX, y: toNode.screenY };

    // Animate control points (lissajous drift)
    const cp1: Vec2 = {
      x: stream.baseControlPoints[0].x + Math.sin(time * BG.energy.driftSpeed + stream.fromNodeId) * BG.energy.controlPointDrift,
      y: stream.baseControlPoints[0].y + Math.cos(time * BG.energy.driftSpeed * 0.7 + stream.toNodeId) * BG.energy.controlPointDrift,
    };
    const cp2: Vec2 = {
      x: stream.baseControlPoints[1].x + Math.cos(time * BG.energy.driftSpeed * 0.9 + stream.fromNodeId * 2) * BG.energy.controlPointDrift,
      y: stream.baseControlPoints[1].y + Math.sin(time * BG.energy.driftSpeed * 0.6 + stream.toNodeId * 2) * BG.energy.controlPointDrift,
    };

    // Generate lightning path
    const path = generateLightningPath(start, end, cp1, cp2, time, stream.fromNodeId * 10 + stream.toNodeId);

    // Mouse proximity intensification
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2;
    const mouseDist = Math.sqrt((mouseX - midX) ** 2 + (mouseY - midY) ** 2);
    const mouseBoost = Math.max(0, 1 - mouseDist / 300) * 0.5;
    const intensity = stream.intensity + mouseBoost;

    // ── Glow pass (wide, dim) ──
    drawPath(ctx, path, `rgba(${cr}, ${cg}, ${cb}, ${BG.energy.glowAlpha * intensity})`, BG.energy.glowWidth);

    // ── Medium pass ──
    drawPath(ctx, path, `rgba(${cr}, ${cg}, ${cb}, ${BG.energy.glowAlpha * 2.5 * intensity})`, 3);

    // ── Core pass (narrow, bright) ──
    drawPath(ctx, path, `rgba(${cr}, ${cg}, ${cb}, ${BG.energy.coreAlpha * intensity})`, BG.energy.coreWidth);

    // ── Branches ──
    for (let b = 0; b < stream.branchSeeds.length; b++) {
      const branches = generateBranches(path, 2, 40 + Math.random() * 30, stream.branchSeeds[b], time);
      for (const branch of branches) {
        const flicker = 0.5 + 0.5 * Math.sin(time * 3 + stream.branchSeeds[b] + b);
        drawPath(ctx, branch, `rgba(${cr}, ${cg}, ${cb}, ${0.12 * flicker * intensity})`, 0.6);
      }
    }

    // ── Flow particles ──
    for (const fp of stream.flowParticles) {
      fp.t += fp.speed * deltaTime;
      if (fp.t > 1) fp.t -= 1;

      const pos = evalBezier(start, cp1, cp2, end, fp.t);
      const alpha = 0.6 * intensity * (0.5 + 0.5 * Math.sin(fp.t * Math.PI));

      // Bright particle
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, fp.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${alpha})`;
      ctx.fill();

      // Tiny glow around particle
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, fp.size * 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${alpha * 0.15})`;
      ctx.fill();
    }
  }
}

function drawPath(ctx: CanvasRenderingContext2D, path: Vec2[], style: string, width: number) {
  if (path.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(path[0].x, path[0].y);
  for (let i = 1; i < path.length; i++) {
    ctx.lineTo(path[i].x, path[i].y);
  }
  ctx.strokeStyle = style;
  ctx.lineWidth = width;
  ctx.stroke();
}
