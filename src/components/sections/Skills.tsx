"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target, Users, FlaskConical, Map, FileText, Megaphone, RefreshCw, Handshake,
  Database, MessageSquare, Eye, Sparkles, Brain, BarChart3,
  Code, Server, Cloud, Plug,
  Palette, BookOpen, PieChart, GitBranch, KanbanSquare, Container,
} from "lucide-react";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SKILLS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useSpacetimeWarp } from "@/components/background/useSpacetimeWarp";
import { useTheme } from "@/context/ThemeContext";
import type { SkillCategory } from "@/types";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Target, Users, FlaskConical, Map, FileText, Megaphone, IterationCw: RefreshCw, Handshake,
  Database, MessageSquare, Eye, Sparkles, Brain, BarChart3,
  Code, Server, Cloud, Plug, Container,
  Palette, KanbanSquare, BookOpen, PieChart, GitBranch,
};

const categoryColors: Record<string, string> = {
  "Product Management": "text-accent-purple border-accent-purple/20 bg-accent-purple/10",
  "AI / ML": "text-accent-blue border-accent-blue/20 bg-accent-blue/10",
  Engineering: "text-accent-magenta border-accent-magenta/20 bg-accent-magenta/10",
  "Tools & Platforms": "text-node-gold border-node-gold/20 bg-node-gold/10",
};

const categoryPulseColorDark: Record<string, string> = {
  "Product Management": "rgba(123, 47, 255, 0.35)",
  "AI / ML": "rgba(0, 212, 255, 0.35)",
  Engineering: "rgba(255, 45, 170, 0.35)",
  "Tools & Platforms": "rgba(255, 184, 71, 0.35)",
};

const categoryPulseColorLight: Record<string, string> = {
  "Product Management": "rgba(46, 80, 144, 0.25)",
  "AI / ML": "rgba(27, 63, 107, 0.25)",
  Engineering: "rgba(107, 58, 93, 0.25)",
  "Tools & Platforms": "rgba(139, 105, 20, 0.25)",
};

const categories = Object.keys(SKILLS) as SkillCategory[];

function SkillTile({
  skill,
  index,
  active,
  isFired,
  isPropagated,
  pulseColor,
  onFire,
}: {
  skill: { name: string; icon: string };
  index: number;
  active: SkillCategory;
  isFired: boolean;
  isPropagated: boolean;
  pulseColor: string;
  onFire: (i: number) => void;
}) {
  const { ref, onMouseEnter: warpEnter, onMouseLeave: warpLeave } = useSpacetimeWarp(
    `skill-${skill.name}`,
    { strength: 10, radius: 100 }
  );

  const Icon = iconMap[skill.icon] || Code;
  const isActive = isFired || isPropagated;

  return (
    <motion.div
      ref={ref as React.Ref<HTMLDivElement>}
      key={skill.name}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onMouseEnter={() => {
        onFire(index);
        warpEnter();
      }}
      onMouseLeave={warpLeave}
      className="relative flex flex-col items-center gap-3 p-5 rounded-xl bg-bg-tertiary/50 border border-border-subtle hover:-translate-y-1 transition-all duration-300 cursor-default"
      style={{
        boxShadow: isActive ? `0 0 ${isFired ? 28 : 18}px ${pulseColor}` : "none",
        borderColor: isActive ? pulseColor.replace("0.35", "0.3") : undefined,
        transition: "box-shadow 0.3s ease, border-color 0.3s ease, transform 0.3s ease",
      }}
    >
      {isFired && (
        <span
          className="absolute inset-0 rounded-xl animate-ping pointer-events-none"
          style={{
            backgroundColor: pulseColor.replace("0.35", "0.08"),
            animationDuration: "0.8s",
            animationIterationCount: "1",
          }}
        />
      )}

      <Icon
        size={24}
        className={cn(
          categoryColors[active].split(" ")[0],
          isActive && "drop-shadow-lg"
        )}
      />
      <span
        className={cn(
          "text-xs text-center font-medium transition-colors duration-300",
          isActive ? "text-text-primary" : "text-text-secondary"
        )}
      >
        {skill.name}
      </span>
    </motion.div>
  );
}

export function Skills() {
  const [active, setActive] = useState<SkillCategory>("Product Management");
  const [firedIndex, setFiredIndex] = useState(-1);
  const [propagated, setPropagated] = useState<Set<number>>(new Set());
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const { resolvedTheme } = useTheme();
  const categoryPulseColor = resolvedTheme === "light" ? categoryPulseColorLight : categoryPulseColorDark;

  const fireNeuron = useCallback(
    (index: number) => {
      // Clear previous propagation
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
      setPropagated(new Set());
      setFiredIndex(index);

      // Propagate to other skills in the category with stagger
      const skills = SKILLS[active];
      const newPropagated = new Set<number>();

      skills.forEach((_, i) => {
        if (i === index) return;
        const delay = 100 + Math.abs(i - index) * 80;
        const t = setTimeout(() => {
          newPropagated.add(i);
          setPropagated(new Set(newPropagated));
        }, delay);
        timeoutsRef.current.push(t);
      });

      // Clear all after animation completes
      const clearT = setTimeout(() => {
        setFiredIndex(-1);
        setPropagated(new Set());
      }, 1200);
      timeoutsRef.current.push(clearT);
    },
    [active]
  );

  const pulseColor = categoryPulseColor[active];

  return (
    <SectionWrapper id="skills">
      <SectionHeading
        label="Capabilities"
        title="Skills & Technologies"
        gradientWord="Technologies"
      />

      {/* Category tabs */}
      <div className="flex flex-wrap gap-3 mb-12">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActive(cat);
              setFiredIndex(-1);
              setPropagated(new Set());
            }}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border",
              active === cat
                ? categoryColors[cat]
                : "text-text-muted border-border-subtle hover:border-text-muted/30"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Skills grid with neural activation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
        >
          {SKILLS[active].map((skill, i) => (
            <SkillTile
              key={skill.name}
              skill={skill}
              index={i}
              active={active}
              isFired={i === firedIndex}
              isPropagated={propagated.has(i)}
              pulseColor={pulseColor}
              onFire={fireNeuron}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </SectionWrapper>
  );
}
