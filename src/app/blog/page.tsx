"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, LayoutGrid, Orbit } from "lucide-react";
import { BlogCard } from "@/components/blog/BlogCard";
import type { BlogPostMeta } from "@/lib/blog";

const SpacetimeBlog = dynamic(() => import("@/components/blog/SpacetimeBlog"), {
  ssr: false,
});

// Sample posts for development — replace with getAllPosts() once Supabase is configured
const SAMPLE_POSTS: BlogPostMeta[] = [
  {
    id: "1",
    slug: "ai-product-management",
    title: "Why AI Product Management is Different",
    excerpt:
      "Exploring the unique challenges of building AI-powered products vs. traditional software — from probabilistic outputs to evaluation frameworks.",
    tags: ["AI Strategy", "Product Thinking"],
    cover_image: null,
    published: true,
    created_at: "2026-03-20T00:00:00Z",
    updated_at: "2026-03-20T00:00:00Z",
  },
  {
    id: "2",
    slug: "from-engineer-to-pm",
    title: "From Engineer to PM: What Changes",
    excerpt:
      "Reflections on transitioning from building products to defining what gets built — and why the best PMs never stop being technical.",
    tags: ["Career", "Product Management"],
    cover_image: null,
    published: true,
    created_at: "2026-03-10T00:00:00Z",
    updated_at: "2026-03-10T00:00:00Z",
  },
  {
    id: "3",
    slug: "building-at-intersection",
    title: "Building at the Intersection of AI & Business",
    excerpt:
      "How the Kellogg + AI joint degree shapes my approach to product development — and why the best AI products are built by teams that speak both languages.",
    tags: ["AI", "MBA", "Building"],
    cover_image: null,
    published: true,
    created_at: "2026-02-28T00:00:00Z",
    updated_at: "2026-02-28T00:00:00Z",
  },
  {
    id: "4",
    slug: "rag-systems-production",
    title: "RAG Systems in Production: Lessons Learned",
    excerpt:
      "What nobody tells you about deploying retrieval-augmented generation at scale — chunking strategies, embedding drift, and evaluation hell.",
    tags: ["AI", "Engineering", "Deep Learning"],
    cover_image: null,
    published: true,
    created_at: "2026-02-15T00:00:00Z",
    updated_at: "2026-02-15T00:00:00Z",
  },
  {
    id: "5",
    slug: "zero-to-one-product",
    title: "The 0→1 Product Playbook",
    excerpt:
      "A framework for launching new products from scratch — discovery, validation, and the first 100 users.",
    tags: ["Product Thinking", "Strategy"],
    cover_image: null,
    published: true,
    created_at: "2026-01-30T00:00:00Z",
    updated_at: "2026-01-30T00:00:00Z",
  },
  {
    id: "6",
    slug: "edtech-play-based-learning",
    title: "Play-Based Learning: What the Data Says",
    excerpt:
      "How we proved that gamified learning improves math proficiency by 35% across 700 students — the Club Khel story.",
    tags: ["EdTech", "Product Management"],
    cover_image: null,
    published: true,
    created_at: "2026-01-15T00:00:00Z",
    updated_at: "2026-01-15T00:00:00Z",
  },
];

export default function BlogPage() {
  const [viewMode, setViewMode] = useState<"space" | "list">("space");
  const posts = SAMPLE_POSTS;

  return (
    <div className="min-h-screen bg-bg-primary relative">
      {/* Top nav bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-accent-blue transition-colors"
        >
          <ArrowLeft size={16} />
          Back to portfolio
        </Link>

        <button
          onClick={() => setViewMode(viewMode === "space" ? "list" : "space")}
          className="hidden md:inline-flex items-center gap-2 px-4 py-2 text-xs font-mono tracking-wider text-text-muted border border-border-subtle rounded-full hover:text-accent-blue hover:border-accent-blue/30 transition-all"
        >
          {viewMode === "space" ? (
            <>
              <LayoutGrid size={14} />
              List view
            </>
          ) : (
            <>
              <Orbit size={14} />
              Explore view
            </>
          )}
        </button>
      </div>

      {/* Desktop: space view */}
      {viewMode === "space" && (
        <div className="hidden md:block">
          <SpacetimeBlog posts={posts} />
        </div>
      )}

      {/* Desktop: list view / Mobile: always list */}
      <div className={viewMode === "list" ? "block" : "md:hidden"}>
        <div className="max-w-[1000px] mx-auto px-6 pt-28 pb-20">
          <div className="mb-12">
            <p className="font-mono text-xs tracking-[0.3em] uppercase text-accent-blue mb-3">
              Thoughts
            </p>
            <h1 className="font-display font-bold text-4xl md:text-5xl text-text-primary">
              Writing &{" "}
              <span className="bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">
                Ideas
              </span>
            </h1>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {posts.map((post, i) => (
              <BlogCard key={post.id} post={post} index={i} />
            ))}
          </div>
        </div>
      </div>

      {/* Instructions (space view only) */}
      {viewMode === "space" && (
        <div className="hidden md:block absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
          <p className="text-[11px] font-mono tracking-wider text-text-muted/50">
            Hover to explore connections · Click to read
          </p>
        </div>
      )}
    </div>
  );
}
