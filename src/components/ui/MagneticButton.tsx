"use client";

import { motion } from "framer-motion";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  as?: "a" | "button";
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  /** Legacy props from the prior magnetic / gravity-well system — no-ops now. */
  warpId?: string;
  warpStrength?: number;
  warpRadius?: number;
  magnetStrength?: number;
}

/**
 * Plain interactive element with a quiet press-feedback animation.
 * The "magnetic" pull-toward-cursor effect was removed as part of the
 * chrome-stripping pass; component name and props are retained for
 * API compatibility with existing call sites.
 */
export function MagneticButton({
  children,
  className,
  as = "button",
  href,
  onClick,
}: MagneticButtonProps) {
  const Component = as === "a" ? motion.a : motion.button;

  return (
    <Component
      href={href}
      onClick={onClick}
      className={className}
      whileTap={{ scale: 0.97 }}
    >
      {children}
    </Component>
  );
}
