export interface Vec2 {
  x: number;
  y: number;
}

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface NeuralNode {
  id: number;
  baseX: number;
  baseY: number;
  screenX: number;
  screenY: number;
  radius: number;
  color: readonly [number, number, number];
  phase: number;
  pulseSpeed: number;
  importance: number;
}

export interface AmbientParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
  phase: number;
}

export interface GravityWell {
  x: number;
  y: number;
  strength: number;
  radius: number;
}

export interface HudReadout {
  x: number;
  y: number;
  lines: string[];
  fadePhase: number;
  color: "cyan" | "gold";
}

export interface Star {
  x: number;
  y: number;
  size: number;
  brightness: number;
  twinkleSpeed: number;
  twinklePhase: number;
}
