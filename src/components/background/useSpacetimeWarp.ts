import { useRef } from "react";

/**
 * No-op hook retained for API compatibility with components that previously
 * registered hover-driven gravity wells against the cosmic background canvas.
 * The canvas was removed when the dark spacetime theme was retired; this hook
 * now just returns a ref and inert handlers so call sites don't need to change.
 */
export function useSpacetimeWarp(
  _id: string,
  _options?: { strength?: number; radius?: number }
) {
  const ref = useRef<HTMLElement>(null);
  const noop = () => {};
  return { ref, onMouseEnter: noop, onMouseLeave: noop };
}
