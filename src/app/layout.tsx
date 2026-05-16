import type { Metadata } from "next";
import { Fraunces, Inter, Newsreader, JetBrains_Mono } from "next/font/google";
import { MotionProvider } from "@/components/ui/MotionProvider";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  axes: ["opsz", "SOFT"],
});

const inter = Inter({
  variable: "--font-ui",
  subsets: ["latin"],
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-prose",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  axes: ["opsz"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${newsreader.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body className="min-h-screen bg-paper text-ink-700 overflow-x-hidden">
        <MotionProvider>{children}</MotionProvider>
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
                "https://www.linkedin.com/in/prakhar--kothari/",
                "https://github.com/kothariprakhar",
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}
