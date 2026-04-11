"use client";

import React, { useEffect, useRef, useCallback } from "react";
import type { NeuralNode, GravityWell, AmbientParticle, HudReadout, Star } from "./types";
import { initStars, renderStaticStarfield, drawTwinkle } from "./layers/starfield";
import { drawSpacetimeGrid } from "./layers/grid";
import { initNodes, drawNodes } from "./layers/nodes";
import { initParticles, drawParticles } from "./layers/particles";
import { initHud, drawHud } from "./layers/hud";
import { tickDynamicWells, getDynamicWells } from "./gravityWellStore";
import { BG } from "./config";

export default function BackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  // Scene state refs
  const starsRef = useRef<Star[]>([]);
  const starfieldCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const nodesRef = useRef<NeuralNode[]>([]);
  const wellsRef = useRef<GravityWell[]>([]);
  const particlesRef = useRef<AmbientParticle[]>([]);
  const hudRef = useRef<HudReadout[]>([]);
  const isMobileRef = useRef(false);

  // Mouse (actual and lerped)
  const actualMouseRef = useRef({ x: -1000, y: -1000 });
  const lerpedMouseRef = useRef({ x: -1000, y: -1000 });

  // Cursor light trail buffer
  const trailRef = useRef<{ x: number; y: number; time: number }[]>([]);
  const trailFrameRef = useRef(0);

  // Base node well strengths (for hover boosting)
  const baseWellStrengthsRef = useRef<number[]>([]);

  const initScene = useCallback((w: number, h: number, dpr: number) => {
    isMobileRef.current = w < 768;

    // Layer 1: Starfield
    starsRef.current = initStars(w, h);
    starfieldCanvasRef.current = renderStaticStarfield(w * dpr, h * dpr,
      starsRef.current.map(s => ({ ...s, x: s.x * dpr, y: s.y * dpr, size: s.size * dpr }))
    );

    // Layer 3: Neural nodes + gravity wells
    const { nodes, wells } = initNodes(w, h, isMobileRef.current);
    nodesRef.current = nodes;
    wellsRef.current = wells;
    baseWellStrengthsRef.current = wells.map((w) => w.strength);

    // Ambient particles
    particlesRef.current = initParticles(w, h, isMobileRef.current);

    // Layer 6: HUD
    hudRef.current = isMobileRef.current ? [] : initHud(w, h);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let resizeTimer: ReturnType<typeof setTimeout>;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initScene(w, h, dpr);
    };

    const debouncedResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 250);
    };

    // Reduced motion: render a single static frame and stop
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    resize();
    window.addEventListener("resize", debouncedResize);

    if (prefersReducedMotion) {
      // Render static starfield only, skip all animations
      if (starfieldCanvasRef.current) {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.drawImage(starfieldCanvasRef.current, 0, 0);
        ctx.restore();
      }
      return () => {
        window.removeEventListener("resize", debouncedResize);
        clearTimeout(resizeTimer);
      };
    }

    const onMouseMove = (e: MouseEvent) => {
      actualMouseRef.current.x = e.clientX;
      actualMouseRef.current.y = e.clientY;
    };
    window.addEventListener("mousemove", onMouseMove);

    let lastTime = performance.now();
    const startTime = lastTime;

    const animate = (now: number) => {
      const deltaTime = Math.min((now - lastTime) / 1000, 0.05); // Cap delta to prevent jumps
      lastTime = now;
      const time = (now - startTime) / 1000;

      // Lerp mouse
      const lm = lerpedMouseRef.current;
      const am = actualMouseRef.current;
      lm.x += (am.x - lm.x) * 0.06;
      lm.y += (am.y - lm.y) * 0.06;

      ctx.clearRect(0, 0, w, h);

      // ── Dynamic wells: tick lerps + merge with static wells ──
      tickDynamicWells(deltaTime);
      const dynamicWells = getDynamicWells();
      const allWells: GravityWell[] = [
        ...wellsRef.current,
        ...dynamicWells.map((dw) => ({
          x: dw.x,
          y: dw.y,
          strength: dw.currentStrength,
          radius: dw.radius,
        })),
      ];

      // ── Boost node wells on mouse proximity ──
      const nodes = nodesRef.current;
      const baseStrengths = baseWellStrengthsRef.current;
      for (let i = 0; i < nodes.length && i < wellsRef.current.length; i++) {
        const ndx = lm.x - nodes[i].baseX;
        const ndy = lm.y - nodes[i].baseY;
        const dist = Math.sqrt(ndx * ndx + ndy * ndy);
        const attraction = Math.max(0, 1 - dist / BG.mouse.nodeAttractionRadius);
        wellsRef.current[i].strength = baseStrengths[i] * (1 + attraction * 2.5);
      }

      // ── Scroll-driven grid alpha fade ──
      const scrollY = window.scrollY;
      const scrollProgress = Math.min(scrollY / h, 1);
      const gridAlphaMultiplier = 1.0 - scrollProgress * 0.5;

      // ── Layer 1: Starfield ──
      if (starfieldCanvasRef.current) {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.drawImage(starfieldCanvasRef.current, 0, 0);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.restore();
      }
      drawTwinkle(ctx, starsRef.current, time);

      // ── Layer 2: Spacetime Grid ──
      drawSpacetimeGrid(ctx, w, h, time, lm.x, lm.y, allWells, gridAlphaMultiplier);

      // ── Cursor light trail ──
      if (!isMobileRef.current && am.x > 0 && am.y > 0) {
        trailFrameRef.current++;
        if (trailFrameRef.current % 2 === 0) {
          trailRef.current.push({ x: lm.x, y: lm.y, time: now });
        }
        // Keep last 500ms of trail
        const cutoff = now - 500;
        trailRef.current = trailRef.current.filter((p) => p.time > cutoff);

        const trail = trailRef.current;
        const len = trail.length;
        for (let i = 0; i < len; i++) {
          const age = (now - trail[i].time) / 500; // 0 = newest, 1 = oldest
          const t = 1 - age;
          const r = 2 + t * 6;
          const alpha = t * 0.12;
          if (alpha < 0.005) continue;
          const grad = ctx.createRadialGradient(trail[i].x, trail[i].y, 0, trail[i].x, trail[i].y, r);
          grad.addColorStop(0, `rgba(0, 212, 255, ${alpha})`);
          grad.addColorStop(1, "rgba(0, 212, 255, 0)");
          ctx.beginPath();
          ctx.arc(trail[i].x, trail[i].y, r, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        }
      }

      // ── Ambient Particles ──
      drawParticles(ctx, particlesRef.current, w, h, time);

      // ── Gradient Orbs ──
      drawNodes(ctx, nodesRef.current, time, lm.x, lm.y);

      // ── Layer 6: HUD ──
      if (hudRef.current.length > 0) {
        drawHud(ctx, hudRef.current, time);
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", debouncedResize);
      window.removeEventListener("mousemove", onMouseMove);
      clearTimeout(resizeTimer);
    };
  }, [initScene]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: "transparent" }}
    />
  );
}
