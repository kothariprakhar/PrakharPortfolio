import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function authorize(req: NextRequest): boolean {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  return token === process.env.ADMIN_SECRET;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!authorize(req)) return unauthorized();

  const { slug } = await params;
  const body = await req.json();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("posts")
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq("slug", slug)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!authorize(req)) return unauthorized();

  const { slug } = await params;
  const supabase = createAdminClient();

  const { error } = await supabase.from("posts").delete().eq("slug", slug);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ deleted: true });
}
