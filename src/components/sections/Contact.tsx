"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, ArrowUpRight } from "lucide-react";
import { LinkedInIcon, GitHubIcon } from "@/components/ui/SocialIcons";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SOCIAL_LINKS } from "@/lib/constants";

const contacts = [
  {
    icon: Mail,
    label: "Email",
    value: SOCIAL_LINKS.email,
    href: `mailto:${SOCIAL_LINKS.email}`,
    hoverColor: "hover:text-accent-blue",
    isLucide: true,
  },
  {
    icon: LinkedInIcon,
    label: "LinkedIn",
    value: "Prakhar Kothari",
    href: SOCIAL_LINKS.linkedin,
    hoverColor: "hover:text-[#0A66C2]",
    isLucide: false,
  },
  {
    icon: GitHubIcon,
    label: "GitHub",
    value: "prakharkothari",
    href: SOCIAL_LINKS.github,
    hoverColor: "hover:text-text-primary",
    isLucide: false,
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Evanston, IL",
    href: null,
    hoverColor: "",
    isLucide: true,
  },
];

export function Contact() {
  return (
    <SectionWrapper id="contact" className="pb-16 md:pb-24">
      <SectionHeading
        label="Connect"
        title="Let's Build Together"
        gradientWord="Together"
        subtitle="Whether you're looking for a PM who speaks AI, or want to chat about building great products — I'd love to hear from you."
      />

      <div className="grid md:grid-cols-2 gap-12">
        {/* Contact info */}
        <div className="space-y-6">
          {contacts.map((contact, i) => {
            const Icon = contact.icon;
            const isLink = !!contact.href;
            const Tag = isLink ? "a" : "div";
            const linkProps = isLink
              ? {
                  href: contact.href!,
                  ...(contact.href!.startsWith("http")
                    ? { target: "_blank" as const, rel: "noopener noreferrer" }
                    : {}),
                }
              : {};

            return (
              <motion.div
                key={contact.label}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Tag
                  {...linkProps}
                  className={`flex items-center gap-4 group ${contact.hoverColor} text-text-secondary transition-colors duration-200`}
                >
                  <div className="w-12 h-12 rounded-xl bg-bg-tertiary/50 border border-border-subtle flex items-center justify-center group-hover:border-accent-blue/30 transition-colors">
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className="text-text-muted text-xs font-mono tracking-wider uppercase">
                      {contact.label}
                    </p>
                    <p className="text-sm font-medium mt-0.5 flex items-center gap-1">
                      {contact.value}
                      {isLink && (
                        <ArrowUpRight
                          size={12}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      )}
                    </p>
                  </div>
                </Tag>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-start justify-center"
        >
          <p className="text-text-secondary text-lg leading-relaxed mb-8">
            I&apos;m always open to discussing new opportunities, interesting projects, or just
            exchanging ideas about the future of AI and product.
          </p>
          <a
            href={`mailto:${SOCIAL_LINKS.email}`}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-accent-blue to-accent-purple text-white font-medium hover:shadow-[0_0_40px_rgba(0,212,255,0.3)] transition-shadow duration-300"
          >
            <Mail size={18} />
            Send me an email
          </a>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
