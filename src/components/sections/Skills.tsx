"use client";

import { useState } from "react";
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

const categoryGlow: Record<string, string> = {
  "Product Management": "hover:shadow-[0_0_20px_rgba(123,47,255,0.15)]",
  "AI / ML": "hover:shadow-[0_0_20px_rgba(0,212,255,0.15)]",
  Engineering: "hover:shadow-[0_0_20px_rgba(255,45,170,0.15)]",
  "Tools & Platforms": "hover:shadow-[0_0_20px_rgba(255,184,71,0.15)]",
};

const categories = Object.keys(SKILLS) as SkillCategory[];

export function Skills() {
  const [active, setActive] = useState<SkillCategory>("Product Management");

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
            onClick={() => setActive(cat)}
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

      {/* Skills grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
        >
          {SKILLS[active].map((skill, i) => {
            const Icon = iconMap[skill.icon] || Code;
            return (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  "flex flex-col items-center gap-3 p-5 rounded-xl bg-bg-tertiary/50 border border-border-subtle hover:-translate-y-1 transition-all duration-300",
                  categoryGlow[active]
                )}
              >
                <Icon size={24} className={categoryColors[active].split(" ")[0]} />
                <span className="text-xs text-text-secondary text-center font-medium">
                  {skill.name}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </SectionWrapper>
  );
}
