import type { Vec3 } from "../types";

// ── Perspective projection (3D → 2D) ──
export function projectVertex(v: Vec3, fov: number, distance: number): { x: number; y: number; depth: number } {
  const scale = fov / (v.z + distance);
  return { x: v.x * scale, y: v.y * scale, depth: v.z };
}

// ── Rodrigues' rotation formula ──
export function rotateVertex(v: Vec3, axis: Vec3, angle: number): Vec3 {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const dot = v.x * axis.x + v.y * axis.y + v.z * axis.z;
  const crossX = axis.y * v.z - axis.z * v.y;
  const crossY = axis.z * v.x - axis.x * v.z;
  const crossZ = axis.x * v.y - axis.y * v.x;

  return {
    x: v.x * cos + crossX * sin + axis.x * dot * (1 - cos),
    y: v.y * cos + crossY * sin + axis.y * dot * (1 - cos),
    z: v.z * cos + crossZ * sin + axis.z * dot * (1 - cos),
  };
}

// ── Normalize a Vec3 ──
function normalize(v: Vec3): Vec3 {
  const len = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
  return len > 0 ? { x: v.x / len, y: v.y / len, z: v.z / len } : { x: 0, y: 0, z: 1 };
}

// ── Generate icosphere (geodesic sphere) ──
export function generateIcosphere(subdivisions: number): { vertices: Vec3[]; edges: [number, number][] } {
  // Golden ratio
  const t = (1 + Math.sqrt(5)) / 2;

  // Base icosahedron vertices (12)
  const baseVerts: Vec3[] = [
    { x: -1, y: t, z: 0 }, { x: 1, y: t, z: 0 }, { x: -1, y: -t, z: 0 }, { x: 1, y: -t, z: 0 },
    { x: 0, y: -1, z: t }, { x: 0, y: 1, z: t }, { x: 0, y: -1, z: -t }, { x: 0, y: 1, z: -t },
    { x: t, y: 0, z: -1 }, { x: t, y: 0, z: 1 }, { x: -t, y: 0, z: -1 }, { x: -t, y: 0, z: 1 },
  ].map(normalize);

  // Base icosahedron faces (20 triangles)
  let faces: [number, number, number][] = [
    [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
    [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
    [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
    [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
  ];

  let vertices = [...baseVerts];

  // Subdivide
  for (let s = 0; s < subdivisions; s++) {
    const midpointCache: Record<string, number> = {};
    const newFaces: [number, number, number][] = [];

    const getMidpoint = (a: number, b: number): number => {
      const key = a < b ? `${a}_${b}` : `${b}_${a}`;
      if (midpointCache[key] !== undefined) return midpointCache[key];

      const va = vertices[a];
      const vb = vertices[b];
      const mid = normalize({
        x: (va.x + vb.x) / 2,
        y: (va.y + vb.y) / 2,
        z: (va.z + vb.z) / 2,
      });
      const idx = vertices.length;
      vertices.push(mid);
      midpointCache[key] = idx;
      return idx;
    };

    for (const [a, b, c] of faces) {
      const ab = getMidpoint(a, b);
      const bc = getMidpoint(b, c);
      const ca = getMidpoint(c, a);
      newFaces.push([a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca]);
    }
    faces = newFaces;
  }

  // Extract unique edges from faces
  const edgeSet = new Set<string>();
  const edges: [number, number][] = [];
  for (const [a, b, c] of faces) {
    const pairs: [number, number][] = [[a, b], [b, c], [c, a]];
    for (const [p, q] of pairs) {
      const key = p < q ? `${p}_${q}` : `${q}_${p}`;
      if (!edgeSet.has(key)) {
        edgeSet.add(key);
        edges.push([p, q]);
      }
    }
  }

  return { vertices, edges };
}
