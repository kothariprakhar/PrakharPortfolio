"use client";

import { motion } from "framer-motion";

interface SectionHeadingProps {
  label: string;
  title: string;
  gradientWord: string;
  subtitle?: string;
}

export function SectionHeading({ label, title, gradientWord, subtitle }: SectionHeadingProps) {
  const parts = title.split(gradientWord);

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
    </div>
  );
}
