import { supabase, isSupabaseConfigured } from "./supabase";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  cover_image: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export type BlogPostMeta = Omit<BlogPost, "content">;

const META_FIELDS = "id, slug, title, excerpt, tags, cover_image, published, created_at, updated_at";

export async function getAllPosts(): Promise<BlogPostMeta[]> {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase
    .from("posts")
    .select(META_FIELDS)
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getLatestPosts(count: number): Promise<BlogPostMeta[]> {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase
    .from("posts")
    .select(META_FIELDS)
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(count);

  if (error) throw error;
  return data ?? [];
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!isSupabaseConfigured) return null;

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data;
}

export async function getAllSlugs(): Promise<string[]> {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase
    .from("posts")
    .select("slug")
    .eq("published", true);

  if (error) throw error;
  return (data ?? []).map((row) => row.slug);
}

export function estimateReadingTime(content: string): string {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 250));
  return `${minutes} min read`;
}
