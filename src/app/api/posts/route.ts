import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function authorize(req: NextRequest): boolean {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  return token === process.env.ADMIN_SECRET;
}

export async function POST(req: NextRequest) {
  if (!authorize(req)) return unauthorized();

  const body = await req.json();
  const { title, slug, excerpt, content, tags, cover_image, published } = body;

  if (!title || !slug || !content) {
    return NextResponse.json(
      { error: "title, slug, and content are required" },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("posts")
    .insert({
      title,
      slug,
      excerpt: excerpt ?? "",
      content,
      tags: tags ?? [],
      cover_image: cover_image ?? null,
      published: published ?? false,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
