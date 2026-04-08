"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { computeBlogPositions, type BlogMass, type TopicCluster } from "./blogPhysics";
import {
  initParticles,
  drawParticles,
  drawAttentionBeams,
  drawMassOrbs,
  drawClusterLabels,
} from "./blogRenderer";
import type { BlogPostMeta } from "@/lib/blog";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export default function SpacetimeBlog({ posts }: { posts: BlogPostMeta[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const massesRef = useRef<BlogMass[]>([]);
  const clustersRef = useRef<TopicCluster[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const beamAlphaRef = useRef(0);
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const [masses, setMasses] = useState<BlogMass[]>([]);
  const hoveredRef = useRef(-1);
  const router = useRouter();

  // Sync state → ref for render loop
  useEffect(() => {
    hoveredRef.current = hoveredIndex;
  }, [hoveredIndex]);

  const computeLayout = useCallback(
    (w: number, h: number) => {
      const postData = posts.map((p) => ({
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        tags: p.tags,
      }));
      const { masses, clusters } = computeBlogPositions(postData, w, h);
      massesRef.current = masses;
      clustersRef.current = clusters;
      setMasses(masses);
      initParticles(w, h);
    },
    [posts]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio, 2);

    let w = 0;
    let h = 0;

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      computeLayout(w, h);
    }

    resize();
    window.addEventListener("resize", resize);

    // Mouse tracking + hit testing
    function onMouseMove(e: MouseEvent) {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      const masses = massesRef.current;
      let found = -1;
      for (let i = 0; i < masses.length; i++) {
        const dx = e.clientX - masses[i].x;
        const dy = e.clientY - masses[i].y;
        if (Math.sqrt(dx * dx + dy * dy) < masses[i].radius * 3.5) {
          found = i;
          break;
        }
      }
      setHoveredIndex(found);
      canvas!.style.cursor = found >= 0 ? "pointer" : "default";
    }

    function onClick(e: MouseEvent) {
      const masses = massesRef.current;
      for (const m of masses) {
        const dx = e.clientX - m.x;
        const dy = e.clientY - m.y;
        if (Math.sqrt(dx * dx + dy * dy) < m.radius * 3.5) {
          router.push(`/blog/${m.slug}`);
          return;
        }
      }
    }

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("click", onClick);

    // Render loop
    let startTime = performance.now();

    function render() {
      const time = (performance.now() - startTime) / 1000;
      ctx.clearRect(0, 0, w, h);

      const masses = massesRef.current;
      const clusters = clustersRef.current;
      const hovered = hoveredRef.current;

      // Lerp beam alpha
      const targetBeam = hovered >= 0 ? 1 : 0;
      beamAlphaRef.current = lerp(beamAlphaRef.current, targetBeam, 0.08);

      // Layer 1: Ambient particles
      drawParticles(ctx, w, h);

      // Layer 2: Cluster labels
      drawClusterLabels(ctx, clusters);

      // Layer 3: Attention beams
      drawAttentionBeams(ctx, masses, hovered, beamAlphaRef.current, time);

      // Layer 4: Mass orbs
      drawMassOrbs(ctx, masses, hovered, time);

      animRef.current = requestAnimationFrame(render);
    }

    animRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("click", onClick);
    };
  }, [computeLayout, router]);

  return (
    <div className="relative w-full h-screen">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* HTML overlay for post titles */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {masses.map((m, i) => (
          <a
            key={m.slug}
            href={`/blog/${m.slug}`}
            onClick={(e) => {
              e.preventDefault();
              router.push(`/blog/${m.slug}`);
            }}
            className="pointer-events-auto absolute text-center transition-all duration-300"
            style={{
              left: m.x,
              top: m.y + m.radius + 16,
              transform: "translateX(-50%)",
              maxWidth: 180,
            }}
          >
            <span
              className={`block font-display text-xs font-bold transition-colors duration-200 ${
                hoveredIndex === i ? "text-text-primary" : "text-text-muted"
              }`}
            >
              {m.title}
            </span>
            {hoveredIndex === i && (
              <span className="block mt-1 text-[10px] text-text-muted leading-tight line-clamp-2">
                {m.excerpt}
              </span>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}
