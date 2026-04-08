-- Run this in your Supabase SQL Editor to create the posts table

create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text not null default '',
  content text not null,
  tags text[] not null default '{}',
  cover_image text,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index for fast slug lookups and published post listings
create index if not exists idx_posts_slug on posts (slug);
create index if not exists idx_posts_published_created on posts (published, created_at desc);

-- Enable Row Level Security
alter table posts enable row level security;

-- Public read access for published posts only
create policy "Public can read published posts"
  on posts for select
  using (published = true);

-- Service role has full access (used by API routes with SUPABASE_SERVICE_ROLE_KEY)
-- No policy needed — service role bypasses RLS
