"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Download } from "lucide-react";
import { SOCIAL_LINKS } from "@/lib/constants";
import { MagneticButton } from "@/components/ui/MagneticButton";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Parallax scroll transforms
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const eyebrowY = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const headingY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const subtitleY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const buttonsY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center px-4 md:px-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-[1200px] mx-auto text-center md:text-left w-full"
      >
        <motion.div variants={itemVariants} style={{ y: eyebrowY }}>
          <span className="font-mono text-xs md:text-sm tracking-[0.12em] text-accent-blue uppercase">
            AI Product Manager &middot; Kellogg MBA + AI
          </span>
        </motion.div>

        <motion.div variants={itemVariants} style={{ y: headingY }}>
          <h1
            ref={headingRef}
            className="mt-6 font-display font-bold text-[2.625rem] md:text-[5rem] leading-[1.05] tracking-[-0.03em]"
          >
            Building the Future
            <br />
            at the Intersection of
            <br />
            <span className="bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">
              AI &amp; Product
            </span>
          </h1>
        </motion.div>

        <motion.p
          variants={itemVariants}
          style={{ y: subtitleY }}
          className="mt-6 md:mt-8 text-text-secondary text-lg md:text-xl max-w-2xl leading-relaxed"
        >
          AI Product Manager with 6+ years shipping enterprise products. Scaled
          NLP-powered experiences from <span className="text-text-primary font-semibold">0 → $5M ARR</span> at
          Leena AI, serving <span className="text-text-primary font-semibold">1.5M+ users</span> across 90+
          enterprises. Now at Kellogg + McCormick combining business strategy with applied AI.
        </motion.p>

        <motion.div
          variants={itemVariants}
          style={{ y: buttonsY }}
          className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-3 justify-center md:justify-start"
        >
          <MagneticButton
            as="a"
            href="#projects"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-accent-blue text-white font-medium text-sm hover:bg-accent-purple transition-colors duration-200"
          >
            View My Work
            <span className="ml-1">&rarr;</span>
          </MagneticButton>
          <MagneticButton
            as="a"
            href={SOCIAL_LINKS.resume}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-accent-blue/30 text-accent-blue font-medium text-sm hover:border-accent-blue hover:bg-accent-blue/5 transition-colors duration-200"
          >
            <Download size={16} />
            Resume
          </MagneticButton>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          style={{ opacity: scrollIndicatorOpacity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-text-muted font-mono text-[11px] tracking-[0.08em] uppercase">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown size={20} className="text-text-muted" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
