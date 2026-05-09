import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BlogCard } from "@/components/blog/BlogCard";
import { getAllPosts } from "@/lib/blog";

export const revalidate = 60;

export const metadata = {
  title: "Writing | Prakhar Kothari",
  description:
    "Notes on AI, products, and what I'm learning as an MBA + AI student.",
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <div className="min-h-screen bg-bg-primary relative">
      {/* Top nav */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-accent-blue transition-colors"
        >
          <ArrowLeft size={16} />
          Back to portfolio
        </Link>
      </div>

      <div className="max-w-[1000px] mx-auto px-6 pt-28 pb-20">
        <div className="mb-12">
          <div className="mb-6 flex items-center gap-3">
            <span className="h-[1px] w-10 bg-accent-blue/60" />
            <span className="font-mono text-[10px] tracking-[0.2em] text-text-muted uppercase">
              Writing
            </span>
          </div>
          <h1 className="font-display font-bold text-3xl md:text-[2.5rem] tracking-tight text-text-primary leading-tight">
            Notes on what I&rsquo;m learning.
          </h1>
        </div>

        {posts.length === 0 ? (
          <p className="text-text-muted">No posts yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {posts.map((post, i) => (
              <BlogCard key={post.id} post={post} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
