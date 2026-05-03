import { getLatestPosts } from "@/lib/blog";
import { BlogSectionClient } from "./BlogSectionClient";

export async function BlogSection() {
  const posts = await getLatestPosts(3);
  // Hide the entire section from the home page when there are no published posts —
  // an empty "Posts coming soon" placeholder hurts more than it helps with recruiters.
  if (posts.length === 0) return null;
  return <BlogSectionClient posts={posts} />;
}
