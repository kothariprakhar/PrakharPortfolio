"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ChevronDown, MapPin } from "lucide-react";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EXPERIENCE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useSpacetimeWarp } from "@/components/background/useSpacetimeWarp";

const LOSS_VALUES = ["L = 0.89", "L = 0.62", "L = 0.34", "L = 0.15", "L = 0.03"];

function TimelineItem({
  item,
  index,
  isLeft,
  lossValue,
}: {
  item: (typeof EXPERIENCE)[number];
  index: number;
  isLeft: boolean;
  lossValue: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const { ref: warpRef, onMouseEnter, onMouseLeave } = useSpacetimeWarp(`exp-${item.id}`, {
    strength: 20,
    radius: 200,
  });

  return (
    <motion.div
      ref={warpRef as React.Ref<HTMLDivElement>}
      initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn(
        "relative md:w-[calc(50%-32px)]",
        isLeft ? "md:mr-auto md:pr-0" : "md:ml-auto md:pl-0"
      )}
    >
      {/* Timeline node — desktop */}
      <div
        className={cn(
          "hidden md:flex absolute top-8 items-center gap-2",
          isLeft ? "-right-[38px] flex-row" : "-left-[38px] flex-row-reverse"
        )}
      >
        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-accent-blue to-accent-purple shadow-[0_0_12px_rgba(0,212,255,0.5)]" />
      </div>

      {/* Loss label — desktop */}
      <div
        className={cn(
          "hidden md:block absolute top-[34px] font-mono text-[9px] tracking-wider",
          isLeft
            ? "-right-[100px] text-left"
            : "-left-[100px] text-right",
          index === EXPERIENCE.length - 1
            ? "text-accent-blue/40"
            : "text-text-muted/20"
        )}
      >
        {lossValue}
      </div>

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

// Gradient descent contour lines + animated path
function GradientDescentOverlay() {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [pathLength, setPathLength] = useState(0);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, []);

  // The descent path curves gently as it goes down
  const descentPath = "M 50 20 C 60 120, 38 220, 55 320 C 68 420, 42 520, 50 620 C 56 720, 44 820, 50 920";

  return (
    <svg
      ref={ref}
      className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[200px] pointer-events-none"
      viewBox="0 0 100 940"
      preserveAspectRatio="none"
      style={{ height: "100%" }}
    >
      {/* Contour ellipses — loss landscape topology */}
      {[180, 400, 620, 840].map((cy, i) => (
        <g key={i}>
          <ellipse
            cx="50"
            cy={cy}
            rx={40 - i * 6}
            ry={60 - i * 8}
            fill="none"
            stroke="rgba(0, 212, 255, 0.04)"
            strokeWidth="0.5"
          />
          <ellipse
            cx="50"
            cy={cy}
            rx={30 - i * 4}
            ry={45 - i * 6}
            fill="none"
            stroke="rgba(123, 47, 255, 0.03)"
            strokeWidth="0.3"
          />
        </g>
      ))}

      {/* Global minimum glow at bottom */}
      <defs>
        <radialGradient id="minimumGlow" cx="50%" cy="100%" r="30%">
          <stop offset="0%" stopColor="rgba(0, 212, 255, 0.12)" />
          <stop offset="100%" stopColor="rgba(0, 212, 255, 0)" />
        </radialGradient>
      </defs>
      <rect x="0" y="820" width="100" height="120" fill="url(#minimumGlow)" />

      {/* Gradient descent path */}
      <defs>
        <linearGradient id="descentGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255, 100, 80, 0.4)" />
          <stop offset="50%" stopColor="rgba(123, 47, 255, 0.35)" />
          <stop offset="100%" stopColor="rgba(0, 212, 255, 0.5)" />
        </linearGradient>
      </defs>
      <path
        ref={pathRef}
        d={descentPath}
        fill="none"
        stroke="url(#descentGradient)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray={pathLength || 1400}
        strokeDashoffset={isInView ? 0 : pathLength || 1400}
        style={{
          transition: "stroke-dashoffset 2.5s ease-out",
        }}
      />
    </svg>
  );
}

export function Experience() {
  return (
    <SectionWrapper id="experience">
      <SectionHeading label="Experience" title="Where I've Built" gradientWord="Built" />

      <div className="relative">
        {/* Gradient descent SVG overlay */}
        <GradientDescentOverlay />

        {/* Timeline line — desktop (behind the SVG path) */}
        <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-border-subtle/30 via-border-subtle/10 to-transparent" />

        {/* Timeline line — mobile */}
        <div className="md:hidden absolute left-[5px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-accent-blue via-accent-purple to-transparent" />

        <div className="flex flex-col gap-8 md:gap-12">
          {EXPERIENCE.map((item, i) => (
            <TimelineItem
              key={item.id}
              item={item}
              index={i}
              isLeft={i % 2 === 0}
              lossValue={LOSS_VALUES[i] || "L = 0.01"}
            />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
