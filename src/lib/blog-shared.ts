/**
 * Browser-safe blog helpers and types.
 *
 * Anything that needs to run in client components imports from here.
 * Server-only filesystem reads live in `./blog.ts` and must NOT be
 * imported by client code (Next.js will fail the build with a missing
 * `fs` module if it leaks across the boundary).
 */

export interface BlogPost {
  /** Slug doubles as id; unique per file. */
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  /** Raw MDX body (without frontmatter). */
  content: string;
  tags: string[];
  cover_image: string | null;
  published: boolean;
  /** ISO date string. */
  created_at: string;
  /** ISO date string; defaults to created_at when not specified. */
  updated_at: string;
  /** Pre-computed display string like "12 min read" so client cards
   * don't need access to the full content. Computed at read time. */
  reading_time: string;
}

export type BlogPostMeta = Omit<BlogPost, "content">;

export function estimateReadingTime(content: string): string {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 250));
  return `${minutes} min read`;
}
