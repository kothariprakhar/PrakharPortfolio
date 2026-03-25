"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { HERO_ROLES } from "@/lib/constants";

function TypewriterText() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const role = HERO_ROLES[roleIndex];
    const speed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === role.length) {
      setTimeout(() => setIsDeleting(true), 2000);
      return;
    }

    if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % HERO_ROLES.length);
      return;
    }

    const timer = setTimeout(() => {
      setCharIndex((prev) => prev + (isDeleting ? -1 : 1));
    }, speed);

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, roleIndex]);

  return (
    <span className="font-mono text-xs md:text-sm tracking-[0.08em] text-accent-blue uppercase">
      {HERO_ROLES[roleIndex].substring(0, charIndex)}
      <span className="animate-pulse">|</span>
    </span>
  );
}

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
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 md:px-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-[1200px] mx-auto text-center md:text-left w-full"
      >
        <motion.div variants={itemVariants}>
          <TypewriterText />
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="mt-6 font-display font-bold text-[2.625rem] md:text-[5rem] leading-[1.05] tracking-[-0.03em]"
        >
          Building the Future
          <br />
          at the Intersection of
          <br />
          <span className="bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">
            AI &amp; Product
          </span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mt-6 md:mt-8 text-text-secondary text-lg md:text-xl max-w-2xl leading-relaxed"
        >
          Kellogg MBA + AI candidate at Northwestern. I build products
          that turn complex AI into elegant user experiences.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
        >
          <a
            href="#projects"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-accent-blue to-accent-purple text-white font-medium text-sm hover:shadow-[0_0_30px_rgba(0,212,255,0.3)] transition-shadow duration-300"
          >
            View My Work
            <span className="ml-1">&rarr;</span>
          </a>
          <a
            href="#contact"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-full border border-accent-blue/30 text-accent-blue font-medium text-sm hover:bg-accent-blue/10 transition-all duration-300"
          >
            Get In Touch
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
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
