import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import type { PROJECTS } from "@/lib/constants";

type Project = (typeof PROJECTS)[number];

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
      <ScrollProgress />
      <Navbar />

      <main className="relative z-10 pt-28 pb-20 px-5 md:px-8">
        <div className="max-w-[820px] mx-auto">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 font-ui text-[13px] text-ink-500 hover:text-clay-700 transition-colors mb-10"
          >
            <span>&larr;</span> Back to projects
          </Link>

          {/* Header */}
          <header>
            <p className="smallcaps text-[12px] text-ink-500 mb-5">
              {project.type}
            </p>
            <h1 className="font-display font-medium text-[40px] md:text-[56px] leading-[1.05] tracking-[-0.025em] text-ink-900 text-balance">
              {project.title}
            </h1>
            <p className="mt-4 font-prose italic text-[19px] text-ink-500 max-w-[60ch]">
              {project.subtitle}
            </p>

            {("liveUrl" in project && project.liveUrl) ||
            ("githubUrl" in project && project.githubUrl) ? (
              <div className="mt-6 flex items-center gap-6 font-ui text-[14px]">
                {"liveUrl" in project && project.liveUrl && (
                  <a
                    href={project.liveUrl as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink-900 underline decoration-clay-500 decoration-[1.5px] underline-offset-[5px] hover:decoration-ink-blue transition-colors"
                  >
                    Live demo &rarr;
                  </a>
                )}
                {"githubUrl" in project && project.githubUrl && (
                  <a
                    href={project.githubUrl as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink-900 underline decoration-clay-500 decoration-[1.5px] underline-offset-[5px] hover:decoration-ink-blue transition-colors"
                  >
                    GitHub &rarr;
                  </a>
                )}
              </div>
            ) : null}
          </header>

          {/* Hero metrics */}
          {cs && (
            <div className="mt-12 grid grid-cols-3 gap-x-6 border-t border-ink-300 pt-6">
              {cs.heroMetrics.map((m, i) => (
                <div key={i}>
                  <div className="font-display font-medium text-[32px] md:text-[40px] leading-none text-ink-900 tabular tracking-[-0.02em]">
                    {m.value}
                  </div>
                  <div className="mt-2 smallcaps text-[11px] text-ink-500 leading-tight">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="my-14 border-t border-ink-300" />

          {/* Sections */}
          {cs?.sections.map((section, i) => (
            <section key={i} className="mb-12">
              <h2 className="smallcaps text-[12px] text-ink-500 mb-4">
                {section.heading}
              </h2>
              <p className="font-prose text-[18px] leading-[1.65] text-ink-700">
                {section.content}
              </p>

              {section.bullets && (
                <ul className="mt-5 space-y-2 max-w-[64ch]">
                  {section.bullets.map((bullet, j) => (
                    <li
                      key={j}
                      className="font-prose text-[16px] leading-[1.55] text-ink-700 pl-5 relative"
                    >
                      <span className="absolute left-0 top-[0.5em] text-clay-500" aria-hidden>·</span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}

              {/* Inline metric grids removed · hero metrics row at top is the single scannable strip.
                  In-body figures are folded into prose with typographic emphasis. */}
            </section>
          ))}

          {/* Technologies */}
          <div className="mb-12 mt-14 border-t border-ink-300 pt-6">
            <h2 className="smallcaps text-[12px] text-ink-500 mb-3">
              Technologies
            </h2>
            <p className="font-mono text-[12px] tracking-[0.04em] text-ink-700 uppercase">
              {project.technologies.join(" · ")}
            </p>
          </div>

          {/* Prev / Next */}
          <div className="flex items-center justify-between border-t border-ink-300 pt-8 gap-6">
            {prevProject ? (
              <Link
                href={`/projects/${prevProject.id}`}
                className="group max-w-[40%]"
              >
                <div className="smallcaps text-[11px] text-ink-500 mb-1">Previous</div>
                <div className="font-display text-[16px] text-ink-700 group-hover:text-clay-700 transition-colors">
                  &larr; {prevProject.title}
                </div>
              </Link>
            ) : (
              <div />
            )}
            {nextProject ? (
              <Link
                href={`/projects/${nextProject.id}`}
                className="group max-w-[40%] text-right ml-auto"
              >
                <div className="smallcaps text-[11px] text-ink-500 mb-1">Next</div>
                <div className="font-display text-[16px] text-ink-700 group-hover:text-clay-700 transition-colors">
                  {nextProject.title} &rarr;
                </div>
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
