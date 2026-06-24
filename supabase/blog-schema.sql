create extension if not exists "uuid-ossp";

create table if not exists public.blog_categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.blog_posts (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid references public.blog_categories(id) on delete restrict,
  slug text not null unique,
  title text not null,
  excerpt text not null,
  intro text not null,
  sections jsonb not null default '[]'::jsonb,
  tags text[] not null default '{}'::text[],
  cover_image_url text not null,
  content_text text not null default '',
  read_time text not null default '5 min read',
  featured boolean not null default false,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists blog_posts_updated_at on public.blog_posts;
create trigger blog_posts_updated_at
before update on public.blog_posts
for each row execute procedure public.update_updated_at();

create index if not exists blog_posts_slug_idx on public.blog_posts (slug);
create index if not exists blog_posts_category_id_idx on public.blog_posts (category_id);
create index if not exists blog_posts_published_at_idx
  on public.blog_posts (published_at desc)
  where published = true;

alter table public.blog_categories enable row level security;
alter table public.blog_posts enable row level security;

grant usage on schema public to anon, authenticated;
grant select on table public.blog_categories to anon, authenticated;
grant select on table public.blog_posts to anon, authenticated;
grant insert, update, delete on table public.blog_categories to authenticated;
grant insert, update, delete on table public.blog_posts to authenticated;

drop policy if exists "categories public read" on public.blog_categories;
create policy "categories public read"
  on public.blog_categories for select
  using (true);

drop policy if exists "categories admin full access" on public.blog_categories;
create policy "categories admin full access"
  on public.blog_categories for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "posts public read published" on public.blog_posts;
create policy "posts public read published"
  on public.blog_posts for select
  using (published = true);

drop policy if exists "posts admin full access" on public.blog_posts;
create policy "posts admin full access"
  on public.blog_posts for all
  to authenticated
  using (true)
  with check (true);

-- Storage bucket for blog post cover images.
insert into storage.buckets (id, name, public)
values ('blog-covers', 'blog-covers', true)
on conflict (id) do nothing;

drop policy if exists "Public read blog covers" on storage.objects;
create policy "Public read blog covers"
  on storage.objects for select
  using (bucket_id = 'blog-covers');

drop policy if exists "Authenticated manage blog covers" on storage.objects;
create policy "Authenticated manage blog covers"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'blog-covers')
  with check (bucket_id = 'blog-covers');
