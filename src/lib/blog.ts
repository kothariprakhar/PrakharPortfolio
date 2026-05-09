import "server-only";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { BlogPost, BlogPostMeta } from "./blog-shared";

/**
 * File-based MDX blog — server-only.
 *
 * Posts live in `/content/blog/<slug>.mdx` with YAML frontmatter:
 *
 *   ---
 *   title: "..."
 *   excerpt: "..."
 *   date: "2026-04-15"          # ISO date; used for sort + display
 *   updated: "2026-04-20"       # optional; falls back to date
 *   tags: ["AI / ML", ...]
 *   cover_image: "/blog/x.png"  # optional; null otherwise
 *   published: true              # default true; set false to draft
 *   ---
 *
 *   ## Heading
 *   Body in MDX...
 *
 * IMPORTANT: do not import this file from a client component. Use
 * `./blog-shared` for types and the `estimateReadingTime` helper.
 */

// Re-export shared types so server consumers can import from one place.
export type { BlogPost, BlogPostMeta } from "./blog-shared";
export { estimateReadingTime } from "./blog-shared";

const POSTS_DIR = path.join(process.cwd(), "content", "blog");

function readAllPosts(): BlogPost[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const files = fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  const posts = files.map((file) => {
    const slug = file.replace(/\.(mdx|md)$/, "");
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf-8");
    const { data, content } = matter(raw);

    const created = data.date ?? new Date().toISOString();
    const createdISO =
      typeof created === "string" ? created : new Date(created).toISOString();
    const updated = data.updated ?? createdISO;
    const updatedISO =
      typeof updated === "string" ? updated : new Date(updated).toISOString();

    return {
      id: slug,
      slug,
      title: String(data.title ?? slug),
      excerpt: String(data.excerpt ?? ""),
      content,
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      cover_image: data.cover_image ? String(data.cover_image) : null,
      published: data.published !== false,
      created_at: createdISO,
      updated_at: updatedISO,
    } satisfies BlogPost;
  });

  return posts
    .filter((p) => p.published)
    .sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
}

const stripContent = (p: BlogPost): BlogPostMeta => {
  const { content: _content, ...meta } = p;
  void _content;
  return meta;
};

export async function getAllPosts(): Promise<BlogPostMeta[]> {
  return readAllPosts().map(stripContent);
}

export async function getLatestPosts(count: number): Promise<BlogPostMeta[]> {
  return readAllPosts().slice(0, count).map(stripContent);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  return readAllPosts().find((p) => p.slug === slug) ?? null;
}

export async function getAllSlugs(): Promise<string[]> {
  return readAllPosts().map((p) => p.slug);
}
