"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock, ArrowUpRight } from "lucide-react";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { BlogPostMeta } from "@/lib/blog";
import { estimateReadingTime } from "@/lib/blog";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function BlogSectionClient({ posts }: { posts: BlogPostMeta[] }) {
  return (
    <SectionWrapper id="blog">
      <SectionHeading
        label="Thoughts"
        title="Writing & Ideas"
        gradientWord="Ideas"
        subtitle="Perspectives on AI, product, and building things."
      />

      <div className="grid md:grid-cols-3 gap-6">
        {posts.length === 0 ? (
          <p className="col-span-3 text-center text-text-muted">
            Posts coming soon.
          </p>
        ) : (
          posts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Link href={`/blog/${post.slug}`} className="group block">
                <div className="glass-card overflow-hidden transition-all duration-300">
                  <div className="relative h-40 bg-gradient-to-br from-accent-blue/10 via-accent-purple/10 to-accent-magenta/10 overflow-hidden">
                    <div
                      className="absolute inset-0 opacity-50"
                      style={{
                        background:
                          "linear-gradient(135deg, var(--color-glow-blue), var(--color-glow-purple), var(--color-glow-blue))",
                        animation: "gradientShift 8s ease-in-out infinite",
                        backgroundSize: "200% 200%",
                      }}
                    />
                    <div className="absolute top-4 right-4">
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-bg-primary/80 backdrop-blur-sm text-[10px] font-mono tracking-wider text-text-muted border border-border-subtle">
                        <Clock size={10} />
                        {post.excerpt
                          ? estimateReadingTime(post.excerpt)
                          : "1 min read"}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-[10px] font-mono text-text-muted">
                      <Calendar size={10} />
                      {formatDate(post.created_at)}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display font-bold text-base text-text-primary group-hover:text-accent-blue transition-colors">
                        {post.title}
                      </h3>
                      <ArrowUpRight
                        size={16}
                        className="shrink-0 mt-1 text-text-muted group-hover:text-accent-blue group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                      />
                    </div>
                    <p className="mt-2 text-text-muted text-sm leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-[10px] font-mono tracking-wider rounded bg-bg-tertiary text-text-muted"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))
        )}
      </div>

      {posts.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-10 text-center"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-accent-blue hover:underline underline-offset-4 transition-colors"
          >
            View all posts
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      )}

      <style>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </SectionWrapper>
  );
}
