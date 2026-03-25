"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MapPin } from "lucide-react";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EXPERIENCE } from "@/lib/constants";
import { cn } from "@/lib/utils";

function TimelineItem({
  item,
  index,
  isLeft,
}: {
  item: (typeof EXPERIENCE)[number];
  index: number;
  isLeft: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={cn(
        "relative md:w-[calc(50%-32px)]",
        isLeft ? "md:mr-auto md:pr-0" : "md:ml-auto md:pl-0"
      )}
    >
      {/* Timeline node */}
      <div
        className={cn(
          "hidden md:block absolute top-8 w-3 h-3 rounded-full bg-gradient-to-r from-accent-blue to-accent-purple shadow-[0_0_12px_rgba(0,212,255,0.5)]",
          isLeft ? "-right-[38px]" : "-left-[38px]"
        )}
      />

      {/* Mobile node */}
      <div className="md:hidden absolute left-0 top-8 w-3 h-3 rounded-full bg-gradient-to-r from-accent-blue to-accent-purple shadow-[0_0_12px_rgba(0,212,255,0.5)]" />

      <div
        className={cn(
          "ml-8 md:ml-0 bg-bg-secondary/60 backdrop-blur-sm border border-border-subtle rounded-2xl p-6 hover:border-accent-blue/20 transition-all duration-300 cursor-pointer",
          expanded && "border-accent-blue/20"
        )}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-[11px] tracking-wider text-accent-blue uppercase">
            {item.period}
          </span>
          <span className="text-text-muted text-xs flex items-center gap-1">
            <MapPin size={10} /> {item.location}
          </span>
        </div>

        <h3 className="font-display font-bold text-lg text-text-primary mt-2">
          {item.role}
        </h3>
        <p className="text-text-secondary text-sm mt-1">{item.companyShort}</p>
        <p className="text-text-muted text-sm mt-3 leading-relaxed">{item.summary}</p>

        <button
          className="mt-4 flex items-center gap-1 text-accent-blue text-xs font-mono tracking-wider uppercase"
          aria-label={expanded ? "Collapse details" : "Expand details"}
        >
          {expanded ? "Less" : "More"}
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={14} />
          </motion.span>
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <ul className="mt-4 space-y-2 border-t border-border-subtle pt-4">
                {item.details.map((detail, i) => (
                  <li
                    key={i}
                    className="text-text-secondary text-sm leading-relaxed pl-4 relative before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-accent-blue/40"
                  >
                    {detail}
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-2">
                {item.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 text-[11px] font-mono tracking-wider rounded-full bg-accent-blue/10 text-accent-blue border border-accent-blue/20"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export function Experience() {
  return (
    <SectionWrapper id="experience">
      <SectionHeading label="Experience" title="Where I've Built" gradientWord="Built" />

      <div className="relative">
        {/* Timeline line - desktop */}
        <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-accent-blue via-accent-purple to-transparent shadow-[0_0_8px_rgba(0,212,255,0.3)]" />

        {/* Timeline line - mobile */}
        <div className="md:hidden absolute left-[5px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-accent-blue via-accent-purple to-transparent" />

        <div className="flex flex-col gap-8 md:gap-12">
          {EXPERIENCE.map((item, i) => (
            <TimelineItem key={item.id} item={item} index={i} isLeft={i % 2 === 0} />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
