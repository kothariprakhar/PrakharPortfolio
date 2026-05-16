import Link from "next/link";
import { SOCIAL_LINKS } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-ink-200 bg-paper">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="smallcaps text-[12px] text-ink-500 tabular">
            &copy; {new Date().getFullYear()} Prakhar Kothari
          </p>
          <p className="font-ui text-[13px] text-ink-500 flex items-center">
            <a
              href={SOCIAL_LINKS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-clay-700 transition-colors"
            >
              LinkedIn
            </a>
            <span className="mx-2 text-ink-300">·</span>
            <a
              href={SOCIAL_LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-clay-700 transition-colors"
            >
              GitHub
            </a>
            <span className="mx-2 text-ink-300">·</span>
            <a
              href={`mailto:${SOCIAL_LINKS.email}`}
              className="hover:text-clay-700 transition-colors"
            >
              Email
            </a>
            <span className="mx-2 text-ink-300">·</span>
            <Link
              href="/colophon"
              className="smallcaps text-[12px] hover:text-clay-700 transition-colors"
            >
              Colophon
            </Link>
          </p>
        </div>

        {/* Typeset colophon line · the small idiosyncratic receipt for the broken-grid moves elsewhere */}
        <p className="mt-6 font-display italic text-[11px] text-ink-400 leading-[1.5] md:text-right">
          Set in Fraunces &amp; Newsreader on warm paper. Composed by hand, broken on purpose.
        </p>
      </div>
    </footer>
  );
}
