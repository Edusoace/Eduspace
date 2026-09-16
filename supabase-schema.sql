create table if not exists public.resources (
  id text primary key,
  type text not null check (type in ('video', 'article', 'podcast')),
  subject text not null check (subject in ('math', 'history', 'georgian', 'english')),
  title jsonb not null,
  description jsonb not null,
  full_content text,
  link text,
  lang text not null default 'ge',
  created_at timestamptz not null default now()
);

alter table public.resources enable row level security;

drop policy if exists "Public resources are readable" on public.resources;
create policy "Public resources are readable"
  on public.resources for select
  to anon, authenticated
  using (true);

drop policy if exists "Admin client can create resources" on public.resources;
create policy "Admin client can create resources"
  on public.resources for insert
  to anon, authenticated
  with check (true);

grant select, insert on public.resources to anon, authenticated;
