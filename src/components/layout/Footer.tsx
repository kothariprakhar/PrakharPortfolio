"use client";

import { Mail } from "lucide-react";
import { LinkedInIcon, GitHubIcon } from "@/components/ui/SocialIcons";
import { SOCIAL_LINKS } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-border-subtle bg-bg-secondary/50 backdrop-blur-sm">
      <div className="max-w-[1200px] mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-text-muted text-sm">
          &copy; {new Date().getFullYear()} Prakhar Kothari. Built with Next.js
        </p>
        <div className="flex items-center gap-6">
          <a
            href={SOCIAL_LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted hover:text-[#0A66C2] transition-colors duration-200"
            aria-label="LinkedIn"
          >
            <LinkedInIcon size={20} />
          </a>
          <a
            href={SOCIAL_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted hover:text-text-primary transition-colors duration-200"
            aria-label="GitHub"
          >
            <GitHubIcon size={20} />
          </a>
          <a
            href={`mailto:${SOCIAL_LINKS.email}`}
            className="text-text-muted hover:text-accent-blue transition-colors duration-200"
            aria-label="Email"
          >
            <Mail size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}
