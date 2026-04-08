import { HomeContent } from "@/components/sections/HomeContent";
import { BlogSection } from "@/components/sections/BlogSection";

export const revalidate = 60;

export default function Home() {
  return <HomeContent blogSection={<BlogSection />} />;
}
