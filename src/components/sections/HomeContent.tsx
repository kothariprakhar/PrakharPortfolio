import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { Dingbat } from "@/components/ui/Dingbat";

export function HomeContent({ blogSection }: { blogSection: React.ReactNode }) {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <About />
        <Experience />
        <Projects />
        {/* Custom dingbat · the single section break between Work and Writing */}
        <div className="max-w-[1200px] mx-auto px-5 md:px-8">
          <Dingbat />
        </div>
        {blogSection}
        <Contact />
      </main>
      <Footer />
    </>
  );
}
