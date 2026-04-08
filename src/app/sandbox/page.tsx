"use client";

import dynamic from "next/dynamic";

const SpacetimeFabric = dynamic(
  () => import("@/components/background/SpacetimeFabric"),
  { ssr: false }
);

export default function SandboxPage() {
  return (
    <div className="min-h-screen bg-bg-primary relative">
      <SpacetimeFabric />
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="text-center max-w-xl px-6">
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-accent-blue mb-4">
            Spacetime Fabric Test
          </p>
          <h1 className="font-display font-bold text-5xl md:text-6xl text-text-primary leading-tight">
            Move your cursor
          </h1>
          <p className="mt-4 text-text-muted text-lg">
            Your mouse is a mass warping the fabric of spacetime.
          </p>
        </div>
      </div>
    </div>
  );
}
