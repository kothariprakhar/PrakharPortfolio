import { MarginalPanel } from "@/components/ui/MarginalPanel";

export function Hero() {
  return (
    <section className="relative pt-32 md:pt-44 pb-24 md:pb-32 px-5 md:px-8">
      <div className="max-w-[1200px] mx-auto grid grid-cols-12 gap-x-6 md:gap-x-8">
        {/* Headline column */}
        <div className="col-span-12 md:col-span-7">
          <h1
            className="font-display font-medium text-ink-900 text-[44px] md:text-[68px] leading-[1.02] tracking-[-0.03em] text-balance"
            style={{ fontFeatureSettings: '"ss01", "kern", "liga"' }}
          >
            I&rsquo;m Prakhar
            {/* Period hung into the right margin · the kind of detail a typesetter notices */}
            <span aria-hidden className="text-ink-900 -mr-[0.35em] inline-block translate-x-[0.05em]">.</span>
            <br />
            <span
              className="font-display italic text-ink-blue inline-block md:-ml-[0.04em]"
            >
              I build AI products end&#8209;to&#8209;end.
            </span>
          </h1>

          <p className="mt-10 font-prose text-[19px] md:text-[21px] leading-[1.55] text-ink-700 max-w-[58ch]">
            Six years of building, in different shapes. Engineer at{" "}
            <span className="text-ink-900">Unacademy</span>, PM at{" "}
            <span className="text-ink-900">Leena AI</span>, co-founder of an EdTech
            venture in London, and now a student again at{" "}
            <span className="text-ink-900">Kellogg + McCormick</span>.
          </p>

          {/* Pull quote, hung into the left gutter */}
          <blockquote className="mt-12 md:-ml-6 md:pl-6 md:border-l border-clay-500 font-prose italic text-[20px] md:text-[22px] leading-[1.5] text-ink-900 max-w-[52ch]">
            I keep coming back to the same thing. I get curious about how things
            work, and the best way I know to figure them out is to build and
            iterate on something.
          </blockquote>

          <div className="mt-12">
            <a
              href="#projects"
              className="group inline-flex items-center gap-2 font-ui text-[15px] text-ink-900 underline decoration-clay-500 decoration-[1.5px] underline-offset-[6px] hover:decoration-ink-blue transition-colors"
            >
              See the work
              <span className="transition-transform duration-200 group-hover:translate-x-1">
                &rarr;
              </span>
            </a>
          </div>
        </div>

        {/* Right Now panel anchored to the same baseline as the headline */}
        <div className="hidden md:block col-span-4 col-start-9 pt-3">
          <MarginalPanel
            label="Right Now"
            items={[
              "Building CodeVision (live at Northwestern)",
              "Studying ML at Kellogg + McCormick",
              "Open to AI / PM roles, Summer 2026",
            ]}
          />
        </div>

        {/* Mobile-only Right Now */}
        <div className="md:hidden col-span-12 mt-16">
          <MarginalPanel
            label="Right Now"
            items={[
              "Building CodeVision (live at Northwestern)",
              "Studying ML at Kellogg + McCormick",
              "Open to AI / PM roles, Summer 2026",
            ]}
          />
        </div>
      </div>
    </section>
  );
}
