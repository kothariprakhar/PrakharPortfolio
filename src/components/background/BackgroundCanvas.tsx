"use client";

import React, { useEffect, useRef, useCallback } from "react";
import type { NeuralNode, GravityWell, EnergyStream, AmbientParticle, HudReadout, Star } from "./types";
import { initStars, renderStaticStarfield, drawTwinkle } from "./layers/starfield";
import { drawSpacetimeGrid } from "./layers/grid";
import { initNodes, drawNodes } from "./layers/nodes";
import { initEnergyStreams, drawEnergyStreams } from "./layers/energyStreams";
import { initParticles, drawParticles } from "./layers/particles";
import { initHud, drawHud } from "./layers/hud";

export default function BackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  // Scene state refs
  const starsRef = useRef<Star[]>([]);
  const starfieldCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const nodesRef = useRef<NeuralNode[]>([]);
  const wellsRef = useRef<GravityWell[]>([]);
  const streamsRef = useRef<EnergyStream[]>([]);
  const particlesRef = useRef<AmbientParticle[]>([]);
  const hudRef = useRef<HudReadout[]>([]);
  const isMobileRef = useRef(false);

  // Mouse (actual and lerped)
  const actualMouseRef = useRef({ x: -1000, y: -1000 });
  const lerpedMouseRef = useRef({ x: -1000, y: -1000 });

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

    // Layer 4: Energy streams
    streamsRef.current = initEnergyStreams(nodes);

    // Layer 5: Ambient particles
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

    resize();
    window.addEventListener("resize", debouncedResize);

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

      // ── Layer 1: Starfield ──
      if (starfieldCanvasRef.current) {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform for drawImage
        ctx.drawImage(starfieldCanvasRef.current, 0, 0);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.restore();
      }
      drawTwinkle(ctx, starsRef.current, time);

      // ── Layer 2: Spacetime Grid ──
      drawSpacetimeGrid(ctx, w, h, time, lm.x, lm.y, wellsRef.current);

      // ── Layer 5: Ambient Particles (behind streams and nodes for depth) ──
      drawParticles(ctx, particlesRef.current, w, h, time);

      // ── Layer 4: Energy Streams ──
      drawEnergyStreams(ctx, streamsRef.current, nodesRef.current, time, lm.x, lm.y, deltaTime);

      // ── Layer 3: Neural Nodes (on top) ──
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
