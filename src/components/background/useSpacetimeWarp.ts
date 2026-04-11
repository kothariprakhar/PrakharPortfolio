"use client";

import { useRef, useCallback } from "react";
import { registerHoverWell, unregisterHoverWell } from "./gravityWellStore";
import { useTheme } from "@/context/ThemeContext";

/**
 * Hook that registers an HTML element as a dynamic gravity well on hover.
 * The spacetime grid warps around the element when the mouse enters.
 * No-ops in light mode (no canvas to warp).
 */
export function useSpacetimeWarp(
  id: string,
  options?: { strength?: number; radius?: number }
) {
  const ref = useRef<HTMLElement>(null);
  const { resolvedTheme } = useTheme();

  const onMouseEnter = useCallback(() => {
    if (resolvedTheme !== "dark") return;
    const el = ref.current;
    if (!el) return;
    registerHoverWell(id, el.getBoundingClientRect(), options?.strength, options?.radius);
  }, [id, options?.strength, options?.radius, resolvedTheme]);

  const onMouseLeave = useCallback(() => {
    if (resolvedTheme !== "dark") return;
    unregisterHoverWell(id);
  }, [id, resolvedTheme]);

  return { ref, onMouseEnter, onMouseLeave };
}
