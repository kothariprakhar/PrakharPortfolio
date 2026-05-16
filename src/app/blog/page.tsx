import Link from "next/link";
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
    <div className="min-h-screen bg-paper relative">
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-5 md:px-8 py-5">
        <Link
          href="/"
          className="font-ui text-[13px] text-ink-500 hover:text-clay-700 transition-colors"
        >
          &larr; Back to portfolio
        </Link>
      </div>

      <div className="max-w-[920px] mx-auto px-5 md:px-8 pt-32 pb-24">
        <header className="mb-20 md:mb-28">
          <p className="smallcaps text-[12px] text-ink-500 mb-6">
            Writing · since 2026
          </p>
          <h1
            className="font-display font-medium text-[72px] md:text-[112px] leading-[0.95] tracking-[-0.04em] text-ink-900 text-balance"
            style={{ fontFeatureSettings: '"ss01", "kern", "liga"' }}
          >
            Notes on what I&rsquo;m learning.
          </h1>
        </header>

        {posts.length === 0 ? (
          <p className="font-prose text-ink-500">No posts yet.</p>
        ) : (
          <div className="space-y-14 md:space-y-16 pb-10 border-b border-ink-300">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
