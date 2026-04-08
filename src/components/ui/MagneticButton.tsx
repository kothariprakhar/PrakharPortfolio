"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { registerHoverWell, unregisterHoverWell } from "@/components/background/gravityWellStore";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  as?: "a" | "button";
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  warpId?: string;
  warpStrength?: number;
  warpRadius?: number;
  magnetStrength?: number;
}

export function MagneticButton({
  children,
  className,
  as = "button",
  href,
  onClick,
  warpId,
  warpStrength = 25,
  warpRadius = 180,
  magnetStrength = 0.3,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      x.set((e.clientX - centerX) * magnetStrength);
      y.set((e.clientY - centerY) * magnetStrength);
    },
    [x, y, magnetStrength]
  );

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent) => {
      setHovered(true);
      if (warpId && ref.current) {
        registerHoverWell(warpId, ref.current.getBoundingClientRect(), warpStrength, warpRadius);
      }
    },
    [warpId, warpStrength, warpRadius]
  );

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    x.set(0);
    y.set(0);
    if (warpId) {
      unregisterHoverWell(warpId);
    }
  }, [x, y, warpId]);

  const Component = as === "a" ? motion.a : motion.button;

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="inline-block"
    >
      <Component
        href={href}
        onClick={onClick}
        className={className}
        whileTap={{ scale: 0.97 }}
      >
        {children}
      </Component>
    </motion.div>
  );
}
