/**
 * Module-level singleton store for dynamic gravity wells.
 * Any component can register/unregister wells via hover events.
 * The BackgroundCanvas animation loop reads from this store each frame.
 */

import { BG } from "./config";

interface DynamicWell {
  x: number;
  y: number;
  targetStrength: number;
  currentStrength: number;
  radius: number;
}

const wells = new Map<string, DynamicWell>();

export function registerHoverWell(
  id: string,
  rect: DOMRect,
  strength?: number,
  radius?: number
): void {
  const existing = wells.get(id);
  const s = strength ?? BG.hoverWarp.defaultStrength;
  const r = radius ?? BG.hoverWarp.defaultRadius;

  if (existing) {
    existing.x = rect.left + rect.width / 2;
    existing.y = rect.top + rect.height / 2;
    existing.targetStrength = s;
    existing.radius = r;
  } else {
    wells.set(id, {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      targetStrength: s,
      currentStrength: 0,
      radius: r,
    });
  }
}

export function unregisterHoverWell(id: string): void {
  const well = wells.get(id);
  if (well) {
    well.targetStrength = 0;
  }
}

export function tickDynamicWells(dt: number): void {
  const speed = BG.hoverWarp.lerpSpeed * dt;
  const toDelete: string[] = [];

  wells.forEach((well, id) => {
    well.currentStrength += (well.targetStrength - well.currentStrength) * Math.min(speed, 1);

    // Prune dead wells
    if (well.targetStrength === 0 && well.currentStrength < 0.01) {
      toDelete.push(id);
    }
  });

  for (const id of toDelete) {
    wells.delete(id);
  }
}

export function getDynamicWells(): DynamicWell[] {
  const result: DynamicWell[] = [];
  wells.forEach((well) => {
    if (well.currentStrength > 0.01) {
      result.push(well);
    }
  });
  return result;
}
