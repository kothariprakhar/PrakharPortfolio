import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono, Cormorant_Garamond } from "next/font/google";
import { MotionProvider } from "@/components/ui/MotionProvider";
import { ThemeProvider } from "@/context/ThemeContext";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "700"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["500", "700"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://prakharkothari.com"),
  title: "Prakhar Kothari | AI Product Manager",
  description:
    "Product Manager and AI engineer building at the intersection of technology and business. Kellogg MBA + AI candidate at Northwestern University.",
  openGraph: {
    title: "Prakhar Kothari | AI Product Manager",
    description:
      "Product Manager and AI engineer building at the intersection of technology and business.",
    type: "website",
  },
};

// Inline script to set theme class before paint — prevents flash
const themeScript = `(function(){var t=localStorage.getItem('pk-theme');if(!t||t==='system'){t=matchMedia('(prefers-color-scheme:light)').matches?'light':'dark'}document.documentElement.classList.add(t)})()`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${cormorantGaramond.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body className="min-h-screen bg-bg-primary text-text-primary font-body">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <ThemeProvider>
          <MotionProvider>
            {children}
          </MotionProvider>
        </ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Prakhar Kothari",
              jobTitle: "AI Product Manager",
              alumniOf: [
                {
                  "@type": "EducationalOrganization",
                  name: "Kellogg School of Management, Northwestern University",
                },
                {
                  "@type": "EducationalOrganization",
                  name: "Indian Institute of Technology Patna",
                },
              ],
              knowsAbout: [
                "Product Management",
                "Artificial Intelligence",
                "Machine Learning",
                "NLP",
                "Computer Vision",
              ],
              sameAs: [
                "https://www.linkedin.com/in/prakhar-kothari-sde/",
                "https://github.com/kothariprakhar",
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}
