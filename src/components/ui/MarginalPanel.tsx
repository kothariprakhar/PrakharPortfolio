import { cn } from "@/lib/utils";

/**
 * Small editorial side-panel. Used as a recurring marginal pattern
 * across the page (Right Now on Hero, Currently in Footer, etc.).
 * No card chrome — a hairline rule, a small caps label, a tight list.
 */
export function MarginalPanel({
  label,
  items,
  className,
}: {
  label: string;
  items: readonly string[];
  className?: string;
}) {
  return (
    <aside className={cn("max-w-[260px]", className)}>
      <div className="border-t border-ink-300 pt-3 mb-4">
        <span className="smallcaps text-[11px] text-ink-500">
          {label}
        </span>
      </div>
      <ul className="space-y-2.5">
        {items.map((item) => (
          <li
            key={item}
            className="font-ui text-[14px] text-ink-700 leading-[1.45]"
          >
            {item}
          </li>
        ))}
      </ul>
    </aside>
  );
}
