"use client";

import React, { useEffect, useRef, useCallback } from "react";

// ── Types ──
interface Node {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  radius: number;
  glowRadius: number;
  color: string;
  glowColor: string;
  phase: number;
  speed: number;
}

interface Edge {
  from: number;
  to: number;
}

// ── Canvas-based background ──
export default function BackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animRef = useRef<number>(0);
  const nodesRef = useRef<Node[]>([]);
  const edgesRef = useRef<Edge[]>([]);
  const isMobileRef = useRef(false);

  const initScene = useCallback((w: number, h: number) => {
    isMobileRef.current = w < 768;
    const nodeCount = isMobileRef.current ? 12 : 25;
    const nodes: Node[] = [];

    // Place nodes in a natural cluster, biased toward center
    for (let i = 0; i < nodeCount; i++) {
      // Use gaussian-like distribution for clustering
      const angle = Math.random() * Math.PI * 2;
      const radius = (Math.random() * 0.3 + 0.1) * Math.min(w, h);
      const cx = w * 0.5 + Math.cos(angle) * radius * (0.8 + Math.random() * 0.6);
      const cy = h * 0.45 + Math.sin(angle) * radius * (0.6 + Math.random() * 0.4);

      const x = Math.max(50, Math.min(w - 50, cx));
      const y = Math.max(50, Math.min(h - 50, cy));

      const rnd = Math.random();
      let color: string, glowColor: string;
      if (rnd < 0.4) {
        // Gold nodes (like Gemini reference)
        color = "rgba(255, 184, 71, 0.7)";
        glowColor = "rgba(255, 184, 71, 0.12)";
      } else if (rnd < 0.75) {
        // Cyan nodes
        color = "rgba(0, 212, 255, 0.6)";
        glowColor = "rgba(0, 212, 255, 0.08)";
      } else {
        // Purple nodes
        color = "rgba(123, 47, 255, 0.5)";
        glowColor = "rgba(123, 47, 255, 0.08)";
      }

      const nodeRadius = isMobileRef.current
        ? 1.5 + Math.random() * 2
        : 2 + Math.random() * 3;

      nodes.push({
        x, y,
        baseX: x,
        baseY: y,
        radius: nodeRadius,
        glowRadius: nodeRadius * (8 + Math.random() * 12),
        color,
        glowColor,
        phase: Math.random() * Math.PI * 2,
        speed: 0.2 + Math.random() * 0.4,
      });
    }

    // Build edges: connect to 1-2 nearest neighbors within distance
    const edges: Edge[] = [];
    const maxDist = Math.min(w, h) * 0.35;
    for (let i = 0; i < nodes.length; i++) {
      const dists: { idx: number; dist: number }[] = [];
      for (let j = 0; j < nodes.length; j++) {
        if (i === j) continue;
        const dx = nodes[j].baseX - nodes[i].baseX;
        const dy = nodes[j].baseY - nodes[i].baseY;
        dists.push({ idx: j, dist: Math.sqrt(dx * dx + dy * dy) });
      }
      dists.sort((a, b) => a.dist - b.dist);
      const count = 1 + Math.floor(Math.random() * 2);
      for (let k = 0; k < count && k < dists.length; k++) {
        if (dists[k].dist < maxDist) {
          // Avoid duplicates
          const exists = edges.some(
            (e) => (e.from === i && e.to === dists[k].idx) || (e.from === dists[k].idx && e.to === i)
          );
          if (!exists) edges.push({ from: i, to: dists[k].idx });
        }
      }
    }

    nodesRef.current = nodes;
    edgesRef.current = edges;
  }, []);

  const drawGrid = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, time: number, mx: number, my: number) => {
    // Perspective spacetime grid at the bottom
    const gridY = h * 0.65; // Start grid from 65% down
    const horizonY = h * 0.45;
    const gridLines = 30;
    const gridCols = 40;

    ctx.save();
    ctx.globalAlpha = 0.15;

    // Horizontal lines (receding into horizon)
    for (let i = 0; i <= gridLines; i++) {
      const t = i / gridLines;
      const perspective = Math.pow(t, 1.8); // Perspective compression
      const y = horizonY + (h - horizonY) * perspective;
      const spread = 0.3 + perspective * 0.7;

      ctx.beginPath();
      const segments = 60;
      for (let s = 0; s <= segments; s++) {
        const sx = (s / segments) * w;
        // Warp based on mouse proximity
        const distToMouse = Math.sqrt((sx - mx) ** 2 + (y - my) ** 2);
        const warp = Math.exp(-(distToMouse ** 2) / (40000 + 20000 * perspective)) * 15 * perspective;
        const wave = Math.sin(sx * 0.008 + time * 0.5) * 2 * perspective;
        const py = y + warp + wave;

        if (s === 0) ctx.moveTo(sx, py);
        else ctx.lineTo(sx, py);
      }

      const alpha = 0.03 + perspective * 0.08;
      ctx.strokeStyle = `rgba(123, 47, 255, ${alpha})`;
      ctx.lineWidth = 0.5 + perspective * 0.5;
      ctx.stroke();
    }

    // Vertical lines (converging to vanishing point)
    const vanishX = w * 0.5;
    for (let i = 0; i <= gridCols; i++) {
      const t = i / gridCols;
      const bottomX = t * w * 1.4 - w * 0.2;

      ctx.beginPath();
      const steps = 40;
      for (let s = 0; s <= steps; s++) {
        const st = s / steps;
        const perspective = Math.pow(st, 1.8);
        const y = horizonY + (h - horizonY) * perspective;
        const x = vanishX + (bottomX - vanishX) * perspective;

        // Apply warp
        const distToMouse = Math.sqrt((x - mx) ** 2 + (y - my) ** 2);
        const warp = Math.exp(-(distToMouse ** 2) / 50000) * 12 * perspective;
        const py = y + warp;

        if (s === 0) ctx.moveTo(x, py);
        else ctx.lineTo(x, py);
      }

      const alpha = 0.02 + 0.04 * (1 - Math.abs(t - 0.5) * 2);
      ctx.strokeStyle = `rgba(123, 47, 255, ${alpha})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    ctx.restore();
  }, []);

  const drawScene = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, time: number) => {
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;
    const nodes = nodesRef.current;
    const edges = edgesRef.current;

    // Clear
    ctx.clearRect(0, 0, w, h);

    // Draw spacetime grid
    drawGrid(ctx, w, h, time, mx, my);

    // Update node positions (subtle drift + mouse attraction)
    for (const node of nodes) {
      const driftX = Math.sin(time * node.speed + node.phase) * 8;
      const driftY = Math.cos(time * node.speed * 0.7 + node.phase + 1) * 6;

      // Gentle mouse attraction
      const dx = mx - node.baseX;
      const dy = my - node.baseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const attraction = Math.max(0, 1 - dist / 300) * 0.12;

      node.x = node.baseX + driftX + dx * attraction;
      node.y = node.baseY + driftY + dy * attraction;
    }

    // Draw edges (connections between nodes)
    for (const edge of edges) {
      const a = nodes[edge.from];
      const b = nodes[edge.to];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = Math.min(w, h) * 0.4;
      if (dist > maxDist) continue;

      const alpha = (1 - dist / maxDist) * 0.12;

      // Draw connection as gradient line
      const gradient = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
      gradient.addColorStop(0, `rgba(0, 212, 255, ${alpha})`);
      gradient.addColorStop(0.5, `rgba(123, 47, 255, ${alpha * 0.7})`);
      gradient.addColorStop(1, `rgba(255, 184, 71, ${alpha})`);

      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      // Slight curve for organic feel
      const midX = (a.x + b.x) / 2 + Math.sin(time + edge.from) * 5;
      const midY = (a.y + b.y) / 2 + Math.cos(time + edge.to) * 5;
      ctx.quadraticCurveTo(midX, midY, b.x, b.y);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }

    // Draw nodes with glow
    for (const node of nodes) {
      const pulse = 0.85 + Math.sin(time * 1.5 + node.phase) * 0.15;

      // Outer glow
      const glow = ctx.createRadialGradient(
        node.x, node.y, 0,
        node.x, node.y, node.glowRadius * pulse
      );
      glow.addColorStop(0, node.glowColor);
      glow.addColorStop(1, "transparent");

      ctx.beginPath();
      ctx.arc(node.x, node.y, node.glowRadius * pulse, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      // Core dot
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius * pulse, 0, Math.PI * 2);
      ctx.fillStyle = node.color;
      ctx.fill();
    }

    // Draw a few tiny star particles
    if (!isMobileRef.current) {
      ctx.save();
      for (let i = 0; i < 60; i++) {
        const px = ((i * 137.508) % w); // Golden angle distribution
        const py = ((i * 97.3) % h);
        const twinkle = 0.1 + Math.sin(time * 0.8 + i * 2.1) * 0.08;
        ctx.beginPath();
        ctx.arc(px, py, 0.5 + Math.sin(i) * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 220, 255, ${twinkle})`;
        ctx.fill();
      }
      ctx.restore();
    }
  }, [drawGrid]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);
      initScene(w, h);
    };

    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    window.addEventListener("mousemove", onMouseMove);

    let startTime = performance.now();
    const animate = (now: number) => {
      const time = (now - startTime) / 1000;
      const w = canvas.width / (Math.min(window.devicePixelRatio || 1, 2));
      const h = canvas.height / (Math.min(window.devicePixelRatio || 1, 2));
      drawScene(ctx, w, h, time);
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [initScene, drawScene]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: "transparent" }}
    />
  );
}
