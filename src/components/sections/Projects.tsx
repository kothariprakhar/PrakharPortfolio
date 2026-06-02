import Link from "next/link";
import { SectionDefault } from "@/components/layout/SectionWrapper";
import { SectionTitleMarginal } from "@/components/ui/SectionHeading";
import { PROJECTS } from "@/lib/constants";

function ProjectRow({
  project,
  index,
}: {
  project: (typeof PROJECTS)[number];
  index: number;
}) {
  const num = String(index + 1).padStart(2, "0");
  const year = "year" in project && project.year ? (project.year as string) : "—";

  return (
    <Link
      href={`/projects/${project.id}`}
      className="group relative block border-t border-ink-300 py-10 md:py-14"
    >
      {/* Outdented project number · hangs off the left edge of the content column */}
      <span
        aria-hidden
        className="hidden md:block absolute left-[-72px] lg:left-[-100px] top-10 md:top-12 font-display font-medium text-[56px] lg:text-[72px] leading-none text-ink-300 tabular select-none pointer-events-none"
        style={{ fontFeatureSettings: '"onum"' }}
      >
        {num}
      </span>

      <div className="grid grid-cols-12 gap-x-6">
        {/* Mobile-only inline number */}
        <div className="md:hidden col-span-2">
          <span className="font-display font-medium text-[40px] leading-none text-ink-300 tabular">
            {num}
          </span>
        </div>

        {/* Metadata */}
        <div className="col-span-10 md:col-span-3 flex flex-col gap-1 md:pt-2">
          <Meta label="Type" value={project.type} />
          <Meta label="Year" value={year} />
          <Meta label="Role" value={roleFor(project.type)} />
          <Meta label="Stack" value={project.technologies.slice(0, 3).join(" · ")} />
        </div>

        {/* Body */}
        <div className="col-span-12 md:col-span-9 md:col-start-4 mt-6 md:mt-0">
          <h3 className="font-display font-medium text-[26px] md:text-[30px] leading-[1.15] tracking-[-0.015em] text-ink-900 text-balance group-hover:text-clay-700 transition-colors duration-200">
            {project.title}
          </h3>
          <p className="mt-2 font-ui text-[14px] text-ink-500">
            {project.subtitle}
          </p>
          <p className="mt-5 font-prose text-[17px] leading-[1.55] text-ink-700 max-w-[60ch]">
            {project.description}
          </p>
          <div className="mt-6 inline-flex items-center gap-2 font-ui text-[14px] text-ink-900">
            <span className="underline decoration-clay-500 decoration-[1.5px] underline-offset-[5px] group-hover:decoration-ink-blue transition-colors">
              Read the case study
            </span>
            <span className="transition-transform duration-200 group-hover:translate-x-1 text-clay-500">
              &rarr;
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3 smallcaps text-[12px] leading-[1.5]">
      <span className="text-ink-400 w-12 shrink-0">{label}</span>
      <span className="text-ink-700">{value}</span>
    </div>
  );
}

function roleFor(type: string) {
  if (type === "AI") return "Product + ML";
  if (type === "Product") return "Product Lead";
  return "Engineer";
}

/**
 * IDs already showcased visually in the ProductWork section above. We keep
 * their case-study detail pages reachable, but skip the duplicate text row.
 */
const HIDE_FROM_LIST = new Set(["codevision", "play-based-learning"]);

export function Projects() {
  const items = PROJECTS.filter((p) => !HIDE_FROM_LIST.has(p.id));
  return (
    <SectionDefault id="projects">
      <SectionTitleMarginal label="Case Studies">
        Deeper writeups of past work.
      </SectionTitleMarginal>

      <div className="relative border-b border-ink-300">
        {items.map((project, i) => (
          <ProjectRow key={project.id} project={project} index={i} />
        ))}
      </div>
    </SectionDefault>
  );
}
