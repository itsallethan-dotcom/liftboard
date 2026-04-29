-- Gyms + profile gym membership (apply in Supabase SQL editor or `supabase db push`)

create extension if not exists pgcrypto;

create table if not exists public.gyms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_by uuid not null references public.profiles (id) on delete restrict,
  created_at timestamptz not null default now(),
  constraint gyms_name_len check (char_length(trim(name)) between 2 and 80)
);

create index if not exists gyms_created_by_idx on public.gyms (created_by);

alter table public.profiles
  add column if not exists gym_id uuid references public.gyms (id) on delete set null;

create index if not exists profiles_gym_id_idx on public.profiles (gym_id);

-- RLS
alter table public.gyms enable row level security;

drop policy if exists "gyms_select_authenticated" on public.gyms;
create policy "gyms_select_authenticated"
  on public.gyms for select
  to authenticated
  using (true);

drop policy if exists "gyms_insert_own_creator" on public.gyms;
create policy "gyms_insert_own_creator"
  on public.gyms for insert
  to authenticated
  with check (auth.uid() = created_by);
