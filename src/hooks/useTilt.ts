"use client";

import { useRef, useCallback } from "react";
import { useMotionValue, useSpring } from "framer-motion";

const springConfig = { stiffness: 300, damping: 20, mass: 0.5 };

export function useTilt(maxTilt = 7) {
  const ref = useRef<HTMLDivElement>(null);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;  // 0 to 1
      const y = (e.clientY - rect.top) / rect.height;  // 0 to 1

      // Map to tilt angles (inverted for natural feel)
      rotateX.set((y - 0.5) * -maxTilt * 2);
      rotateY.set((x - 0.5) * maxTilt * 2);
    },
    [maxTilt, rotateX, rotateY]
  );

  const onMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  return {
    ref,
    tiltStyle: {
      rotateX: springRotateX,
      rotateY: springRotateY,
      transformPerspective: 1000,
    },
    onMouseMove,
    onMouseLeave,
  };
}
