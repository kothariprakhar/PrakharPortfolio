import type { NeuralNode, InternalParticle, Vec3, GravityWell } from "../types";
import { BG } from "../config";
import { generateIcosphere, rotateVertex, projectVertex } from "../math/projection";

// ── Initialize neural nodes ──
export function initNodes(w: number, h: number, isMobile: boolean): { nodes: NeuralNode[]; wells: GravityWell[] } {
  const configs = isMobile ? BG.nodes.mobile : BG.nodes.desktop;
  const subdivisions = isMobile ? BG.nodes.subdivisions.mobile : BG.nodes.subdivisions.desktop;
  const { vertices, edges } = generateIcosphere(subdivisions);

  const nodes: NeuralNode[] = configs.map((cfg, i) => {
    // Scale vertices to node radius
    const scaledVerts = vertices.map((v) => ({
      x: v.x * cfg.radius,
      y: v.y * cfg.radius,
      z: v.z * cfg.radius,
    }));

    // Internal particles
    const particles: InternalParticle[] = [];
    for (let p = 0; p < BG.nodes.internalParticleCount; p++) {
      particles.push({
        theta: Math.random() * Math.PI * 2,
        phi: Math.random() * Math.PI,
        r: cfg.radius * (0.15 + Math.random() * 0.55),
        speed: 0.2 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // Random rotation axis (normalized)
    const ax = Math.random() - 0.5;
    const ay = Math.random() - 0.5;
    const az = Math.random() - 0.5;
    const alen = Math.sqrt(ax * ax + ay * ay + az * az);

    return {
      id: i,
      baseX: cfg.cx * w,
      baseY: cfg.cy * h,
      screenX: cfg.cx * w,
      screenY: cfg.cy * h,
      radius: cfg.radius,
      sphereVertices: scaledVerts,
      sphereEdges: edges,
      internalParticles: particles,
      rotationSpeed: 0.15 + Math.random() * 0.2,
      rotationAxis: { x: ax / alen, y: ay / alen, z: az / alen },
      phase: Math.random() * Math.PI * 2,
      pulseSpeed: 0.3 + Math.random() * 0.3,
      importance: cfg.importance,
    };
  });

  // Create gravity wells under each node
  const wells: GravityWell[] = nodes.map((n) => ({
    x: n.baseX,
    y: n.baseY + n.radius * 1.5,
    strength: 20 * n.importance,
    radius: n.radius * 3,
  }));

  return { nodes, wells };
}

// ── Draw all nodes ──
export function drawNodes(
  ctx: CanvasRenderingContext2D,
  nodes: NeuralNode[],
  time: number,
  mouseX: number,
  mouseY: number
) {
  const [gr, gg, gb] = BG.colors.nodeGold;
  const fov = 300;
  const camDist = 200;

  for (const node of nodes) {
    const pulse = 1.0 + Math.sin(time * node.pulseSpeed + node.phase) * BG.nodes.pulseAmplitude;

    // Mouse interaction
    const dx = mouseX - node.baseX;
    const dy = mouseY - node.baseY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const attraction = Math.max(0, 1 - dist / BG.mouse.nodeAttractionRadius);
    const glowBoost = attraction * BG.mouse.nodeGlowBoost;

    node.screenX = node.baseX + dx * attraction * BG.mouse.nodeAttractionStrength;
    node.screenY = node.baseY + dy * attraction * BG.mouse.nodeAttractionStrength;

    const sx = node.screenX;
    const sy = node.screenY;
    const r = node.radius * pulse;

    // ── Outer glow ──
    const glowR = r * BG.nodes.glowRadiusMultiplier;
    const glowAlpha = (0.08 + glowBoost * 0.12) * pulse;
    const glow = ctx.createRadialGradient(sx, sy, r * 0.2, sx, sy, glowR);
    glow.addColorStop(0, `rgba(${gr}, ${gg}, ${gb}, ${glowAlpha})`);
    glow.addColorStop(0.4, `rgba(${gr}, ${gg}, ${gb}, ${glowAlpha * 0.3})`);
    glow.addColorStop(1, "transparent");
    ctx.beginPath();
    ctx.arc(sx, sy, glowR, 0, Math.PI * 2);
    ctx.fillStyle = glow;
    ctx.fill();

    // ── Wireframe sphere ──
    const angle = time * node.rotationSpeed;
    const rotatedVerts = node.sphereVertices.map((v) =>
      rotateVertex(v, node.rotationAxis, angle)
    );
    const projected = rotatedVerts.map((v) => {
      const p = projectVertex(v, fov, camDist);
      return { x: sx + p.x, y: sy + p.y, depth: p.depth };
    });

    // Draw edges with back-face dimming
    for (const [a, b] of node.sphereEdges) {
      const pa = projected[a];
      const pb = projected[b];
      const avgDepth = (pa.depth + pb.depth) / 2;

      // Back-face dimming: edges behind center are dimmer
      const depthFactor = avgDepth > 0
        ? BG.nodes.wireframeAlphaBack
        : BG.nodes.wireframeAlphaFront;

      const alpha = depthFactor * pulse * (1 + glowBoost * 0.5);

      ctx.beginPath();
      ctx.moveTo(pa.x, pa.y);
      ctx.lineTo(pb.x, pb.y);
      ctx.strokeStyle = `rgba(${gr}, ${gg}, ${gb}, ${alpha})`;
      ctx.lineWidth = 0.6;
      ctx.stroke();
    }

    // ── Internal particles ──
    for (const p of node.internalParticles) {
      p.theta += p.speed * 0.008;
      p.phi += p.speed * 0.005;

      const px = p.r * Math.sin(p.phi) * Math.cos(p.theta);
      const py = p.r * Math.sin(p.phi) * Math.sin(p.theta);
      const pz = p.r * Math.cos(p.phi);

      const rotated = rotateVertex({ x: px, y: py, z: pz }, node.rotationAxis, angle);
      const proj = projectVertex(rotated, fov, camDist);

      const particleAlpha = rotated.z > 0 ? 0.15 : 0.35;
      ctx.beginPath();
      ctx.arc(sx + proj.x, sy + proj.y, 0.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${gr}, ${gg}, ${gb}, ${particleAlpha * pulse})`;
      ctx.fill();
    }

    // ── Core glow ──
    const coreR = r * 0.12;
    const coreGlow = ctx.createRadialGradient(sx, sy, 0, sx, sy, coreR);
    coreGlow.addColorStop(0, `rgba(255, 230, 180, ${0.4 * pulse})`);
    coreGlow.addColorStop(1, `rgba(${gr}, ${gg}, ${gb}, 0)`);
    ctx.beginPath();
    ctx.arc(sx, sy, coreR, 0, Math.PI * 2);
    ctx.fillStyle = coreGlow;
    ctx.fill();
  }
}
