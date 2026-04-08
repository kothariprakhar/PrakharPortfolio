"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PROJECTS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useSpacetimeWarp } from "@/components/background/useSpacetimeWarp";

const typeColors: Record<string, string> = {
  AI: "bg-accent-blue/10 text-accent-blue border-accent-blue/20",
  Product: "bg-accent-purple/10 text-accent-purple border-accent-purple/20",
  Engineering: "bg-accent-magenta/10 text-accent-magenta border-accent-magenta/20",
};

const typeGradients: Record<string, string> = {
  AI: "from-accent-blue/20 to-accent-blue/5",
  Product: "from-accent-purple/20 to-accent-purple/5",
  Engineering: "from-accent-magenta/20 to-accent-magenta/5",
};

// Bento layout spans for each card index
const bentoSpans = [
  "md:col-span-2 md:row-span-2", // Featured large (index 0)
  "md:col-span-1 md:row-span-1", // Compact (index 1)
  "md:col-span-1 md:row-span-1", // Compact (index 2)
  "md:col-span-2 md:row-span-1", // Wide (index 3)
];

function ProjectCard({
  project,
  index,
}: {
  project: (typeof PROJECTS)[number];
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const { ref, onMouseEnter, onMouseLeave } = useSpacetimeWarp(`project-${project.id}`, {
    strength: 30,
    radius: 250,
  });

  const isLarge = index === 0;
  const imageHeight = isLarge ? "h-48 md:h-64" : "h-36 md:h-44";

  return (
    <>
      <motion.div
        ref={ref as React.Ref<HTMLDivElement>}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ delay: index * 0.1, duration: 0.5 }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={cn(
          "group bg-bg-secondary/60 backdrop-blur-sm border border-border-subtle rounded-2xl overflow-hidden hover:border-accent-blue/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer",
          bentoSpans[index] || "md:col-span-1"
        )}
        onClick={() => setExpanded(true)}
      >
        {/* Image placeholder */}
        <div
          className={cn(
            "relative bg-gradient-to-br overflow-hidden",
            imageHeight,
            typeGradients[project.type]
          )}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className={cn(
                "font-display font-bold text-white/10",
                isLarge ? "text-6xl" : "text-4xl"
              )}
            >
              {project.title
                .split(" ")
                .map((w) => w[0])
                .join("")}
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-bg-secondary/80 to-transparent" />
        </div>

        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <span
              className={cn(
                "px-3 py-1 text-[11px] font-mono tracking-wider rounded-full border",
                typeColors[project.type]
              )}
            >
              {project.type}
            </span>
          </div>

          <h3
            className={cn(
              "font-display font-bold text-text-primary group-hover:text-accent-blue transition-colors",
              isLarge ? "text-xl" : "text-lg"
            )}
          >
            {project.title}
          </h3>
          <p className="text-text-muted text-sm mt-1">{project.subtitle}</p>
          <p className="text-text-secondary text-sm mt-3 leading-relaxed">
            {project.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {project.technologies.slice(0, isLarge ? 6 : 4).map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 text-[10px] font-mono tracking-wider rounded bg-bg-tertiary text-text-muted"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-1 text-accent-blue text-sm font-medium">
            View Case Study <ArrowUpRight size={14} />
          </div>
        </div>
      </motion.div>

      {/* Expanded detail overlay */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-bg-primary/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-8"
            onClick={() => setExpanded(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-bg-secondary border border-border-subtle rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <span
                    className={cn(
                      "px-3 py-1 text-[11px] font-mono tracking-wider rounded-full border",
                      typeColors[project.type]
                    )}
                  >
                    {project.type}
                  </span>
                  <h3 className="font-display font-bold text-2xl text-text-primary mt-3">
                    {project.title}
                  </h3>
                  <p className="text-text-muted text-sm mt-1">{project.subtitle}</p>
                </div>
                <button
                  onClick={() => setExpanded(false)}
                  className="text-text-muted hover:text-text-primary transition-colors p-1"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-mono text-xs tracking-wider text-accent-blue uppercase mb-2">
                    The Problem
                  </h4>
                  <p className="text-text-secondary text-sm leading-relaxed">{project.problem}</p>
                </div>
                <div>
                  <h4 className="font-mono text-xs tracking-wider text-accent-purple uppercase mb-2">
                    My Approach
                  </h4>
                  <p className="text-text-secondary text-sm leading-relaxed">{project.approach}</p>
                </div>
                <div>
                  <h4 className="font-mono text-xs tracking-wider text-accent-magenta uppercase mb-2">
                    Outcome
                  </h4>
                  <p className="text-text-secondary text-sm leading-relaxed">{project.outcome}</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border-subtle">
                <h4 className="font-mono text-xs tracking-wider text-text-muted uppercase mb-3">
                  Technologies
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-[11px] font-mono tracking-wider rounded-full bg-accent-blue/10 text-accent-blue border border-accent-blue/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function Projects() {
  return (
    <SectionWrapper id="projects">
      <SectionHeading label="Projects" title="Things I've Shipped" gradientWord="Shipped" />

      <div className="grid md:grid-cols-3 gap-6">
        {PROJECTS.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </SectionWrapper>
  );
}
