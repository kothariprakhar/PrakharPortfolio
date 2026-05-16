import { cn } from "@/lib/utils";

/**
 * SectionTitleSerif — large editorial display title. No eyebrow, no accent word.
 * Use for sections where the heading itself is the entire opening gesture.
 */
export function SectionTitleSerif({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "font-display font-medium text-ink-900 text-[40px] md:text-[56px] leading-[1.05] tracking-[-0.02em] text-balance mb-14 md:mb-20",
        className,
      )}
    >
      {children}
    </h2>
  );
}

/**
 * SectionTitleMarginal — 12-col layout: small mono label in cols 1–2, title in cols 3–10.
 * Anchors the heading to a real grid instead of a centered block.
 */
export function SectionTitleMarginal({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("grid grid-cols-12 gap-x-6 gap-y-6 mb-14 md:mb-20", className)}>
      <p className="col-span-12 md:col-span-2 font-mono text-[11px] tracking-[0.08em] text-ink-500 uppercase pt-2">
        {label}
      </p>
      <h2 className="col-span-12 md:col-span-9 font-display font-medium text-ink-900 text-[36px] md:text-[48px] leading-[1.08] tracking-[-0.02em] text-balance">
        {children}
      </h2>
    </header>
  );
}

/**
 * SectionTitleInline — heading runs inline with the first paragraph, separated by middle dot.
 * The tightest, most conversational treatment.
 */
export function SectionTitleInline({
  title,
  lead,
  className,
}: {
  title: string;
  lead: string;
  className?: string;
}) {
  return (
    <p className={cn("font-prose text-[20px] md:text-[22px] leading-[1.45] text-ink-700 text-balance mb-12 md:mb-16 max-w-[44ch]", className)}>
      <span className="font-display font-medium text-ink-900 text-[22px] md:text-[26px] tracking-[-0.01em]">
        {title}
      </span>
      <span className="text-ink-300 mx-2">·</span>
      <span>{lead}</span>
    </p>
  );
}

/**
 * Legacy SectionHeading — kept as a shim so older callers compile during migration.
 * New code should pick one of the three treatments above.
 */
export function SectionHeading({
  label,
  title,
}: {
  label?: string;
  title: string;
  subtitle?: string;
}) {
  if (label) {
    return <SectionTitleMarginal label={label}>{title}</SectionTitleMarginal>;
  }
  return <SectionTitleSerif>{title}</SectionTitleSerif>;
}
