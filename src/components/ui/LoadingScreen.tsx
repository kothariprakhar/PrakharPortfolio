"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    // Skip on repeat visits within same session
    if (sessionStorage.getItem("pk-loaded")) {
      onComplete();
      return;
    }

    const timers = [
      setTimeout(() => setPhase(1), 200),   // Name fades in
      setTimeout(() => setPhase(2), 700),   // Line expands
      setTimeout(() => {
        sessionStorage.setItem("pk-loaded", "1");
        setPhase(3);                         // Exit
      }, 1400),
    ];

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  // Already loaded — don't render
  if (phase === 0 && typeof window !== "undefined" && sessionStorage.getItem("pk-loaded")) {
    return null;
  }

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {phase < 3 && (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-bg-primary"
        >
          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="font-display font-bold text-2xl md:text-3xl text-text-primary tracking-tight"
          >
            Prakhar Kothari
          </motion.h1>

          {/* Gradient line */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={phase >= 2 ? { scaleX: 1, opacity: 1 } : {}}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mt-4 h-[1px] w-32 origin-center"
            style={{
              background: "linear-gradient(to right, transparent, var(--gradient-from), var(--gradient-to), transparent)",
            }}
          />

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={phase >= 2 ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
            className="mt-3 font-mono text-xs tracking-[0.12em] text-accent-blue/60 uppercase"
          >
            AI Product Manager
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
