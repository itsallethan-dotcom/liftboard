-- Forgeonix OS — command center core layer (Phase 1)
-- Adds the four foundation tables the dashboard shell plugs into:
--   module_status   — registry + live status for every OS card (drives the grid)
--   notifications   — notification center feed
--   command_logs    — real terminal feed (replaces hardcoded boot/terminal text)
--   command_tasks   — quick-actions task list
-- Reads happen via service-role API routes (owner-gated). RLS denies public access.
-- Apply in the Supabase SQL editor or via `supabase db push`.

create extension if not exists pgcrypto;

-- Reuse the shared updated_at trigger from the OS memory migration; (re)define for safety.
create or replace function public.set_os_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Enums
do $$ begin
  if not exists (select 1 from pg_type where typname = 'module_state') then
    create type public.module_state as enum ('online','standby','dev','offline');
  end if;
  if not exists (select 1 from pg_type where typname = 'notification_level') then
    create type public.notification_level as enum ('info','success','warn','critical');
  end if;
  if not exists (select 1 from pg_type where typname = 'log_level') then
    create type public.log_level as enum ('system','info','success','warn','error');
  end if;
  if not exists (select 1 from pg_type where typname = 'command_task_state') then
    create type public.command_task_state as enum ('open','in_progress','done','cancelled');
  end if;
end $$;

-- Module registry — one row per OS card. The card grid renders from this table.
create table if not exists public.module_status (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  label text not null,
  subtitle text,
  slot text,
  status public.module_state not null default 'standby',
  enabled boolean not null default true,
  href text,
  display_order integer not null default 0,
  load_pct numeric(5,2),
  last_synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Notification center feed.
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text,
  level public.notification_level not null default 'info',
  module_key text,
  href text,
  read boolean not null default false,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists notifications_unread_idx
  on public.notifications (read, created_at desc);

-- Real terminal feed.
create table if not exists public.command_logs (
  id uuid primary key default gen_random_uuid(),
  level public.log_level not null default 'info',
  message text not null,
  module_key text,
  created_at timestamptz not null default now()
);

create index if not exists command_logs_created_idx
  on public.command_logs (created_at desc);

-- Quick-actions task list.
create table if not exists public.command_tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  status public.command_task_state not null default 'open',
  module_key text,
  priority integer not null default 0,
  due_date date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists command_tasks_status_idx
  on public.command_tasks (status, priority desc);

-- updated_at triggers
drop trigger if exists module_status_set_updated_at on public.module_status;
create trigger module_status_set_updated_at before update on public.module_status
  for each row execute function public.set_os_updated_at();

drop trigger if exists command_tasks_set_updated_at on public.command_tasks;
create trigger command_tasks_set_updated_at before update on public.command_tasks
  for each row execute function public.set_os_updated_at();

-- RLS: no public policies — service-role API only (consistent with OS memory layer).
alter table public.module_status enable row level security;
alter table public.notifications enable row level security;
alter table public.command_logs enable row level security;
alter table public.command_tasks enable row level security;

-- Seed the 9-card OS structure (idempotent: only seeds an empty table).
insert into public.module_status (key, label, subtitle, slot, status, enabled, href, display_order)
select v.key, v.label, v.subtitle, v.slot, v.status::public.module_state, v.enabled, v.href, v.display_order
from (values
  ('infrastructure', 'Infrastructure',      'Homelab · Proxmox · Docker',     'ring-1', 'online',  true,  null, 0),
  ('business',       'Forgeonix Business',  'Brand · CRM · Leads · Services',  'ring-2', 'online',  true,  null, 1),
  ('liftboard',      'Liftboard',           'Fitness · Leaderboards · Teams',  'ring-3', 'online',  true,  null, 2),
  ('career',         'Career',              'Applications · Skills · Certs',    'ring-4', 'dev',     true,  null, 3),
  ('projects',       'Projects',            'Builds · Status · Stack',         'ring-5', 'online',  true,  null, 4),
  ('ai-memory',      'AI Memory',           'Notes · Docs · Second Brain',     'ring-6', 'standby', true,  null, 5),
  ('automations',    'Automations',         'n8n · Workflows (Phase 9)',       'ring-7', 'dev',     true,  null, 6),
  ('finance',        'Finance',             'Revenue · Offers · Cashflow',     'ring-8', 'standby', true,  null, 7),
  ('health',         'Health & Fitness',    'Weight · Calories · Bloodwork',   'ring-9', 'dev',     true,  null, 8)
) as v(key, label, subtitle, slot, status, enabled, href, display_order)
where not exists (select 1 from public.module_status limit 1);

-- Seed a couple of starter notifications + logs so the UI isn't empty on first boot.
insert into public.notifications (title, body, level, module_key)
select v.title, v.body, v.level::public.notification_level, v.module_key
from (values
  ('Command center secured', 'Owner-only access gate is now active across /command and OS APIs.', 'success', null),
  ('Phase 1 foundation online', 'module_status, notifications, command_logs, command_tasks created.', 'info', null)
) as v(title, body, level, module_key)
where not exists (select 1 from public.notifications limit 1);

insert into public.command_logs (level, message, module_key)
select v.level::public.log_level, v.message, v.module_key
from (values
  ('system',  'FORGEONIX OS command-core migration applied', null),
  ('success', 'Module registry seeded · 9 modules', null),
  ('info',    'Awaiting operator input', null)
) as v(level, message, module_key)
where not exists (select 1 from public.command_logs limit 1);
