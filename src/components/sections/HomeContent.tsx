"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { useTheme } from "@/context/ThemeContext";

const BackgroundCanvas = dynamic(
  () => import("@/components/background/BackgroundCanvas"),
  { ssr: false }
);

export function HomeContent({ blogSection }: { blogSection: React.ReactNode }) {
  const [loaded, setLoaded] = useState(
    typeof window !== "undefined" && sessionStorage.getItem("pk-loaded") === "1"
  );
  const { resolvedTheme } = useTheme();

  const handleLoadComplete = useCallback(() => setLoaded(true), []);

  return (
    <>
      {!loaded && <LoadingScreen onComplete={handleLoadComplete} />}
      <CustomCursor />
      {resolvedTheme === "dark" && <BackgroundCanvas />}
      <ScrollProgress />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        {blogSection}
        <Contact />
      </main>
      <Footer />
    </>
  );
}
