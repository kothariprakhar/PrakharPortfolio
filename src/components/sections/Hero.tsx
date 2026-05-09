"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center px-4 md:px-6"
    >
      {/* Right Now panel — quiet agency signal in the top-right */}
      <motion.aside
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.4, ease: "easeOut" }}
        className="hidden md:block absolute top-[18vh] right-[6vw] lg:right-[8vw] max-w-[220px]"
      >
        <div className="flex items-center gap-3 mb-4">
          <span className="h-[1px] w-6 bg-accent-blue/60" />
          <span className="font-mono text-[10px] tracking-[0.2em] text-text-muted uppercase">
            Right Now
          </span>
        </div>
        <ul className="space-y-2.5">
          {[
            "Building CodeVision (live)",
            "Studying ML at Kellogg + McCormick",
            "Open to AI/PM roles, Summer 2026",
          ].map((item) => (
            <li
              key={item}
              className="flex items-start gap-2.5 text-sm text-text-secondary leading-snug"
            >
              <span className="mt-1.5 w-1 h-1 rounded-full bg-accent-blue/70 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </motion.aside>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-[680px] w-full"
      >
        {/* Tiny opening mark — quiet typographic anchor */}
        <motion.div variants={itemVariants} className="mb-8 flex items-center gap-3">
          <span className="h-[1px] w-10 bg-accent-blue/60" />
          <span className="font-mono text-[10px] tracking-[0.2em] text-text-muted uppercase">
            Hello
          </span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="font-display font-bold text-2xl md:text-3xl tracking-tight text-text-primary"
        >
          I&rsquo;m Prakhar.
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mt-6 text-text-secondary text-lg md:text-[1.1875rem] leading-[1.65]"
        >
          I build AI products end-to-end, from the spec to the shipping commit.
          Sometimes as a PM, sometimes as the engineer.
        </motion.p>

        {/* Hairline divider with a small clay mark — editorial rhythm */}
        <motion.div
          variants={itemVariants}
          className="my-8 flex items-center gap-4"
          aria-hidden
        >
          <span className="h-[1px] flex-1 bg-border-subtle" />
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            className="text-accent-blue/70 shrink-0"
          >
            <path
              d="M5 0L6 4L10 5L6 6L5 10L4 6L0 5L4 4Z"
              fill="currentColor"
            />
          </svg>
          <span className="h-[1px] flex-1 bg-border-subtle" />
        </motion.div>

        <motion.p
          variants={itemVariants}
          className="text-text-secondary text-lg md:text-[1.1875rem] leading-[1.65]"
        >
          I&rsquo;ve been doing this for about six years in different shapes.
          Engineer at <span className="text-text-primary">Unacademy</span>, PM
          at <span className="text-text-primary">Leena AI</span>, co-founder of
          an EdTech venture in London, and now I&rsquo;m a student again at{" "}
          <span className="text-text-primary">Kellogg + McCormick</span>.
        </motion.p>

        {/* Personality line as a pulled-out editorial quote */}
        <motion.blockquote
          variants={itemVariants}
          className="mt-8 pl-5 border-l-2 border-accent-blue/50 text-text-primary italic text-lg md:text-[1.1875rem] leading-[1.6]"
        >
          I keep coming back to the same thing: I get curious about how things
          work, and the best way I know to figure them out is to build and
          iterate on something.
        </motion.blockquote>

        <motion.div variants={itemVariants} className="mt-10">
          <a
            href="#projects"
            className="group inline-flex items-center gap-2 text-accent-blue font-medium text-base hover:gap-3 transition-all duration-200"
          >
            See the work
            <span className="transition-transform duration-200 group-hover:translate-x-0.5">
              &rarr;
            </span>
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        style={{ opacity: scrollIndicatorOpacity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-text-muted font-mono text-[10px] tracking-[0.12em] uppercase">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={18} className="text-text-muted" />
        </motion.div>
      </motion.div>
    </section>
  );
}
