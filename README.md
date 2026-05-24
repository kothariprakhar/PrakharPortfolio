# Prakhar Portfolio

Prakhar Portfolio is a personal portfolio and writing site built with Next.js, TypeScript, MDX, and a carefully designed editorial interface. It presents career narrative, selected AI/product work, case studies, long-form writing, and contact paths in one cohesive web experience.

The site is intentionally not a generic portfolio template. It is built around a specific positioning: an AI product builder with engineering depth, PM experience, and an MBA + AI chapter at Northwestern.

## Current status

This repository is an active portfolio site. The homepage, experience narrative, selected-work section, case study routes, MDX blog pipeline, layout components, typography system, social links, and content constants are implemented.

It is still incomplete in a few practical ways:

- some assets, resume files, or project links may need final production review
- content is primarily code-defined rather than CMS-managed
- analytics, newsletter capture, and structured SEO enhancements are not yet central
- case study data lives in `src/lib/constants.ts`, which is fast to iterate on but not ideal for non-technical editing
- the current design favors a bespoke editorial look, so every new section needs careful layout QA

## Product idea

The product is the person. The site needs to answer a recruiter, collaborator, or hiring manager quickly:

- What does Prakhar build?
- What level of product and engineering ownership has he had?
- What kind of thinking shows up in the work?
- Is there enough proof to start a conversation?

The portfolio uses case studies and writing as evidence. Instead of only listing technologies, it explains product context, trade-offs, outcomes, and lessons.

## What works today

- Next.js App Router site with static pages and dynamic project/blog routes
- Hero, about, experience, projects, blog, contact, footer, and navigation sections
- Project case studies generated from structured constants
- MDX blog posts loaded from `content/blog`
- Reading-time estimation and frontmatter parsing
- Responsive editorial layout with custom typography and restrained motion
- Open Graph image route
- Reusable layout and UI primitives for sections, panels, headings, progress, and social links
- Tailwind CSS v4 styling
- Support for rich code highlighting and MDX formatting libraries

## Product manager perspective

A portfolio has a conversion funnel just like a product. The user lands with low context and limited time. The site must earn attention, provide proof, and make the next step obvious.

The strongest PM choice here is specificity. "I build AI products end-to-end" is broad enough to cover engineering and product, but specific enough to guide the rest of the page. The case studies then support the claim with measurable context: procurement automation, CodeVision, Club Khel, and other work.

The writing section is also a strategic asset. It shows how the builder thinks when no one is forcing a deliverable. That matters for AI/product roles where judgment, clarity, and taste are hard to infer from bullet points.

## Key trade-offs

- Bespoke design vs maintainability: The editorial system feels distinct, but it takes more care than a stock component library.
- Code-defined content vs CMS editing: Constants and MDX are versionable and simple, but non-technical updates require repo changes.
- Narrative depth vs scan speed: Case studies build credibility, but the homepage must still stay easy to skim.
- Static generation vs dynamic features: Static content is fast and reliable, but analytics, gated content, or personalization would need more infrastructure.
- Personal voice vs conventional resume format: The site feels more human, but some recruiters may still want a direct resume link.

## Concepts used

- Next.js App Router: File-based routing, metadata, and page composition.
- Static generation: Project pages and blog slugs are generated from local content.
- MDX: Markdown content with React-compatible rendering for blog posts.
- Frontmatter: YAML metadata for blog title, date, tags, and publishing state.
- Design tokens: Shared visual decisions encoded through Tailwind and custom components.
- Case study model: Structured project data that drives repeatable story pages.
- Open Graph image: Social preview image generated through an app route.
- Server-only content loader: Blog parsing kept out of client bundles.
- Responsive editorial layout: Typography-first layout that adapts across viewports.

## Project structure

```text
src/app/                    App routes, layout, blog pages, project pages
src/components/layout/      Navbar, footer, section wrappers
src/components/sections/    Hero, about, experience, projects, blog, contact
src/components/blog/        Blog cards, headers, MDX rendering
src/components/ui/          Reusable visual primitives
src/lib/constants.ts        Profile, experience, project, and case study data
src/lib/blog.ts             Server-only MDX blog loader
content/blog/               MDX posts
public/                     Static assets
```

## Getting started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

Build for production:

```bash
npm run build
npm run start
```

Run linting:

```bash
npm run lint
```

## Writing workflow

Add a new post under `content/blog/<slug>.mdx`:

```mdx
---
title: "Post title"
excerpt: "Short summary"
date: "2026-05-23"
tags: ["AI", "Product"]
published: true
---

Post body...
```

The blog loader reads posts, estimates reading time, filters unpublished drafts, and sorts by date.

## Editing project content

Most homepage and case-study content lives in `src/lib/constants.ts`:

- `NAV_LINKS`
- `SOCIAL_LINKS`
- `STATS`
- `JOURNEY`
- `EXPERIENCE`
- `PROJECTS`

Each project can include metrics, sections, bullets, links, and rich case-study copy.

## Next steps

- Add final resume asset and verify every external link.
- Add richer SEO metadata for project and blog pages.
- Add analytics for section engagement and contact conversion.
- Split large content constants if project data keeps growing.
- Add automated visual checks before major design changes.
