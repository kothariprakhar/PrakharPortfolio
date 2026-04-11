"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const springConfig = { stiffness: 300, damping: 25, mass: 0.5 };

export function CustomCursor() {
  const [isPointer, setIsPointer] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [visible, setVisible] = useState(false);

  // Dot follows mouse 1:1
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);

  // Ring follows with spring lag
  const ringX = useSpring(dotX, springConfig);
  const ringY = useSpring(dotY, springConfig);

  useEffect(() => {
    // Don't render on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMouseMove = (e: MouseEvent) => {
      dotX.set(e.clientX);
      dotY.set(e.clientY);
      if (!visible) setVisible(true);

      // Check if hovering interactive element
      const target = e.target as HTMLElement;
      const interactive = target.closest("a, button, [role='button'], input, textarea, select, [data-cursor='pointer']");
      setIsPointer(!!interactive);
    };

    const onMouseDown = () => setIsPressed(true);
    const onMouseUp = () => setIsPressed(false);
    const onMouseLeave = () => setVisible(false);
    const onMouseEnter = () => setVisible(true);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.documentElement.addEventListener("mouseleave", onMouseLeave);
    document.documentElement.addEventListener("mouseenter", onMouseEnter);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
      document.documentElement.removeEventListener("mouseenter", onMouseEnter);
    };
  }, [dotX, dotY, visible]);

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  const dotScale = isPressed ? 0.6 : 1;
  const ringScale = isPointer ? 1.5 : isPressed ? 0.85 : 1;

  return (
    <>
      {/* Dot */}
      <motion.div
        className="fixed top-0 left-0 z-[9998] pointer-events-none mix-blend-difference"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          animate={{ scale: dotScale, opacity: visible ? 1 : 0 }}
          transition={{ duration: 0.15 }}
          className="w-2 h-2 rounded-full bg-text-primary"
        />
      </motion.div>

      {/* Ring */}
      <motion.div
        className="fixed top-0 left-0 z-[9998] pointer-events-none"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          animate={{
            scale: ringScale,
            opacity: visible ? (isPointer ? 0.5 : 0.3) : 0,
          }}
          transition={{ duration: 0.2 }}
          className="w-10 h-10 rounded-full border border-accent-blue/40"
        />
      </motion.div>
    </>
  );
}
