import Link from "next/link";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import type { BlogPost } from "@/lib/blog";

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
    <header className="mb-12">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-accent-blue transition-colors mb-8"
      >
        <ArrowLeft size={16} />
        Back to all posts
      </Link>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 text-[11px] font-mono tracking-wider rounded-full bg-accent-blue/10 text-accent-blue border border-accent-blue/20"
          >
            {tag}
          </span>
        ))}
      </div>

      <h1 className="font-display font-bold text-4xl md:text-5xl bg-gradient-to-r from-text-primary to-text-secondary bg-clip-text text-transparent leading-tight">
        {post.title}
      </h1>

      <p className="mt-4 text-lg text-text-muted">{post.excerpt}</p>

      <div className="flex items-center gap-6 mt-6 text-sm text-text-muted">
        <span className="flex items-center gap-1.5">
          <Calendar size={14} />
          {formatDate(post.created_at)}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock size={14} />
          {readingTime}
        </span>
      </div>

      <div className="h-px bg-gradient-to-r from-accent-blue/30 via-accent-purple/20 to-transparent mt-8" />
    </header>
  );
}
