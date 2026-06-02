import Image from "next/image";
import { SectionDefault } from "@/components/layout/SectionWrapper";
import { SectionTitleMarginal } from "@/components/ui/SectionHeading";

/**
 * ProductWork · a visual gallery of three builds with screenshots.
 * Sits between Experience and Selected Work to lead with the things people
 * can actually click into, before the longer-form case study list.
 */

type Tag = { label: string; value: string };

type Entry = {
  num: string;
  title: string;
  kicker: string;
  year: string;
  role: string;
  stack: string;
  liveHref?: string;
  liveLabel?: string;
  caseStudyHref?: string;
  prose: string;
  images: { src: string; alt: string }[];
  layout: "wide-stack" | "wide-grid" | "phone-row";
};

const ENTRIES: Entry[] = [
  {
    num: "01",
    title: "Aarushi Asawa",
    kicker: "Portfolio for a sustainability consultant",
    year: "2026",
    role: "Design + Build",
    stack: "Next.js · Tailwind · Framer Motion",
    liveHref: "https://aarushi-asawa.vercel.app",
    liveLabel: "aarushi-asawa.vercel.app",
    prose:
      "Built end-to-end for my wife, a Chartered Accountant turned circular-economy consultant. We wanted the site to feel like the work itself: warm, considered, and structurally rigorous, not another consultant template. I set the brand, designed the type, and shipped it in a weekend.",
    images: [
      { src: "/product/aarushi/hero.jpg", alt: "Aarushi Asawa portfolio hero" },
      { src: "/product/aarushi/pillars.jpg", alt: "The Multidisciplinary Advantage section" },
      { src: "/product/aarushi/roadmap.jpg", alt: "The Transformation Roadmap section" },
    ],
    layout: "wide-stack",
  },
  {
    num: "02",
    title: "CodeVision",
    kicker: "AI-powered codebase intelligence",
    year: "2026",
    role: "Product + Engineer",
    stack: "Claude API · Next.js · Supabase",
    liveHref: "https://code-vision-inky.vercel.app",
    liveLabel: "code-vision-inky.vercel.app",
    caseStudyHref: "/projects/codevision",
    prose:
      "A platform that makes any GitHub repository instantly legible. Smart file selection inside Claude's context window feeds a structured analysis pipeline, which then powers six visualization views: an architecture diagram, user flow, tech stack, risk panel, version diff, and a grounded chat assistant. Live in production at Northwestern, gated by university email.",
    images: [
      { src: "/product/codevision/architecture.jpg", alt: "CodeVision architecture diagram view" },
      { src: "/product/codevision/user-flow.jpg", alt: "CodeVision user flow view" },
      { src: "/product/codevision/risks.jpg", alt: "CodeVision risk and technical debt overview" },
      { src: "/product/codevision/chat.jpg", alt: "CodeVision AI chat assistant" },
    ],
    layout: "wide-grid",
  },
  {
    num: "03",
    title: "Club Khel",
    kicker: "Play-based learning for primary schools",
    year: "2023",
    role: "Founder + Product",
    stack: "React Native · Node · Pedagogy",
    caseStudyHref: "/projects/play-based-learning",
    prose:
      "Co-founded at Imperial College London on a single observation: children in underserved schools learn math faster through sport than through lectures. We built a play-based platform where coaches run sessions on the court and students reflect in the app afterwards. Piloted in 10+ schools, reached 700 students, hit 45% DAU/MAU.",
    images: [
      { src: "/product/clubkhel/home.jpg", alt: "Club Khel home screen with greeting and next match" },
      { src: "/product/clubkhel/session.jpg", alt: "Match day session detail screen" },
      { src: "/product/clubkhel/reflect.jpg", alt: "Reflection prompt after a session" },
      { src: "/product/clubkhel/progress.jpg", alt: "Locker room with earned jerseys" },
    ],
    layout: "phone-row",
  },
];

function MetaRow({ tags }: { tags: Tag[] }) {
  return (
    <dl className="flex flex-col gap-1.5">
      {tags.map(t => (
        <div key={t.label} className="flex gap-3 smallcaps text-[12px] leading-[1.5]">
          <dt className="text-ink-400 w-14 shrink-0">{t.label}</dt>
          <dd className="text-ink-700">{t.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function Links({ entry }: { entry: Entry }) {
  if (!entry.liveHref && !entry.caseStudyHref) return null;
  return (
    <div className="mt-7 flex flex-col gap-3 font-ui text-[14px]">
      {entry.liveHref && (
        <a
          href={entry.liveHref}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 text-ink-900"
        >
          <span className="smallcaps text-[11px] text-ink-400 w-14 shrink-0">Live</span>
          <span className="underline decoration-clay-500 decoration-[1.5px] underline-offset-[5px] group-hover:decoration-ink-blue transition-colors">
            {entry.liveLabel ?? entry.liveHref}
          </span>
          <span className="text-clay-500 transition-transform duration-200 group-hover:translate-x-0.5">
            &#8599;
          </span>
        </a>
      )}
      {entry.caseStudyHref && (
        <a
          href={entry.caseStudyHref}
          className="group inline-flex items-center gap-2 text-ink-900"
        >
          <span className="smallcaps text-[11px] text-ink-400 w-14 shrink-0">Read</span>
          <span className="underline decoration-clay-500 decoration-[1.5px] underline-offset-[5px] group-hover:decoration-ink-blue transition-colors">
            Case study
          </span>
          <span className="text-clay-500 transition-transform duration-200 group-hover:translate-x-1">
            &rarr;
          </span>
        </a>
      )}
    </div>
  );
}

function ImageFrame({
  src,
  alt,
  ratio,
  sizes,
  priority = false,
}: {
  src: string;
  alt: string;
  ratio: string;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <div
      className="relative w-full overflow-hidden border border-ink-200 bg-ink-100"
      style={{ aspectRatio: ratio }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover object-top"
        priority={priority}
      />
    </div>
  );
}

function Gallery({ entry, indexInList }: { entry: Entry; indexInList: number }) {
  if (entry.layout === "wide-stack") {
    return (
      <div className="mt-10 space-y-4">
        <ImageFrame
          src={entry.images[0].src}
          alt={entry.images[0].alt}
          ratio="1800 / 1062"
          sizes="(min-width: 768px) 75vw, 100vw"
          priority={indexInList === 0}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {entry.images.slice(1).map(img => (
            <ImageFrame
              key={img.src}
              src={img.src}
              alt={img.alt}
              ratio="1800 / 1100"
              sizes="(min-width: 768px) 36vw, 100vw"
            />
          ))}
        </div>
      </div>
    );
  }

  if (entry.layout === "wide-grid") {
    return (
      <div className="mt-10 space-y-4">
        <ImageFrame
          src={entry.images[0].src}
          alt={entry.images[0].alt}
          ratio="1800 / 1031"
          sizes="(min-width: 768px) 75vw, 100vw"
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {entry.images.slice(1).map(img => (
            <ImageFrame
              key={img.src}
              src={img.src}
              alt={img.alt}
              ratio="1800 / 1031"
              sizes="(min-width: 768px) 24vw, 100vw"
            />
          ))}
        </div>
      </div>
    );
  }

  // phone-row · 4 mobile screenshots side by side
  return (
    <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
      {entry.images.map(img => (
        <ImageFrame
          key={img.src}
          src={img.src}
          alt={img.alt}
          ratio="750 / 1624"
          sizes="(min-width: 768px) 18vw, 45vw"
        />
      ))}
    </div>
  );
}

function Row({ entry, indexInList }: { entry: Entry; indexInList: number }) {
  return (
    <article className="relative border-t border-ink-300 py-14 md:py-20 first:border-t-0 first:pt-0">
      {/* Outdented numeral · hangs into the gutter on md+ */}
      <span
        aria-hidden
        className="hidden md:block absolute left-[-72px] lg:left-[-100px] top-14 md:top-20 font-display font-medium text-[56px] lg:text-[72px] leading-none text-ink-300 tabular select-none pointer-events-none"
        style={{ fontFeatureSettings: '"onum"' }}
      >
        {entry.num}
      </span>

      <div className="grid grid-cols-12 gap-x-6">
        {/* Mobile-only inline number */}
        <div className="md:hidden col-span-2">
          <span className="font-display font-medium text-[40px] leading-none text-ink-300 tabular">
            {entry.num}
          </span>
        </div>

        {/* Metadata column */}
        <div className="col-span-10 md:col-span-3 md:pt-2">
          <MetaRow
            tags={[
              { label: "Year", value: entry.year },
              { label: "Role", value: entry.role },
              { label: "Stack", value: entry.stack },
            ]}
          />
          <Links entry={entry} />
        </div>

        {/* Body column */}
        <div className="col-span-12 md:col-span-9 md:col-start-4 mt-8 md:mt-0">
          <h3 className="font-display font-medium text-[28px] md:text-[34px] leading-[1.1] tracking-[-0.015em] text-ink-900 text-balance">
            {entry.title}
          </h3>
          <p className="mt-2 font-ui text-[14px] text-ink-500">{entry.kicker}</p>
          <p className="mt-5 font-prose text-[17px] leading-[1.6] text-ink-700 max-w-[62ch]">
            {entry.prose}
          </p>

          <Gallery entry={entry} indexInList={indexInList} />
        </div>
      </div>
    </article>
  );
}

export function ProductWork() {
  return (
    <SectionDefault id="work">
      <SectionTitleMarginal label="Product Work">
        Things I&rsquo;ve shipped.
      </SectionTitleMarginal>

      <div className="relative">
        {ENTRIES.map((entry, i) => (
          <Row key={entry.num} entry={entry} indexInList={i} />
        ))}
      </div>
    </SectionDefault>
  );
}
