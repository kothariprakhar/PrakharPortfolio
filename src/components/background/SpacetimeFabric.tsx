"use client";

import { useEffect, useRef } from "react";

// ── Config ──────────────────────────────────────────────────
const GRID = {
  rows: 22,
  cols: 28,
  lineColor: [255, 255, 255] as const,
  baseAlpha: 0.07,
  warpAlpha: 0.18,
};

const WARP = {
  strength: 220,
  radius: 350,
  lerpSpeed: 0.07,
  settleSpeed: 0.03,
};

const PERSPECTIVE = {
  vanishY: 0.12, // vanishing point Y (fraction of height)
  vanishX: 0.5,
  horizonSpread: 0.9, // how wide the grid spreads at bottom
  topInset: 0.08, // top edge inset from sides
};

// ── Math helpers ────────────────────────────────────────────
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function gaussian(dist: number, radius: number): number {
  return Math.exp(-(dist * dist) / (2 * radius * radius));
}

// ── Component ───────────────────────────────────────────────
export default function SpacetimeFabric() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const lerpedRef = useRef({ x: -9999, y: -9999 });
  const activeRef = useRef(0); // 0-1, decays when mouse inactive

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio, 2);

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    window.addEventListener("resize", resize);

    // ── Mouse tracking ──────────────────────────────────────
    let mouseTimeout: ReturnType<typeof setTimeout>;

    function onMouseMove(e: MouseEvent) {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      activeRef.current = 1;
      clearTimeout(mouseTimeout);
      mouseTimeout = setTimeout(() => {
        activeRef.current = 0;
      }, 3000);
    }

    function onMouseLeave() {
      activeRef.current = 0;
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);

    // ── Grid vertex computation ─────────────────────────────
    function getGridPoint(row: number, col: number): [number, number] {
      const t = row / GRID.rows; // 0 = top (horizon), 1 = bottom (near viewer)
      const s = col / GRID.cols; // 0 = left, 1 = right

      const vy = h * PERSPECTIVE.vanishY;
      const vx = w * PERSPECTIVE.vanishX;

      // Y: exponential spacing — tighter at horizon, wider near viewer
      const yT = Math.pow(t, 1.6);
      const y = vy + yT * (h - vy + h * 0.08);

      // X: interpolate between narrow top and wide bottom
      const topLeft = vx - w * PERSPECTIVE.topInset;
      const topRight = vx + w * PERSPECTIVE.topInset;
      const botLeft = vx - w * PERSPECTIVE.horizonSpread;
      const botRight = vx + w * PERSPECTIVE.horizonSpread;

      const xLeft = lerp(topLeft, botLeft, yT);
      const xRight = lerp(topRight, botRight, yT);
      const x = lerp(xLeft, xRight, s);

      return [x, y];
    }

    // ── Render loop ─────────────────────────────────────────
    function render() {
      ctx.clearRect(0, 0, w, h);

      // Lerp mouse position
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      lerpedRef.current.x = lerp(lerpedRef.current.x, mx, WARP.lerpSpeed);
      lerpedRef.current.y = lerp(lerpedRef.current.y, my, WARP.lerpSpeed);

      // Decay activity smoothly
      if (activeRef.current < 0.01) {
        // Gradually move lerped position off-screen to settle
        lerpedRef.current.x = lerp(lerpedRef.current.x, -9999, WARP.settleSpeed);
        lerpedRef.current.y = lerp(lerpedRef.current.y, -9999, WARP.settleSpeed);
      }

      const lx = lerpedRef.current.x;
      const ly = lerpedRef.current.y;

      // Compute displaced grid
      const grid: [number, number][][] = [];
      for (let r = 0; r <= GRID.rows; r++) {
        const row: [number, number][] = [];
        for (let c = 0; c <= GRID.cols; c++) {
          let [x, y] = getGridPoint(r, c);

          // Apply gravitational displacement
          const dx = x - lx;
          const dy = y - ly;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const g = gaussian(dist, WARP.radius);

          // Depth factor: rows closer to viewer warp more
          const depth = Math.pow(r / GRID.rows, 0.8);
          const displacement = g * WARP.strength * depth;
          y += displacement;

          row.push([x, y]);
        }
        grid.push(row);
      }

      const [cr, cg, cb] = GRID.lineColor;

      // ── Draw horizontal lines ─────────────────────────────
      for (let r = 0; r <= GRID.rows; r++) {
        ctx.beginPath();
        for (let c = 0; c <= GRID.cols; c++) {
          const [x, y] = grid[r][c];
          if (c === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        // Lines near the warp are brighter
        const rowMid = grid[r][Math.floor(GRID.cols / 2)];
        const distToMouse = Math.sqrt(
          (rowMid[0] - lx) ** 2 + (rowMid[1] - ly) ** 2
        );
        const warpGlow = gaussian(distToMouse, WARP.radius * 1.2);
        const alpha = lerp(GRID.baseAlpha, GRID.warpAlpha, warpGlow);

        ctx.strokeStyle = `rgba(${cr},${cg},${cb},${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // ── Draw vertical lines ───────────────────────────────
      for (let c = 0; c <= GRID.cols; c++) {
        ctx.beginPath();
        for (let r = 0; r <= GRID.rows; r++) {
          const [x, y] = grid[r][c];
          if (r === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        const colMid = grid[Math.floor(GRID.rows / 2)][c];
        const distToMouse = Math.sqrt(
          (colMid[0] - lx) ** 2 + (colMid[1] - ly) ** 2
        );
        const warpGlow = gaussian(distToMouse, WARP.radius * 1.2);
        const alpha = lerp(GRID.baseAlpha, GRID.warpAlpha, warpGlow);

        ctx.strokeStyle = `rgba(${cr},${cg},${cb},${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // ── Subtle glow at mouse position ─────────────────────
      if (lx > -1000) {
        const glowRadius = WARP.radius * 0.6;
        const gradient = ctx.createRadialGradient(lx, ly, 0, lx, ly, glowRadius);
        gradient.addColorStop(0, "rgba(255, 184, 71, 0.04)");
        gradient.addColorStop(0.5, "rgba(0, 212, 255, 0.02)");
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(lx - glowRadius, ly - glowRadius, glowRadius * 2, glowRadius * 2);
      }

      animRef.current = requestAnimationFrame(render);
    }

    animRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      clearTimeout(mouseTimeout);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
    />
  );
}
