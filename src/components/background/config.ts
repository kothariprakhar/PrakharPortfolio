export const BG = {
  colors: {
    nodeGold: [255, 184, 71] as const,
    accentCyan: [0, 212, 255] as const,
    accentPurple: [123, 47, 255] as const,
    gridPurple: [100, 50, 180] as const,
    starWhite: [200, 220, 255] as const,
  },

  stars: {
    count: 300,
    twinkleCount: 50,
    minSize: 0.3,
    maxSize: 1.3,
  },

  nebula: {
    blobs: [
      { cx: 0.2, cy: 0.15, r: 350, color: [80, 20, 140], alpha: 0.04 },
      { cx: 0.8, cy: 0.3, r: 300, color: [20, 15, 60], alpha: 0.05 },
      { cx: 0.5, cy: 0.75, r: 400, color: [40, 50, 120], alpha: 0.035 },
      { cx: 0.85, cy: 0.8, r: 250, color: [60, 10, 100], alpha: 0.03 },
    ],
  },

  grid: {
    horizonY: 0.42,
    horizontalLines: 18,
    verticalLines: 24,
    perspectiveExp: 1.9,
    mouseWarpStrength: 45,
    mouseWarpRadius: 280,
  },

  hoverWarp: {
    defaultStrength: 55,
    defaultRadius: 200,
    lerpSpeed: 6,
  },

  nodes: {
    desktop: [
      { cx: 0.48, cy: 0.40, radius: 60, importance: 1.0, color: [0, 180, 240] as const },
      { cx: 0.74, cy: 0.26, radius: 38, importance: 0.7, color: [140, 80, 255] as const },
      { cx: 0.22, cy: 0.58, radius: 36, importance: 0.65, color: [0, 200, 180] as const },
      { cx: 0.18, cy: 0.22, radius: 30, importance: 0.5, color: [80, 130, 255] as const },
      { cx: 0.83, cy: 0.55, radius: 26, importance: 0.4, color: [160, 120, 255] as const },
    ],
    mobile: [
      { cx: 0.50, cy: 0.38, radius: 42, importance: 1.0, color: [0, 180, 240] as const },
      { cx: 0.75, cy: 0.25, radius: 26, importance: 0.65, color: [140, 80, 255] as const },
      { cx: 0.25, cy: 0.55, radius: 24, importance: 0.55, color: [0, 200, 180] as const },
    ],
    glowRadiusMultiplier: 4.5,
    pulseAmplitude: 0.06,
    outerGlowAlpha: 0.04,
    innerGlowAlpha: 0.12,
    coreAlpha: 0.30,
  },

  ambientParticles: {
    desktop: 80,
    mobile: 25,
    speedRange: [0.03, 0.12] as const,
    sizeRange: [0.3, 1.0] as const,
    alphaRange: [0.04, 0.12] as const,
  },

  hud: {
    alpha: 0.16,
    fadeCycle: 10,
    fontSize: 10,
  },

  mouse: {
    lerpFactor: 0.06,
    nodeAttractionRadius: 300,
    nodeAttractionStrength: 0.06,
    nodeGlowBoost: 0.5,
  },
};
