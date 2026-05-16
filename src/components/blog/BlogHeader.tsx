import Link from "next/link";
import type { BlogPost } from "@/lib/blog-shared";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function BlogHeader({
  post,
  readingTime,
}: {
  post: BlogPost;
  readingTime: string;
}) {
  return (
    <header className="mb-14">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 font-ui text-[13px] text-ink-500 hover:text-clay-700 transition-colors mb-10"
      >
        <span>&larr;</span>
        All posts
      </Link>

      {post.tags.length > 0 && (
        <p className="smallcaps text-[12px] text-ink-500 mb-6">
          {post.tags.join(" · ")}
        </p>
      )}

      <h1 className="font-display font-medium text-[44px] md:text-[64px] leading-[1.05] tracking-[-0.025em] text-ink-900 text-balance">
        {post.title}
      </h1>

      <p className="mt-6 font-prose italic text-[20px] md:text-[22px] leading-[1.45] text-ink-500 max-w-[60ch]">
        {post.excerpt}
      </p>

      <p className="mt-8 smallcaps text-[12px] text-ink-500 tabular">
        {formatDate(post.created_at)}
        <span className="mx-2 text-ink-300">·</span>
        {readingTime}
      </p>

      <div className="mt-10 border-t border-ink-300" />
    </header>
  );
}
