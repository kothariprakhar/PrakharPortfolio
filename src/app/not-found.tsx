import Link from "next/link";

/**
 * 404 · typeset as a book index. Page numbers are tabular figures,
 * dotted leaders, entries listed alphabetically. Every entry is a real
 * jump back into the site, so the 404 doubles as a navigation device.
 */

type IndexEntry = {
  label: string;
  href: string;
  page: string;
};

const ENTRIES: IndexEntry[] = [
  { label: "About", href: "/#about", page: "002" },
  { label: "Colophon", href: "/colophon", page: "141" },
  { label: "Contact", href: "/#contact", page: "112" },
  { label: "Experience, professional", href: "/#experience", page: "024" },
  { label: "Home", href: "/", page: "001" },
  { label: "LinkedIn (external)", href: "https://www.linkedin.com/in/prakhar--kothari/", page: "—" },
  { label: "Projects, selected", href: "/#projects", page: "048" },
  { label: "Résumé (PDF)", href: "/resume.pdf", page: "ix" },
  { label: "Writing, recent notes", href: "/blog", page: "076" },
];

export default function NotFound() {
  return (
    <main className="min-h-screen bg-paper px-5 md:px-8 pt-20 pb-24">
      <div className="max-w-[680px] mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-ui text-[13px] text-ink-500 hover:text-clay-700 transition-colors mb-14"
        >
          <span>&larr;</span> Return to the main text
        </Link>

        <header className="mb-14">
          <p className="smallcaps text-[12px] text-ink-500 mb-4 tabular">
            Errata · page not found
          </p>
          <h1
            className="font-display font-medium text-[48px] md:text-[64px] leading-[1.0] tracking-[-0.03em] text-ink-900 text-balance"
            style={{ fontFeatureSettings: '"ss01", "kern", "liga"' }}
          >
            <span>Index</span>
            <span aria-hidden className="text-ink-900 -mr-[0.35em] inline-block translate-x-[0.05em]">.</span>
          </h1>
          <p className="mt-6 font-prose italic text-[18px] text-ink-blue max-w-[52ch]">
            The page you asked for is not in the manuscript. It may have been
            removed in proof. Here is the table that should have led you home.
          </p>
        </header>

        <div className="border-t border-ink-300 pt-6">
          <ul className="font-prose text-[17px] leading-[1.85] text-ink-700">
            {ENTRIES.map((entry) => {
              const external = entry.href.startsWith("http");
              return (
                <li key={entry.label} className="flex items-baseline gap-3">
                  <Link
                    href={entry.href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="text-ink-900 hover:text-clay-700 transition-colors whitespace-nowrap"
                  >
                    {entry.label}
                  </Link>
                  <span
                    aria-hidden
                    className="flex-1 border-b border-dotted border-ink-300 translate-y-[-3px] mx-1"
                  />
                  <span className="smallcaps text-[12px] text-ink-500 tabular tracking-[0.08em] whitespace-nowrap">
                    {entry.page}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <p className="mt-16 font-display italic text-[12px] text-ink-400 leading-[1.5] md:text-right">
          The author regrets the interruption.
        </p>
      </div>
    </main>
  );
}
