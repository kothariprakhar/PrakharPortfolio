"use client";

import { useRef } from "react";
import { motion, useInView, useSpring, useMotionValue, useTransform } from "framer-motion";
import { Cpu, Rocket, Building2, GraduationCap } from "lucide-react";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { STATS, JOURNEY } from "@/lib/constants";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Cpu,
  Rocket,
  Building2,
  GraduationCap,
};

// Text reveal component — words fade in with stagger on scroll
function RevealText({ text, className }: { text: string; className?: string }) {
  const words = text.split(" ");

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.03 },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0.15, y: 6 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" as const },
    },
  };

  return (
    <motion.p
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      className={className}
    >
      {words.map((word, i) => (
        <motion.span key={i} variants={wordVariants} className="inline-block mr-[0.3em]">
          {word}
        </motion.span>
      ))}
    </motion.p>
  );
}

function StatCounter({
  value,
  suffix,
  label,
  prefix,
}: {
  value: string;
  suffix: string;
  label: string;
  prefix: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const numValue = parseFloat(value);
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 50, damping: 20 });
  const display = useTransform(spring, (v: number) =>
    numValue % 1 !== 0 ? v.toFixed(2) : Math.floor(v).toString()
  );

  if (isInView) {
    motionValue.set(numValue);
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5 }}
      className="text-center p-4"
    >
      <div className="font-display font-bold text-2xl md:text-3xl text-text-primary">
        <span className="text-accent-blue">{prefix}</span>
        <motion.span>{display}</motion.span>
        <span className="text-accent-blue">{suffix}</span>
      </div>
      <p className="mt-2 text-text-muted text-xs md:text-sm">{label}</p>
    </motion.div>
  );
}

function JourneyCard({
  icon,
  title,
  description,
  index,
}: {
  icon: string;
  title: string;
  description: string;
  index: number;
}) {
  const Icon = iconMap[icon] || Cpu;

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: index * 0.15, duration: 0.5 }}
      className="relative pl-6 border-l-2 border-gradient-to-b from-accent-blue to-accent-purple bg-bg-secondary/50 backdrop-blur-sm rounded-r-2xl p-6 hover:bg-bg-tertiary/50 transition-colors duration-300"
      style={{ borderImage: "linear-gradient(to bottom, var(--gradient-from), var(--gradient-to)) 1" }}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent-blue/10 flex items-center justify-center">
          <Icon size={20} className="text-accent-blue" />
        </div>
        <div>
          <h3 className="font-display font-bold text-lg text-text-primary">{title}</h3>
          <RevealText
            text={description}
            className="mt-2 text-text-secondary text-sm leading-relaxed"
          />
        </div>
      </div>
    </motion.div>
  );
}

export function About() {
  return (
    <SectionWrapper id="about">
      <SectionHeading label="Who I Am" title="The Journey So Far" gradientWord="Journey" />

      <div className="grid md:grid-cols-[380px_1fr] gap-12 md:gap-16">
        {/* Left: Stats */}
        <div className="md:sticky md:top-28 md:self-start">
          {/* Avatar placeholder */}
          <div className="w-28 h-28 mx-auto md:mx-0 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center mb-8">
            <span className="font-display font-bold text-3xl text-white">PK</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {STATS.map((stat) => (
              <StatCounter key={stat.label} {...stat} />
            ))}
          </div>
        </div>

        {/* Right: Journey cards */}
        <div className="flex flex-col gap-6">
          {JOURNEY.map((item, i) => (
            <JourneyCard key={item.id} index={i} {...item} />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
