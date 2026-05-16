import Link from "next/link";
import { SectionDefault } from "@/components/layout/SectionWrapper";
import type { BlogPostMeta } from "@/lib/blog-shared";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function BlogRow({ post }: { post: BlogPostMeta }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <div className="grid grid-cols-12 gap-x-6">
        <div className="col-span-12 md:col-span-9">
          <h3 className="font-display font-medium text-[22px] md:text-[26px] leading-[1.2] tracking-[-0.015em] text-ink-900 text-balance group-hover:text-clay-700 transition-colors">
            {post.title}
          </h3>
          <p className="mt-2 font-prose text-[16px] leading-[1.55] text-ink-700 max-w-[64ch]">
            {post.excerpt}
          </p>
          {post.tags.length > 0 && (
            <p className="mt-3 smallcaps text-[12px] text-ink-500">
              {post.tags.join(" · ")}
            </p>
          )}
        </div>
        <div className="col-span-12 md:col-span-3 md:text-right mt-2 md:mt-1">
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

export function BlogSectionClient({ posts }: { posts: BlogPostMeta[] }) {
  if (posts.length === 0) return null;

  return (
    <SectionDefault id="blog">
      {/* No full heading. Just a smallcaps label in the gutter. */}
      <div className="grid grid-cols-12 gap-x-6 mb-12">
        <p className="col-span-12 md:col-span-2 smallcaps text-[12px] text-ink-500 pt-1">
          Recent
        </p>
      </div>

      <div className="space-y-12 md:space-y-14">
        {posts.map((post) => (
          <BlogRow key={post.id} post={post} />
        ))}
      </div>

      <div className="mt-14">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 font-ui text-[14px] text-ink-900 underline decoration-clay-500 decoration-[1.5px] underline-offset-[5px] hover:decoration-ink-blue transition-colors"
        >
          All posts
          <span className="text-clay-500">&rarr;</span>
        </Link>
      </div>
    </SectionDefault>
  );
}
