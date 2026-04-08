// ── Types ────────────────────────────────────────────────────
export interface BlogMass {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  x: number;
  y: number;
  radius: number;
  glowColor: string;
  pulsePhase: number;
  pulseSpeed: number;
}

export interface TopicCluster {
  label: string;
  cx: number;
  cy: number;
  color: string;
  postCount: number;
}

// ── Tag region definitions ───────────────────────────────────
interface TagRegion {
  tags: string[];
  center: { x: number; y: number };
  color: string;
  label: string;
}

const TAG_REGIONS: TagRegion[] = [
  {
    tags: ["ai", "ml", "nlp", "deep learning", "computer vision", "llm", "rag", "ai strategy"],
    center: { x: 0.25, y: 0.35 },
    color: "rgba(0, 212, 255, 0.8)",
    label: "AI / ML",
  },
  {
    tags: ["product", "strategy", "product thinking", "roadmap", "gtm", "user research"],
    center: { x: 0.72, y: 0.28 },
    color: "rgba(255, 184, 71, 0.8)",
    label: "Product",
  },
  {
    tags: ["engineering", "react", "typescript", "python", "aws", "building"],
    center: { x: 0.5, y: 0.68 },
    color: "rgba(255, 45, 170, 0.8)",
    label: "Engineering",
  },
  {
    tags: ["career", "mba", "leadership", "product management"],
    center: { x: 0.76, y: 0.62 },
    color: "rgba(123, 47, 255, 0.8)",
    label: "Career",
  },
  {
    tags: ["startup", "edtech", "entrepreneurship"],
    center: { x: 0.28, y: 0.62 },
    color: "rgba(80, 220, 120, 0.8)",
    label: "Startup",
  },
];

// ── Helpers ──────────────────────────────────────────────────
function hashString(s: string): number {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = (hash * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function findTagRegion(tag: string): TagRegion | undefined {
  const lower = tag.toLowerCase();
  return TAG_REGIONS.find((r) => r.tags.some((t) => lower.includes(t) || t.includes(lower)));
}

// ── Jaccard similarity ──────────────────────────────────────
export function jaccardSimilarity(a: string[], b: string[]): number {
  const setA = new Set(a.map((t) => t.toLowerCase()));
  const setB = new Set(b.map((t) => t.toLowerCase()));
  let intersection = 0;
  for (const t of setA) if (setB.has(t)) intersection++;
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

// ── Compute positions ────────────────────────────────────────
export function computeBlogPositions(
  posts: { slug: string; title: string; excerpt: string; tags: string[] }[],
  w: number,
  h: number,
  maxVisible = 15
): { masses: BlogMass[]; clusters: TopicCluster[] } {
  const visible = posts.slice(0, maxVisible);
  const margin = 0.12;

  const masses: BlogMass[] = visible.map((post) => {
    // Weighted centroid of tag regions
    let cx = 0.5;
    let cy = 0.5;
    let matched = 0;
    let primaryColor = "rgba(0, 212, 255, 0.8)";

    for (const tag of post.tags) {
      const region = findTagRegion(tag);
      if (region) {
        cx += region.center.x;
        cy += region.center.y;
        matched++;
        if (matched === 1) primaryColor = region.color;
      }
    }

    if (matched > 0) {
      cx /= matched + 1;
      cy /= matched + 1;
    }

    // Deterministic jitter
    const hash = hashString(post.slug);
    const angle = ((hash % 360) * Math.PI) / 180;
    const jitter = 0.04 + (hash % 100) / 2500;
    cx += Math.cos(angle) * jitter;
    cy += Math.sin(angle) * jitter;

    // Clamp to margins
    cx = Math.max(margin, Math.min(1 - margin, cx));
    cy = Math.max(margin + 0.06, Math.min(1 - margin, cy));

    return {
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      tags: post.tags,
      x: cx * w,
      y: cy * h,
      radius: 10 + Math.min(post.tags.length, 5) * 2,
      glowColor: primaryColor,
      pulsePhase: (hash % 628) / 100,
      pulseSpeed: 0.3 + (hash % 30) / 100,
    };
  });

  // Force separation — 80 iterations
  const minSep = 120;
  for (let iter = 0; iter < 80; iter++) {
    for (let i = 0; i < masses.length; i++) {
      for (let j = i + 1; j < masses.length; j++) {
        const dx = masses[j].x - masses[i].x;
        const dy = masses[j].y - masses[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < minSep && dist > 0) {
          const push = ((minSep - dist) / dist) * 0.25;
          masses[i].x -= dx * push;
          masses[i].y -= dy * push;
          masses[j].x += dx * push;
          masses[j].y += dy * push;
        }
      }
    }
    // Re-clamp
    for (const m of masses) {
      m.x = Math.max(w * margin, Math.min(w * (1 - margin), m.x));
      m.y = Math.max(h * (margin + 0.06), Math.min(h * (1 - margin), m.y));
    }
  }

  // Build cluster summaries
  const clusterMap = new Map<string, { region: TagRegion; count: number }>();
  for (const post of posts) {
    for (const tag of post.tags) {
      const region = findTagRegion(tag);
      if (region && !clusterMap.has(region.label)) {
        clusterMap.set(region.label, { region, count: 0 });
      }
      if (region) clusterMap.get(region.label)!.count++;
    }
  }

  const clusters: TopicCluster[] = Array.from(clusterMap.values()).map(({ region, count }) => ({
    label: region.label,
    cx: region.center.x * w,
    cy: region.center.y * h,
    color: region.color,
    postCount: count,
  }));

  return { masses, clusters };
}
