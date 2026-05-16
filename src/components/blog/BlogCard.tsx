import Link from "next/link";
import type { BlogPostMeta } from "@/lib/blog-shared";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Editorial blog row · whitespace-separated list (no hairline between rows).
 * Date hangs in the right margin like a footnote ref.
 */
export function BlogCard({ post }: { post: BlogPostMeta }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <div className="grid grid-cols-12 gap-x-6">
        <div className="col-span-12 md:col-span-9">
          <h3 className="font-display font-medium text-[24px] md:text-[28px] leading-[1.18] tracking-[-0.015em] text-ink-900 text-balance group-hover:text-clay-700 transition-colors">
            {post.title}
          </h3>
          <p className="mt-3 font-prose text-[17px] leading-[1.55] text-ink-700 max-w-[64ch]">
            {post.excerpt}
          </p>
          {post.tags.length > 0 && (
            <p className="mt-4 smallcaps text-[12px] text-ink-500">
              {post.tags.join(" · ")}
            </p>
          )}
        </div>
        <div className="col-span-12 md:col-span-3 md:text-right mt-3 md:mt-2">
          <p className="smallcaps text-[12px] text-ink-500 tabular leading-snug">
            {formatDate(post.created_at)}
          </p>
          <p className="smallcaps text-[12px] text-ink-400 mt-1 tabular">
            {post.reading_time}
          </p>
        </div>
      </div>
    </Link>
  );
}
