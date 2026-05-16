import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllSlugs, getPostBySlug, estimateReadingTime } from "@/lib/blog";
import { BlogHeader } from "@/components/blog/BlogHeader";
import { MDXContent } from "@/components/blog/MDXContent";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) return { title: "Post Not Found" };

  return {
    title: `${post.title} | Prakhar Kothari`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.created_at,
      tags: post.tags,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const readingTime = estimateReadingTime(post.content);

  return (
    <div className="min-h-screen bg-paper">
      {/* Expanded container leaves room for right-margin sidenotes on xl+ */}
      <div className="max-w-[720px] xl:max-w-[940px] mx-auto px-5 md:px-8 pt-28 pb-24">
        <BlogHeader post={post} readingTime={readingTime} />
        <div className="xl:pr-[220px]">
          <MDXContent source={post.content} />
        </div>
        <footer className="mt-20 pt-8 border-t border-ink-300">
          <Link
            href="/blog"
            className="font-ui text-[13px] text-ink-700 hover:text-clay-700 transition-colors underline decoration-clay-500 decoration-[1.5px] underline-offset-[5px]"
          >
            &larr; All posts
          </Link>
        </footer>
      </div>
    </div>
  );
}
