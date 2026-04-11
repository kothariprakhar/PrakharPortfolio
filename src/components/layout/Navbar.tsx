"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useSpacetimeWarp } from "@/components/background/useSpacetimeWarp";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useTheme } from "@/context/ThemeContext";

function NavLink({ href, label, isActive }: { href: string; label: string; isActive: boolean }) {
  const { ref, onMouseEnter, onMouseLeave } = useSpacetimeWarp(`nav-${label}`, {
    strength: 12,
    radius: 120,
  });

  return (
    <Link
      ref={ref as React.Ref<HTMLAnchorElement>}
      href={href}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn(
        "relative text-sm font-body font-medium transition-colors duration-200",
        isActive ? "text-text-primary" : "text-text-secondary hover:text-text-primary"
      )}
    >
      {label}
      <span
        className={cn(
          "absolute -bottom-1 left-0 h-[2px] bg-accent-blue transition-all duration-300",
          isActive ? "w-full" : "w-0"
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
  const { resolvedTheme, toggleTheme } = useTheme();

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
        { rootMargin: "-40% 0px -55% 0px" }
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [isHome]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 h-[72px] flex items-center transition-all duration-300",
          scrolled
            ? "bg-bg-primary/80 backdrop-blur-xl border-b border-border-subtle"
            : "bg-transparent"
        )}
      >
        <div className="w-full max-w-[1200px] mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="font-display font-bold text-xl bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent"
          >
            Prakhar Kothari
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ label, href }) => {
              const resolvedHref = href.startsWith("#") && !isHome ? `/${href}` : href;
              const isActive = href.startsWith("#") ? activeSection === href : pathname.startsWith(href);
              return (
                <NavLink key={href} href={resolvedHref} label={label} isActive={isActive} />
              );
            })}
          </div>

          {/* Theme toggle + CTA */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-bg-tertiary/50 transition-colors text-text-secondary hover:text-text-primary"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={resolvedTheme}
                  initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  {resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                </motion.span>
              </AnimatePresence>
            </button>
            <MagneticButton
              as="a"
              href={isHome ? "#contact" : "/#contact"}
              warpId="nav-cta"
              warpStrength={18}
              warpRadius={150}
              magnetStrength={0.25}
              className="inline-flex items-center px-5 py-2 text-sm font-medium rounded-full border border-accent-blue/30 text-accent-blue hover:bg-accent-blue/10 transition-all duration-300"
            >
              Let&apos;s Talk
            </MagneticButton>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-text-primary p-2"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-bg-primary/95 backdrop-blur-xl flex items-center justify-center"
          >
            <nav className="flex flex-col items-center gap-8">
              {NAV_LINKS.map(({ label, href }, i) => {
                const resolvedHref = href.startsWith("#") && !isHome ? `/${href}` : href;
                return (
                  <motion.div
                    key={href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link
                      href={resolvedHref}
                      onClick={() => setMobileOpen(false)}
                      className="text-2xl font-display font-bold text-text-primary hover:text-accent-blue transition-colors"
                    >
                      {label}
                    </Link>
                  </motion.div>
                );
              })}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: NAV_LINKS.length * 0.1 }}
                className="flex flex-col items-center gap-4"
              >
                <button
                  onClick={toggleTheme}
                  className="w-12 h-12 rounded-full flex items-center justify-center bg-bg-tertiary/50 text-text-secondary hover:text-text-primary transition-colors"
                  aria-label="Toggle theme"
                >
                  {resolvedTheme === "dark" ? <Sun size={22} /> : <Moon size={22} />}
                </button>
                <Link
                  href={isHome ? "#contact" : "/#contact"}
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 px-8 py-3 rounded-full bg-gradient-to-r from-accent-blue to-accent-purple text-white font-medium"
                >
                  Let&apos;s Talk
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
