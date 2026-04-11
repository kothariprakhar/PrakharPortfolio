"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

interface SectionHeadingProps {
  label: string;
  title: string;
  gradientWord: string;
  subtitle?: string;
}

export function SectionHeading({ label, title, gradientWord, subtitle }: SectionHeadingProps) {
  const parts = title.split(gradientWord);
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  return (
    <div className="mb-16 md:mb-20">
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="inline-block font-mono text-xs tracking-[0.08em] text-accent-blue uppercase mb-4"
      >
        {label}
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="font-display font-bold text-3xl md:text-[2.5rem] leading-tight"
      >
        {parts[0]}
        <span className="bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">
          {gradientWord}
        </span>
        {parts[1]}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-text-secondary text-lg max-w-2xl"
        >
          {subtitle}
        </motion.p>
      )}
      {/* Manuscript flourish divider — light mode only */}
      {isLight && (
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-6 flex items-center gap-3 max-w-xs"
        >
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-accent-blue/30" />
          <svg width="16" height="16" viewBox="0 0 16 16" className="text-accent-blue/40 shrink-0">
            <path d="M8 1L10 6L15 8L10 10L8 15L6 10L1 8L6 6Z" fill="currentColor" />
          </svg>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-accent-blue/30" />
        </motion.div>
      )}
    </div>
  );
}
