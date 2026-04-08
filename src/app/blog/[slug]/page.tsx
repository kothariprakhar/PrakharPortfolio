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
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-[720px] mx-auto px-6 pt-28 pb-20">
        <BlogHeader post={post} readingTime={readingTime} />
        <MDXContent source={post.content} />
        <footer className="mt-16 pt-8 border-t border-border-subtle">
          <Link
            href="/blog"
            className="text-sm text-accent-blue hover:underline underline-offset-4"
          >
            &larr; All posts
          </Link>
        </footer>
      </div>
    </div>
  );
}
