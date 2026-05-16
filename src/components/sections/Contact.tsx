import { SectionTight } from "@/components/layout/SectionWrapper";
import { SOCIAL_LINKS } from "@/lib/constants";

/**
 * Contact · a single typographic statement, not a key/value list.
 * The sentence is the page. Names are the links.
 */
export function Contact() {
  return (
    <SectionTight id="contact">
      <p className="smallcaps text-[12px] text-ink-500 mb-10">Contact</p>

      <p className="font-display font-medium text-ink-900 text-[28px] md:text-[44px] leading-[1.18] tracking-[-0.02em] text-balance max-w-[22ch]">
        Best place to find me is{" "}
        <a
          href={`mailto:${SOCIAL_LINKS.email}`}
          className="italic underline decoration-clay-500 decoration-[2px] underline-offset-[6px] hover:decoration-ink-blue transition-colors"
        >
          over email
        </a>
        .
      </p>

      <p className="mt-10 font-prose text-[18px] leading-[1.6] text-ink-700 max-w-[52ch]">
        Otherwise I&rsquo;m on{" "}
        <a
          href={SOCIAL_LINKS.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-clay-500 decoration-[1.5px] underline-offset-[4px] hover:decoration-ink-blue transition-colors"
        >
          LinkedIn
        </a>{" "}
        and shipping things on{" "}
        <a
          href={SOCIAL_LINKS.github}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-clay-500 decoration-[1.5px] underline-offset-[4px] hover:decoration-ink-blue transition-colors"
        >
          GitHub
        </a>
        . Roles, projects, or just exchanging ideas about AI and product · all welcome.
      </p>

      <p className="mt-12 smallcaps text-[12px] text-ink-500 tabular">
        Evanston, Illinois · Open to AI / PM roles, Summer 2026
      </p>
    </SectionTight>
  );
}
