"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
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
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-[680px] w-full"
      >
        <motion.h1
          variants={itemVariants}
          className="font-display font-bold text-2xl md:text-3xl tracking-tight text-text-primary"
        >
          Hi, I&rsquo;m Prakhar.
        </motion.h1>

        <motion.div
          variants={itemVariants}
          className="mt-6 space-y-5 text-text-secondary text-lg md:text-[1.1875rem] leading-[1.65]"
        >
          <p>
            I build AI products end-to-end — from the spec to the shipping
            commit. Sometimes as a PM, sometimes as the engineer.
          </p>
          <p>
            I&rsquo;ve been doing this for about six years in different shapes —
            engineer at <span className="text-text-primary">Unacademy</span>, PM
            at <span className="text-text-primary">Leena AI</span>, co-founder
            of an EdTech venture in London, and now I&rsquo;m a student again at{" "}
            <span className="text-text-primary">Kellogg + McCormick</span>. I
            keep coming back to the same thing: I get curious about how things
            work, and the best way I know to figure them out is to build and
            iterate on something.
          </p>
        </motion.div>

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
