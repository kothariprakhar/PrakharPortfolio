"use client";

import { motion, useScroll } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-[51] origin-left"
      style={{
        scaleX: scrollYProgress,
        background: "linear-gradient(to right, var(--gradient-from), var(--gradient-to))",
      }}
    />
  );
}
