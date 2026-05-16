"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { NAV_LINKS, SOCIAL_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

function NavLink({
  href,
  label,
  isActive,
}: {
  href: string;
  label: string;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative font-ui text-[13px] transition-colors duration-200",
        isActive ? "text-ink-900" : "text-ink-500 hover:text-ink-900",
      )}
    >
      {label}
      <span
        className={cn(
          "absolute -bottom-1 left-0 h-[1.5px] bg-clay-500 transition-all duration-300",
          isActive ? "w-full" : "w-0",
        )}
      />
    </Link>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isHome) return;
    const observers: IntersectionObserver[] = [];
    NAV_LINKS.forEach(({ href }) => {
      if (!href.startsWith("#")) return;
      const el = document.querySelector(href);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(href);
        },
        { rootMargin: "-40% 0px -55% 0px" },
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [isHome]);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 h-[64px] flex items-center transition-colors duration-200",
          scrolled ? "bg-paper border-b border-ink-200" : "bg-transparent",
        )}
      >
        <div className="w-full max-w-[1200px] mx-auto px-5 md:px-8 flex items-center justify-between">
          <Link
            href="/"
            className="font-display italic font-medium text-[18px] text-ink-900 tracking-[-0.01em]"
          >
            Prakhar Kothari
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ label, href }) => {
              const resolvedHref = href.startsWith("#") && !isHome ? `/${href}` : href;
              const isActive = href.startsWith("#")
                ? activeSection === href
                : pathname.startsWith(href);
              return (
                <NavLink
                  key={href}
                  href={resolvedHref}
                  label={label}
                  isActive={isActive}
                />
              );
            })}
          </div>

          <div className="hidden md:flex items-center">
            <a
              href={SOCIAL_LINKS.resume}
              className="font-ui text-[13px] text-ink-700 hover:text-clay-700 transition-colors"
            >
              Résumé&nbsp;<span className="text-clay-500">&darr;</span>
            </a>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-ink-900 p-2 font-mono text-[12px]"
            aria-label="Toggle menu"
          >
            {mobileOpen ? "Close" : "Menu"}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-paper flex flex-col px-6 pt-24 pb-10"
          >
            <p className="smallcaps text-[12px] text-ink-500 mb-8">Menu</p>
            <nav className="flex flex-col items-start gap-5">
              {NAV_LINKS.map(({ label, href }) => {
                const resolvedHref = href.startsWith("#") && !isHome ? `/${href}` : href;
                return (
                  <Link
                    key={href}
                    href={resolvedHref}
                    onClick={() => setMobileOpen(false)}
                    className="font-display text-[32px] text-ink-900 tracking-[-0.02em]"
                  >
                    {label}
                  </Link>
                );
              })}
              <Link
                href={SOCIAL_LINKS.resume}
                onClick={() => setMobileOpen(false)}
                className="mt-2 font-ui text-[15px] text-ink-700 underline decoration-clay-500 decoration-[1.5px] underline-offset-[5px]"
              >
                Résumé
              </Link>
              <Link
                href="/colophon"
                onClick={() => setMobileOpen(false)}
                className="smallcaps text-[12px] text-ink-500"
              >
                Colophon
              </Link>
            </nav>
            <div className="mt-auto pt-6 border-t border-ink-200">
              <a
                href={`mailto:${SOCIAL_LINKS.email}`}
                onClick={() => setMobileOpen(false)}
                className="font-mono text-[12px] text-ink-700 tracking-[0.02em] underline decoration-clay-500 decoration-[1.5px] underline-offset-[4px]"
              >
                {SOCIAL_LINKS.email}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
