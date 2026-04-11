import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PROJECTS } from "@/lib/constants";
import { CaseStudyContent } from "./CaseStudyContent";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const project = PROJECTS.find((p) => p.id === id);
  if (!project) return {};

  return {
    title: `${project.title} — Prakhar Kothari`,
    description: project.description,
    openGraph: {
      title: `${project.title} — Case Study`,
      description: project.description,
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const projectIndex = PROJECTS.findIndex((p) => p.id === id);
  if (projectIndex === -1) notFound();

  const project = PROJECTS[projectIndex];
  const prevProject = projectIndex > 0 ? PROJECTS[projectIndex - 1] : null;
  const nextProject =
    projectIndex < PROJECTS.length - 1 ? PROJECTS[projectIndex + 1] : null;

  return (
    <CaseStudyContent
      project={project}
      prevProject={prevProject ? { id: prevProject.id, title: prevProject.title } : null}
      nextProject={nextProject ? { id: nextProject.id, title: nextProject.title } : null}
    />
  );
}
