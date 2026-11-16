create extension if not exists pgcrypto;

create table if not exists public.app_store (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null,
  updated_at timestamptz default now()
);

create index if not exists app_store_key_idx on public.app_store (key);

alter table public.app_store enable row level security;

create policy if not exists "Anyone can read app_store" on public.app_store
  for select using (true);

create policy if not exists "Anyone can write app_store" on public.app_store
  for insert with check (true);

create policy if not exists "Anyone can update app_store" on public.app_store
  for update using (true) with check (true);
