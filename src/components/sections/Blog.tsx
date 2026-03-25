"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BLOG_POSTS } from "@/lib/constants";

export function Blog() {
  return (
    <SectionWrapper id="blog">
      <SectionHeading
        label="Thoughts"
        title="Writing & Ideas"
        gradientWord="Ideas"
        subtitle="Perspectives on AI, product, and building things."
      />

      <div className="grid md:grid-cols-3 gap-6">
        {BLOG_POSTS.map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="group bg-bg-secondary/60 backdrop-blur-sm border border-border-subtle rounded-2xl overflow-hidden hover:border-accent-blue/20 transition-all duration-300"
          >
            {/* Animated gradient placeholder */}
            <div className="relative h-40 bg-gradient-to-br from-accent-blue/10 via-accent-purple/10 to-accent-magenta/10 overflow-hidden">
              <div
                className="absolute inset-0 opacity-50"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(0,212,255,0.15), rgba(123,47,255,0.15), rgba(255,45,170,0.1))",
                  animation: "gradientShift 8s ease-in-out infinite",
                  backgroundSize: "200% 200%",
                }}
              />
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-bg-primary/80 backdrop-blur-sm text-[10px] font-mono tracking-wider text-text-muted uppercase border border-border-subtle">
                Coming Soon
              </div>
            </div>

            <div className="p-6">
              <h3 className="font-display font-bold text-base text-text-primary group-hover:text-accent-blue transition-colors">
                {post.title}
              </h3>
              <p className="mt-2 text-text-muted text-sm leading-relaxed">
                {post.description}
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
          </motion.div>
        ))}
      </div>

      <style>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </SectionWrapper>
  );
}
