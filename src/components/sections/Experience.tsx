"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionDefault } from "@/components/layout/SectionWrapper";
import { SectionTitleSerif } from "@/components/ui/SectionHeading";
import { EXPERIENCE } from "@/lib/constants";

function startYear(period: string): string {
  const m = period.match(/\d{4}/);
  return m ? m[0] : "";
}

function ExperienceRow({ item }: { item: (typeof EXPERIENCE)[number] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="relative pl-0 md:pl-[88px] py-8 md:py-10">
      {/* Year hangs in the left gutter as a marginal label, spine-aligned */}
      <span
        aria-hidden
        className="hidden md:block absolute left-0 top-[2.1rem] smallcaps text-[12px] text-ink-500 tabular tracking-[0.08em]"
      >
        {startYear(item.period)}
      </span>

      <p className="md:hidden smallcaps text-[12px] text-ink-500 tabular mb-2">
        {item.period} · {item.location}
      </p>

      <h3 className="font-display font-medium text-[22px] md:text-[24px] leading-[1.2] tracking-[-0.015em] text-ink-900 text-balance">
        {item.role}
      </h3>
      <p className="mt-1 font-prose italic text-[16px] text-ink-500">
        {item.companyShort}
        <span className="hidden md:inline text-ink-300"> · </span>
        <span className="hidden md:inline smallcaps text-[11px] text-ink-400 tabular not-italic">
          {item.period}, {item.location}
        </span>
      </p>

      {"contextNote" in item && item.contextNote && (
        <p className="mt-3 font-prose italic text-[14px] text-ink-400 leading-snug">
          {item.contextNote}
        </p>
      )}

      <p className="mt-4 font-prose text-[16px] leading-[1.6] text-ink-700 max-w-[64ch]">
        {item.summary}
      </p>

      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="mt-5 inline-flex items-center gap-2 font-ui text-[13px] text-ink-700 hover:text-clay-700 transition-colors"
        aria-expanded={expanded}
      >
        <span className="underline decoration-clay-500 decoration-[1.5px] underline-offset-[4px]">
          {expanded ? "Less" : "More"}
        </span>
        <span
          className="text-clay-500 transition-transform duration-200"
          style={{ transform: expanded ? "rotate(90deg)" : "none" }}
          aria-hidden
        >
          &rarr;
        </span>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <ul className="mt-5 space-y-2.5 max-w-[64ch]">
              {item.details.map((detail, i) => (
                <li
                  key={i}
                  className="font-prose text-[15px] leading-[1.55] text-ink-700 pl-5 relative"
                >
                  <span className="absolute left-0 top-[0.5em] text-clay-500" aria-hidden>
                    ·
                  </span>
                  {detail}
                </li>
              ))}
            </ul>
            <p className="mt-4 font-mono text-[11px] text-ink-500 tracking-[0.04em]">
              {item.technologies.join(" · ")}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}

export function Experience() {
  return (
    <SectionDefault id="experience">
      <SectionTitleSerif>
        Where I&rsquo;ve shipped, and what I learned doing it.
      </SectionTitleSerif>

      {/* Single vertical spine on md+; rows are full-bleed (no border between them) */}
      <div className="relative md:before:absolute md:before:top-2 md:before:bottom-2 md:before:left-[64px] md:before:w-px md:before:bg-ink-200 md:before:content-['']">
        {EXPERIENCE.map((item) => (
          <ExperienceRow key={item.id} item={item} />
        ))}
      </div>
    </SectionDefault>
  );
}
