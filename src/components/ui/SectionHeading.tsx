"use client";

import { motion } from "framer-motion";

interface SectionHeadingProps {
  /** Optional uppercase eyebrow above the title. Omit for quieter treatments. */
  label?: string;
  /** The heading text. */
  title: string;
  /** Optional word inside `title` to render in the clay accent. Omit for monochrome. */
  gradientWord?: string;
  /** Optional descriptor below the title. */
  subtitle?: string;
}

export function SectionHeading({ label, title, gradientWord, subtitle }: SectionHeadingProps) {
  // Split the title around gradientWord (case-sensitive) only if both are present.
  const accentParts =
    gradientWord && title.includes(gradientWord) ? title.split(gradientWord) : null;

  return (
    <div className="mb-16 md:mb-20">
      {label && (
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-block font-mono text-xs tracking-[0.08em] text-accent-blue uppercase mb-4"
        >
          {label}
        </motion.span>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: label ? 0.1 : 0 }}
        className="font-display font-bold text-3xl md:text-[2.5rem] leading-tight tracking-tight"
      >
        {accentParts ? (
          <>
            {accentParts[0]}
            <span className="text-accent-blue">{gradientWord}</span>
            {accentParts.slice(1).join(gradientWord)}
          </>
        ) : (
          title
        )}
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
