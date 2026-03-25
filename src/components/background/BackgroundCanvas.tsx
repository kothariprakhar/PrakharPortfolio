"use client";

import { useEffect, useState, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ── Performance tier detection ──
function usePerformanceTier() {
  const [tier, setTier] = useState<"high" | "medium" | "low">("high");

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const cores = navigator.hardwareConcurrency || 2;

    if (isMobile || cores < 4) {
      setTier("low");
    } else if (cores < 8) {
      setTier("medium");
    }
  }, []);

  return tier;
}

// ── Mouse tracker ──
function useMousePosition() {
  const mouse = useRef(new THREE.Vector2(0, 0));

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return mouse;
}

// ── Neural Network Nodes ──
function NeuralNetwork({ nodeCount }: { nodeCount: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const mouse = useMousePosition();

  const { positions, basePositions, colors, edges } = React.useMemo(() => {
    const pos = new Float32Array(nodeCount * 3);
    const base = new Float32Array(nodeCount * 3);
    const col = new Float32Array(nodeCount * 3);

    const accentBlue = new THREE.Color("#00D4FF");
    const accentPurple = new THREE.Color("#7B2FFF");
    const nodeGold = new THREE.Color("#FFB847");

    for (let i = 0; i < nodeCount; i++) {
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 14;
      const z = (Math.random() - 0.5) * 6 - 2;
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      base[i * 3] = x;
      base[i * 3 + 1] = y;
      base[i * 3 + 2] = z;

      const r = Math.random();
      const color = r < 0.5 ? accentBlue : r < 0.8 ? accentPurple : nodeGold;
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }

    // Build edges: connect each node to 2-3 nearest neighbors
    const edgePositions: number[] = [];
    for (let i = 0; i < nodeCount; i++) {
      const ix = pos[i * 3], iy = pos[i * 3 + 1], iz = pos[i * 3 + 2];
      const distances: { idx: number; dist: number }[] = [];
      for (let j = 0; j < nodeCount; j++) {
        if (i === j) continue;
        const dx = pos[j * 3] - ix;
        const dy = pos[j * 3 + 1] - iy;
        const dz = pos[j * 3 + 2] - iz;
        distances.push({ idx: j, dist: Math.sqrt(dx * dx + dy * dy + dz * dz) });
      }
      distances.sort((a, b) => a.dist - b.dist);
      const neighbors = distances.slice(0, 2 + Math.floor(Math.random() * 2));
      for (const n of neighbors) {
        if (n.dist < 6) {
          edgePositions.push(ix, iy, iz, pos[n.idx * 3], pos[n.idx * 3 + 1], pos[n.idx * 3 + 2]);
        }
      }
    }

    return {
      positions: pos,
      basePositions: base,
      colors: col,
      edges: new Float32Array(edgePositions),
    };
  }, [nodeCount]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const time = clock.getElapsedTime();
    const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const mx = mouse.current.x * 10;
    const my = mouse.current.y * 7;

    for (let i = 0; i < nodeCount; i++) {
      const bx = basePositions[i * 3];
      const by = basePositions[i * 3 + 1];
      const bz = basePositions[i * 3 + 2];

      // Ambient drift
      const driftX = Math.sin(time * 0.3 + i * 1.7) * 0.3;
      const driftY = Math.cos(time * 0.25 + i * 2.3) * 0.25;
      const driftZ = Math.sin(time * 0.2 + i * 0.9) * 0.15;

      // Mouse attraction
      const dx = mx - bx;
      const dy = my - by;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const attraction = Math.max(0, 1 - dist / 8) * 0.8;

      posArray[i * 3] = bx + driftX + dx * attraction * 0.15;
      posArray[i * 3 + 1] = by + driftY + dy * attraction * 0.15;
      posArray[i * 3 + 2] = bz + driftZ;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // Update edges
    if (linesRef.current) {
      const linePos = linesRef.current.geometry.attributes.position.array as Float32Array;
      // Edge positions are pairs - update based on current node positions
      let edgeIdx = 0;
      for (let i = 0; i < nodeCount && edgeIdx < linePos.length; i++) {
        const ix = posArray[i * 3], iy = posArray[i * 3 + 1], iz = posArray[i * 3 + 2];
        for (let j = i + 1; j < nodeCount && edgeIdx < linePos.length; j++) {
          const jx = posArray[j * 3], jy = posArray[j * 3 + 1], jz = posArray[j * 3 + 2];
          const dx = jx - ix, dy = jy - iy, dz = jz - iz;
          const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (d < 5) {
            linePos[edgeIdx++] = ix;
            linePos[edgeIdx++] = iy;
            linePos[edgeIdx++] = iz;
            linePos[edgeIdx++] = jx;
            linePos[edgeIdx++] = jy;
            linePos[edgeIdx++] = jz;
          }
        }
      }
      linesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={3}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[edges, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#7B2FFF"
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </>
  );
}

// ── Spacetime Grid ──
function SpacetimeGrid() {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouse = useMousePosition();

  const { geometry, originalPositions } = React.useMemo(() => {
    const geo = new THREE.PlaneGeometry(35, 35, 60, 60);
    const orig = new Float32Array(geo.attributes.position.array);
    return { geometry: geo, originalPositions: orig };
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const time = clock.getElapsedTime();
    const posArray = meshRef.current.geometry.attributes.position.array as Float32Array;
    const mx = mouse.current.x * 12;
    const my = mouse.current.y * 12;

    for (let i = 0; i < posArray.length / 3; i++) {
      const ox = originalPositions[i * 3];
      const oy = originalPositions[i * 3 + 1];

      const dx = ox - mx;
      const dy = oy - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const warp = -2.5 * Math.exp(-(dist * dist) / 18);

      // Subtle ambient wave
      const wave = Math.sin(ox * 0.3 + time * 0.4) * Math.cos(oy * 0.3 + time * 0.3) * 0.2;

      posArray[i * 3 + 2] = warp + wave;
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <mesh ref={meshRef} geometry={geometry} rotation={[-Math.PI / 2.5, 0, 0]} position={[0, -6, -5]}>
      <meshBasicMaterial
        color="#7B2FFF"
        wireframe
        transparent
        opacity={0.06}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

// ── Floating Particles ──
function Particles({ count }: { count: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const mouse = useMousePosition();

  const positions = React.useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15 - 3;
    }
    return pos;
  }, [count]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const time = clock.getElapsedTime();
    const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      posArray[i * 3 + 1] += Math.sin(time * 0.1 + i) * 0.002;
      posArray[i * 3] += Math.cos(time * 0.08 + i * 0.5) * 0.001;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={1.5}
        color="#00D4FF"
        transparent
        opacity={0.15}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// ── Scene orchestrator ──
function Scene({ tier }: { tier: "high" | "medium" }) {
  const nodeCount = tier === "high" ? 50 : 30;
  const particleCount = tier === "high" ? 300 : 150;

  return (
    <>
      <NeuralNetwork nodeCount={nodeCount} />
      <SpacetimeGrid />
      {tier === "high" && <Particles count={particleCount} />}
    </>
  );
}

// ── CSS Fallback for mobile ──
function CSSFallback() {
  return (
    <div className="fixed inset-0 z-0">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, rgba(0, 212, 255, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 60%, rgba(123, 47, 255, 0.06) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(255, 184, 71, 0.04) 0%, transparent 40%)",
        }}
      />
      {/* Animated dots */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-accent-blue/20"
            style={{
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `pulse ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.5); }
        }
      `}</style>
    </div>
  );
}

// ── Main export ──
import React from "react";

export default function BackgroundCanvas() {
  const tier = usePerformanceTier();

  if (tier === "low") {
    return <CSSFallback />;
  }

  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        camera={{ position: [0, 0, 12], fov: 60 }}
      >
        <Scene tier={tier} />
      </Canvas>
    </div>
  );
}
