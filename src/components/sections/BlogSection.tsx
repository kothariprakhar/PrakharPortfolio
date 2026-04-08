import { getLatestPosts } from "@/lib/blog";
import { BlogSectionClient } from "./BlogSectionClient";

export async function BlogSection() {
  const posts = await getLatestPosts(3);
  return <BlogSectionClient posts={posts} />;
}
