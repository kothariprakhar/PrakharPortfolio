"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  published: boolean;
  created_at: string;
}

export default function AdminPage() {
  const [secret, setSecret] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [editing, setEditing] = useState<Post | null>(null);
  const [creating, setCreating] = useState(false);

  const headers = useCallback(
    () => ({
      "Content-Type": "application/json",
      Authorization: `Bearer ${secret}`,
    }),
    [secret]
  );

  const fetchPosts = useCallback(async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/posts?select=*&order=created_at.desc`,
      {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
        },
      }
    );
    if (res.ok) setPosts(await res.json());
  }, []);

  useEffect(() => {
    if (authenticated) fetchPosts();
  }, [authenticated, fetchPosts]);

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="w-full max-w-sm p-8 bg-bg-secondary border border-border-subtle rounded-2xl">
          <h1 className="font-display font-bold text-xl text-text-primary mb-6">
            Admin Access
          </h1>
          <input
            type="password"
            placeholder="Admin secret"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && setAuthenticated(true)}
            className="w-full px-4 py-3 bg-bg-primary border border-border-subtle rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-blue"
          />
          <button
            onClick={() => setAuthenticated(true)}
            className="w-full mt-4 px-4 py-3 bg-accent-blue text-bg-primary font-medium rounded-lg hover:opacity-90 transition"
          >
            Enter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-[1000px] mx-auto px-6 pt-12 pb-20">
        <div className="flex items-center justify-between mb-10">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-accent-blue transition-colors mb-4"
            >
              <ArrowLeft size={16} />
              Back to site
            </Link>
            <h1 className="font-display font-bold text-3xl text-text-primary">
              Blog Admin
            </h1>
          </div>
          <button
            onClick={() => {
              setCreating(true);
              setEditing(null);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-accent-blue text-bg-primary font-medium rounded-lg hover:opacity-90 transition text-sm"
          >
            <Plus size={16} />
            New Post
          </button>
        </div>

        {(creating || editing) && (
          <PostEditor
            post={editing}
            headers={headers}
            onDone={() => {
              setCreating(false);
              setEditing(null);
              fetchPosts();
            }}
            onCancel={() => {
              setCreating(false);
              setEditing(null);
            }}
          />
        )}

        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between p-4 bg-bg-secondary border border-border-subtle rounded-xl"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <h3 className="font-display font-bold text-text-primary truncate">
                    {post.title}
                  </h3>
                  {post.published ? (
                    <Eye size={14} className="shrink-0 text-green-400" />
                  ) : (
                    <EyeOff size={14} className="shrink-0 text-text-muted" />
                  )}
                </div>
                <p className="text-sm text-text-muted mt-1">
                  /{post.slug} &middot;{" "}
                  {new Date(post.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => {
                    setEditing(post);
                    setCreating(false);
                  }}
                  className="p-2 text-text-muted hover:text-accent-blue transition"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={async () => {
                    if (!confirm("Delete this post?")) return;
                    await fetch(`/api/posts/${post.slug}`, {
                      method: "DELETE",
                      headers: headers(),
                    });
                    fetchPosts();
                  }}
                  className="p-2 text-text-muted hover:text-red-400 transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PostEditor({
  post,
  headers,
  onDone,
  onCancel,
}: {
  post: Post | null;
  headers: () => Record<string, string>;
  onDone: () => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [tags, setTags] = useState(post?.tags.join(", ") ?? "");
  const [published, setPublished] = useState(post?.published ?? false);
  const [saving, setSaving] = useState(false);

  function autoSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  async function handleSave() {
    setSaving(true);
    const body = {
      title,
      slug,
      excerpt,
      content,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      published,
    };

    if (post) {
      await fetch(`/api/posts/${post.slug}`, {
        method: "PUT",
        headers: headers(),
        body: JSON.stringify(body),
      });
    } else {
      await fetch("/api/posts", {
        method: "POST",
        headers: headers(),
        body: JSON.stringify(body),
      });
    }
    setSaving(false);
    onDone();
  }

  return (
    <div className="mb-8 p-6 bg-bg-secondary border border-border-subtle rounded-2xl">
      <h2 className="font-display font-bold text-lg text-text-primary mb-4">
        {post ? "Edit Post" : "New Post"}
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-mono text-text-muted mb-1">
            Title
          </label>
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!post) setSlug(autoSlug(e.target.value));
            }}
            className="w-full px-4 py-2.5 bg-bg-primary border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-accent-blue"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-text-muted mb-1">
            Slug
          </label>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full px-4 py-2.5 bg-bg-primary border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-accent-blue font-mono text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-text-muted mb-1">
            Excerpt
          </label>
          <input
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full px-4 py-2.5 bg-bg-primary border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-accent-blue"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-text-muted mb-1">
            Tags (comma-separated)
          </label>
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full px-4 py-2.5 bg-bg-primary border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-accent-blue"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-text-muted mb-1">
            Content (Markdown)
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={16}
            className="w-full px-4 py-3 bg-bg-primary border border-border-subtle rounded-lg text-text-primary font-mono text-sm leading-relaxed focus:outline-none focus:border-accent-blue resize-y"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setPublished(!published)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition ${
              published
                ? "border-green-500/30 text-green-400 bg-green-500/10"
                : "border-border-subtle text-text-muted"
            }`}
          >
            {published ? "Published" : "Draft"}
          </button>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleSave}
            disabled={saving || !title || !slug || !content}
            className="px-6 py-2.5 bg-accent-blue text-bg-primary font-medium rounded-lg hover:opacity-90 transition disabled:opacity-50 text-sm"
          >
            {saving ? "Saving..." : post ? "Update" : "Create"}
          </button>
          <button
            onClick={onCancel}
            className="px-6 py-2.5 border border-border-subtle text-text-muted rounded-lg hover:text-text-primary transition text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
