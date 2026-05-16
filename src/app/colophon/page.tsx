import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MarginalPanel } from "@/components/ui/MarginalPanel";
import { Dingbat } from "@/components/ui/Dingbat";

export const metadata: Metadata = {
  title: "Colophon | Prakhar Kothari",
  description:
    "A note on how this site is set, the palette, the tools, and the people whose standard I am chasing.",
};

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-12 first:mt-0">
      <p className="smallcaps text-[12px] text-ink-500 mb-3">{label}</p>
      <div className="font-prose text-[18px] leading-[1.65] text-ink-700">
        {children}
      </div>
    </section>
  );
}

export default function ColophonPage() {
  return (
    <>
      <Navbar />
      <main className="relative z-10 min-h-screen bg-paper pt-28 pb-24 px-5 md:px-8">
        <div className="max-w-[680px] mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-ui text-[13px] text-ink-500 hover:text-clay-700 transition-colors mb-12"
          >
            <span>&larr;</span> Back home
          </Link>

          <header className="mb-14">
            <p className="smallcaps text-[12px] text-ink-500 mb-4">Note</p>
            <h1
              className="font-display font-medium text-[48px] md:text-[64px] leading-[1.0] tracking-[-0.03em] text-ink-900 text-balance"
              style={{ fontFeatureSettings: '"ss01", "kern", "liga"' }}
            >
              <span>Colophon</span>
              <span aria-hidden className="text-ink-900 -mr-[0.35em] inline-block translate-x-[0.05em]">.</span>
            </h1>
            <p className="mt-6 font-prose italic text-[20px] text-ink-blue max-w-[52ch]">
              A short note on how this site is set, what it is made of, and the
              people whose standard we are chasing.
            </p>
          </header>

          <Section label="Type">
            Set in <strong className="text-ink-900">Fraunces</strong> for display,{" "}
            <strong className="text-ink-900">Newsreader</strong> for the body,{" "}
            <strong className="text-ink-900">Inter</strong> for UI chrome, and{" "}
            <strong className="text-ink-900">JetBrains Mono</strong> reserved for code.
            Body runs 18 px on 1.65 leading, oldstyle figures, hanging punctuation,
            soft-hyphen breaks. The hero borrows a Fraunces stylistic alternate
            (ss01) for a single quiet swap.
          </Section>

          <Section label="Palette">
            Paper <span className="font-mono text-[14px] text-ink-900">#F6F2E9</span>,
            ink <span className="font-mono text-[14px] text-ink-900">#14110D</span>,
            clay <span className="font-mono text-[14px] text-clay-700">#A0522D</span>,
            ink-blue <span className="font-mono text-[14px] text-ink-blue">#2A4A6B</span>.
            Two colors, used like a pen and a pencil · clay does the underlines and
            the marginal dots, ink-blue does one line in the hero and the focus ring.
          </Section>

          <Section label="Tools">
            Next.js 16 on the App Router, Tailwind v4 with tokens defined in{" "}
            <code className="font-mono text-[15px] text-clay-700">@theme</code>,
            MDX for prose, Framer Motion only for the expand-on-click row in
            Experience and the mobile menu. Deployed on Vercel. Written in
            VS Code, mostly on warm-paper backgrounds in a small apartment in
            Evanston.
          </Section>

          <div className="my-14">
            <Dingbat />
          </div>

          <Section label="Current">
            <MarginalPanel
              label="Right Now"
              items={[
                "Building CodeVision (live at Northwestern)",
                "Studying ML at Kellogg + McCormick",
                "Reading whatever Robin Sloan ships next",
              ]}
              className="max-w-none"
            />
          </Section>

          <Section label="Gratitude">
            The frame here owes a great deal to{" "}
            <a
              href="https://robinrendle.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-clay-500 decoration-[1.5px] underline-offset-[4px] hover:decoration-ink-blue"
            >
              Robin Rendle
            </a>
            , whose newsletter taught us that a personal site can read like a
            book. To{" "}
            <a
              href="https://practicaltypography.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-clay-500 decoration-[1.5px] underline-offset-[4px] hover:decoration-ink-blue"
            >
              Matthew Butterick
            </a>
            , for the rule that one space after a period is always enough.
            To Penguin Classics, for the index page treatment we borrowed for the
            404. And to every reader who made it this far · thank you for
            spending the eye-minutes.
          </Section>

          <p className="mt-20 smallcaps text-[12px] text-ink-500 tabular">
            Last revised · {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long" })}
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
