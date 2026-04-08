"use client";

import { useRef, useCallback } from "react";
import { registerHoverWell, unregisterHoverWell } from "./gravityWellStore";

/**
 * Hook that registers an HTML element as a dynamic gravity well on hover.
 * The spacetime grid warps around the element when the mouse enters.
 */
export function useSpacetimeWarp(
  id: string,
  options?: { strength?: number; radius?: number }
) {
  const ref = useRef<HTMLElement>(null);

  const onMouseEnter = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    registerHoverWell(id, el.getBoundingClientRect(), options?.strength, options?.radius);
  }, [id, options?.strength, options?.radius]);

  const onMouseLeave = useCallback(() => {
    unregisterHoverWell(id);
  }, [id]);

  return { ref, onMouseEnter, onMouseLeave };
}
