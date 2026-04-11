"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ChevronLeft } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { CustomCursor } from "@/components/ui/CustomCursor";
import type { PROJECTS } from "@/lib/constants";

type Project = (typeof PROJECTS)[number];

const typeColors: Record<string, string> = {
  AI: "bg-accent-blue/10 text-accent-blue border-accent-blue/20",
  Product: "bg-accent-purple/10 text-accent-purple border-accent-purple/20",
  Engineering: "bg-accent-magenta/10 text-accent-magenta border-accent-magenta/20",
};

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export function CaseStudyContent({
  project,
  prevProject,
  nextProject,
}: {
  project: Project;
  prevProject: { id: string; title: string } | null;
  nextProject: { id: string; title: string } | null;
}) {
  const cs = project.caseStudy;

  return (
    <>
      <CustomCursor />
      <ScrollProgress />
      <Navbar />

      <main className="relative z-10 pt-24 pb-20 px-4 md:px-6">
        <div className="max-w-[800px] mx-auto">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link
              href="/#projects"
              className="inline-flex items-center gap-1 text-text-muted text-sm font-mono tracking-wider hover:text-accent-blue transition-colors mb-8"
            >
              <ChevronLeft size={14} />
              Back to Projects
            </Link>
          </motion.div>

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span
              className={`inline-block px-3 py-1 text-[11px] font-mono tracking-wider rounded-full border ${typeColors[project.type]}`}
            >
              {project.type}
            </span>

            <h1 className="mt-4 font-display font-bold text-3xl md:text-5xl leading-tight tracking-tight text-text-primary">
              {project.title}
            </h1>

            <p className="mt-3 text-text-secondary text-lg">{project.subtitle}</p>
          </motion.div>

          {/* Hero Metrics */}
          {cs && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mt-10 grid grid-cols-3 gap-4"
            >
              {cs.heroMetrics.map((m, i) => (
                <div
                  key={i}
                  className="glass-card p-5 text-center"
                >
                  <div className="font-display font-bold text-2xl md:text-3xl bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">
                    {m.value}
                  </div>
                  <div className="mt-1 text-text-muted text-xs font-mono tracking-wider uppercase">
                    {m.label}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Divider */}
          <div
            className="my-12 h-[1px] w-full"
            style={{
              background:
                "linear-gradient(to right, transparent, var(--divider-color), transparent)",
            }}
          />

          {/* Sections */}
          {cs?.sections.map((section, i) => (
            <motion.section
              key={i}
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="mb-12"
            >
              <h2 className="font-mono text-xs tracking-[0.12em] text-accent-blue uppercase mb-4">
                {section.heading}
              </h2>

              <p className="text-text-secondary leading-relaxed">{section.content}</p>

              {section.bullets && (
                <ul className="mt-4 space-y-2">
                  {section.bullets.map((bullet, j) => (
                    <li
                      key={j}
                      className="text-text-secondary text-sm leading-relaxed pl-5 relative before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-accent-blue/40"
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}

              {/* Inline metrics grid */}
              {"metrics" in section && section.metrics && (
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                  {section.metrics.map((m: { value: string; label: string }, j: number) => (
                    <div key={j} className="glass-card p-4 text-center">
                      <div className="font-display font-bold text-xl text-text-primary">
                        {m.value}
                      </div>
                      <div className="mt-1 text-text-muted text-[10px] font-mono tracking-wider uppercase leading-tight">
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.section>
          ))}

          {/* Technologies */}
          <div className="mb-12">
            <h2 className="font-mono text-xs tracking-[0.12em] text-text-muted uppercase mb-4">
              Technologies
            </h2>
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

          {/* Divider */}
          <div
            className="my-8 h-[1px] w-full"
            style={{
              background:
                "linear-gradient(to right, transparent, var(--divider-color), transparent)",
            }}
          />

          {/* Prev / Next navigation */}
          <div className="flex items-center justify-between">
            {prevProject ? (
              <Link
                href={`/projects/${prevProject.id}`}
                className="group flex items-center gap-2 text-text-muted hover:text-accent-blue transition-colors"
              >
                <ArrowLeft
                  size={16}
                  className="group-hover:-translate-x-1 transition-transform"
                />
                <div>
                  <div className="text-[10px] font-mono tracking-wider uppercase">Previous</div>
                  <div className="text-sm font-medium text-text-secondary group-hover:text-accent-blue transition-colors">
                    {prevProject.title}
                  </div>
                </div>
              </Link>
            ) : (
              <div />
            )}

            {nextProject ? (
              <Link
                href={`/projects/${nextProject.id}`}
                className="group flex items-center gap-2 text-right text-text-muted hover:text-accent-blue transition-colors"
              >
                <div>
                  <div className="text-[10px] font-mono tracking-wider uppercase">Next</div>
                  <div className="text-sm font-medium text-text-secondary group-hover:text-accent-blue transition-colors">
                    {nextProject.title}
                  </div>
                </div>
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
