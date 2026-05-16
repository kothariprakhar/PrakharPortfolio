import { cn } from "@/lib/utils";

interface BaseProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
}

const containerCls = "max-w-[1200px] mx-auto px-5 md:px-8";

/** Compact rhythm: small intros, contact, footer-adjacent sections. */
export function SectionTight({ id, children, className }: BaseProps) {
  return (
    <section id={id} className={cn("scroll-mt-20 py-16 md:py-20", className)}>
      <div className={containerCls}>{children}</div>
    </section>
  );
}

/** Default rhythm: most sections. */
export function SectionDefault({ id, children, className }: BaseProps) {
  return (
    <section id={id} className={cn("scroll-mt-20 py-24 md:py-32", className)}>
      <div className={containerCls}>{children}</div>
    </section>
  );
}

/** Wide rhythm: editorial breath for Projects. */
export function SectionWide({ id, children, className }: BaseProps) {
  return (
    <section id={id} className={cn("scroll-mt-20 py-32 md:py-48", className)}>
      <div className={containerCls}>{children}</div>
    </section>
  );
}

/**
 * Legacy default export — kept temporarily so any straggler imports compile.
 * Prefer SectionTight / SectionDefault / SectionWide.
 */
export function SectionWrapper({ id, children, className }: BaseProps) {
  return (
    <SectionDefault id={id} className={className}>
      {children}
    </SectionDefault>
  );
}
