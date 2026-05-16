import { cn } from "@/lib/utils";

/**
 * Custom dingbat · a 10×10 ink-900 square rotated 45° (a diamond), with a
 * single hairline clay outline. Used at most once per page as a section
 * break, in place of <hr />. The "broken on purpose" mark.
 */
export function Dingbat({ className }: { className?: string }) {
  return (
    <div
      role="separator"
      aria-hidden
      className={cn("flex items-center justify-center my-12", className)}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="3.5"
          y="3.5"
          width="11"
          height="11"
          transform="rotate(45 9 9)"
          fill="#14110D"
          stroke="#A0522D"
          strokeWidth="0.75"
        />
      </svg>
    </div>
  );
}
