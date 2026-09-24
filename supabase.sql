-- Run this whole file in Supabase SQL Editor.
-- Do NOT put your service_role/secret key in the website.

create extension if not exists pgcrypto;

create table if not exists public.love_stories (
  id text primary key,
  your_name text not null check (char_length(your_name) between 1 and 40),
  love_name text not null check (char_length(love_name) between 1 and 40),
  start_date date not null,
  main_message text not null,
  reason1 text not null,
  reason2 text not null,
  reason3 text not null,
  final_message text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.love_photos (
  id bigint generated always as identity primary key,
  story_id text not null references public.love_stories(id) on delete cascade,
  storage_path text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.love_stories enable row level security;
alter table public.love_photos enable row level security;

drop policy if exists "public can create love stories" on public.love_stories;
create policy "public can create love stories"
on public.love_stories for insert to anon
with check (true);

drop policy if exists "public can read love stories" on public.love_stories;
create policy "public can read love stories"
on public.love_stories for select to anon
using (true);

drop policy if exists "public can create photo rows" on public.love_photos;
create policy "public can create photo rows"
on public.love_photos for insert to anon
with check (true);

drop policy if exists "public can read photo rows" on public.love_photos;
create policy "public can read photo rows"
on public.love_photos for select to anon
using (true);

-- Storage bucket:
-- Create a bucket named "memories" in Storage and set it to PUBLIC.
-- Then run these policies.

drop policy if exists "anon can upload memories" on storage.objects;
create policy "anon can upload memories"
on storage.objects for insert to anon
with check (bucket_id = 'memories');

drop policy if exists "anon can read memories" on storage.objects;
create policy "anon can read memories"
on storage.objects for select to anon
using (bucket_id = 'memories');
