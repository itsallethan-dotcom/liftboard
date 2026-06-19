-- Forgeonix OS memory layer (apply in Supabase SQL editor or `supabase db push`)
-- Dashboard reads via API routes (service role). Future agents write to these tables.

create extension if not exists pgcrypto;

-- Shared updated_at trigger
create or replace function public.set_os_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Enums
do $$ begin
  if not exists (select 1 from pg_type where typname = 'lead_status') then
    create type public.lead_status as enum ('new','contacted','qualified','proposal','won','lost','archived');
  end if;
  if not exists (select 1 from pg_type where typname = 'client_status') then
    create type public.client_status as enum ('active','prospect','inactive','archived');
  end if;
  if not exists (select 1 from pg_type where typname = 'task_status') then
    create type public.task_status as enum ('open','in_progress','done','cancelled');
  end if;
  if not exists (select 1 from pg_type where typname = 'follow_up_status') then
    create type public.follow_up_status as enum ('pending','done','skipped');
  end if;
  if not exists (select 1 from pg_type where typname = 'offer_status') then
    create type public.offer_status as enum ('draft','sent','accepted','declined','expired');
  end if;
  if not exists (select 1 from pg_type where typname = 'revenue_status') then
    create type public.revenue_status as enum ('pending','received','cancelled');
  end if;
  if not exists (select 1 from pg_type where typname = 'asset_status') then
    create type public.asset_status as enum ('online','offline','standby','planned','decommissioned');
  end if;
  if not exists (select 1 from pg_type where typname = 'service_status') then
    create type public.service_status as enum ('online','offline','standby','degraded');
  end if;
  if not exists (select 1 from pg_type where typname = 'incident_severity') then
    create type public.incident_severity as enum ('low','medium','high','critical');
  end if;
  if not exists (select 1 from pg_type where typname = 'incident_status') then
    create type public.incident_status as enum ('open','investigating','resolved','closed');
  end if;
  if not exists (select 1 from pg_type where typname = 'upgrade_status') then
    create type public.upgrade_status as enum ('planned','scheduled','in_progress','done','cancelled');
  end if;
  if not exists (select 1 from pg_type where typname = 'project_status') then
    create type public.project_status as enum ('live','in_development','active','completed','archived');
  end if;
  if not exists (select 1 from pg_type where typname = 'note_type') then
    create type public.note_type as enum ('note','documentation');
  end if;
  if not exists (select 1 from pg_type where typname = 'record_type') then
    create type public.record_type as enum ('milestone','win','build','incident','other');
  end if;
end $$;

-- Leads
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  email text,
  phone text,
  source text,
  status public.lead_status not null default 'new',
  notes text,
  follow_up_date date,
  priority integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Business
create table if not exists public.business_clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  email text,
  status public.client_status not null default 'prospect',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.business_tasks (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.business_clients (id) on delete set null,
  title text not null,
  status public.task_status not null default 'open',
  priority integer not null default 0,
  due_date date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.business_follow_ups (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.business_clients (id) on delete set null,
  lead_id uuid references public.leads (id) on delete set null,
  title text not null,
  due_date date,
  status public.follow_up_status not null default 'pending',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.business_offers (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.business_clients (id) on delete set null,
  title text not null,
  amount numeric(12,2),
  currency text not null default 'USD',
  status public.offer_status not null default 'draft',
  valid_until date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.business_revenue (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.business_clients (id) on delete set null,
  label text not null,
  amount numeric(12,2) not null default 0,
  currency text not null default 'USD',
  status public.revenue_status not null default 'pending',
  recorded_date date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Infrastructure
create table if not exists public.infrastructure_assets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  asset_type text,
  host text,
  status public.asset_status not null default 'online',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.infrastructure_services (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid references public.infrastructure_assets (id) on delete set null,
  name text not null,
  url text,
  status public.service_status not null default 'online',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.infrastructure_incidents (
  id uuid primary key default gen_random_uuid(),
  service_id uuid references public.infrastructure_services (id) on delete set null,
  title text not null,
  severity public.incident_severity not null default 'low',
  status public.incident_status not null default 'open',
  opened_at timestamptz,
  resolved_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.infrastructure_planned_upgrades (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  target_asset_id uuid references public.infrastructure_assets (id) on delete set null,
  priority integer not null default 0,
  status public.upgrade_status not null default 'planned',
  planned_date date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Projects, Notes, Records
create table if not exists public.os_projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text,
  description text,
  status public.project_status not null default 'in_development',
  stack text,
  url text,
  client_id uuid references public.business_clients (id) on delete set null,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.os_notes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text,
  note_type public.note_type not null default 'note',
  tags text,
  project_id uuid references public.os_projects (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.os_records (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  record_type public.record_type not null default 'milestone',
  project text,
  category text,
  record_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Triggers
drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at before update on public.leads for each row execute function public.set_os_updated_at();
drop trigger if exists business_clients_set_updated_at on public.business_clients;
create trigger business_clients_set_updated_at before update on public.business_clients for each row execute function public.set_os_updated_at();
drop trigger if exists business_tasks_set_updated_at on public.business_tasks;
create trigger business_tasks_set_updated_at before update on public.business_tasks for each row execute function public.set_os_updated_at();
drop trigger if exists business_follow_ups_set_updated_at on public.business_follow_ups;
create trigger business_follow_ups_set_updated_at before update on public.business_follow_ups for each row execute function public.set_os_updated_at();
drop trigger if exists business_offers_set_updated_at on public.business_offers;
create trigger business_offers_set_updated_at before update on public.business_offers for each row execute function public.set_os_updated_at();
drop trigger if exists business_revenue_set_updated_at on public.business_revenue;
create trigger business_revenue_set_updated_at before update on public.business_revenue for each row execute function public.set_os_updated_at();
drop trigger if exists infrastructure_assets_set_updated_at on public.infrastructure_assets;
create trigger infrastructure_assets_set_updated_at before update on public.infrastructure_assets for each row execute function public.set_os_updated_at();
drop trigger if exists infrastructure_services_set_updated_at on public.infrastructure_services;
create trigger infrastructure_services_set_updated_at before update on public.infrastructure_services for each row execute function public.set_os_updated_at();
drop trigger if exists infrastructure_incidents_set_updated_at on public.infrastructure_incidents;
create trigger infrastructure_incidents_set_updated_at before update on public.infrastructure_incidents for each row execute function public.set_os_updated_at();
drop trigger if exists infrastructure_planned_upgrades_set_updated_at on public.infrastructure_planned_upgrades;
create trigger infrastructure_planned_upgrades_set_updated_at before update on public.infrastructure_planned_upgrades for each row execute function public.set_os_updated_at();
drop trigger if exists os_projects_set_updated_at on public.os_projects;
create trigger os_projects_set_updated_at before update on public.os_projects for each row execute function public.set_os_updated_at();
drop trigger if exists os_notes_set_updated_at on public.os_notes;
create trigger os_notes_set_updated_at before update on public.os_notes for each row execute function public.set_os_updated_at();
drop trigger if exists os_records_set_updated_at on public.os_records;
create trigger os_records_set_updated_at before update on public.os_records for each row execute function public.set_os_updated_at();

-- RLS: no public policies — service role API only
alter table public.leads enable row level security;
alter table public.business_clients enable row level security;
alter table public.business_tasks enable row level security;
alter table public.business_follow_ups enable row level security;
alter table public.business_offers enable row level security;
alter table public.business_revenue enable row level security;
alter table public.infrastructure_assets enable row level security;
alter table public.infrastructure_services enable row level security;
alter table public.infrastructure_incidents enable row level security;
alter table public.infrastructure_planned_upgrades enable row level security;
alter table public.os_projects enable row level security;
alter table public.os_notes enable row level security;
alter table public.os_records enable row level security;

-- Seed: infrastructure (from HomelabTopology + command mock)
insert into public.infrastructure_assets (name, asset_type, host, status, notes)
select v.name, v.asset_type, v.host, v.status::public.asset_status, v.notes
from (values
  ('Proxmox Host', 'hypervisor', 'homelab', 'online', 'Type-1 hypervisor for VMs and LXC'),
  ('Docker VM', 'vm', 'proxmox', 'online', 'Isolated Docker workloads')
) as v(name, asset_type, host, status, notes)
where not exists (select 1 from public.infrastructure_assets limit 1);

insert into public.infrastructure_services (name, status, notes)
select v.name, v.status::public.service_status, v.notes
from (values
  ('Proxmox', 'online', 'Virtualization layer'),
  ('Docker VM', 'online', 'Container runtime host'),
  ('Uptime Kuma', 'online', 'Uptime monitoring'),
  ('n8n', 'standby', 'Workflow automation'),
  ('Home Assistant', 'online', 'Home automation hub'),
  ('Portainer', 'standby', 'Container management UI'),
  ('Homepage', 'online', 'Internal service dashboard'),
  ('Tailscale', 'online', 'Secure remote access mesh')
) as v(name, status, notes)
where not exists (select 1 from public.infrastructure_services limit 1);

insert into public.infrastructure_planned_upgrades (title, priority, status, notes)
select v.title, v.priority, v.status::public.upgrade_status, v.notes
from (values
  ('Remote access hardening via Tailscale mesh', 1, 'planned', 'From infrastructure page next direction'),
  ('n8n workflow integration with Forgeonix OS', 2, 'planned', 'Connect agents to automation layer')
) as v(title, priority, status, notes)
where not exists (select 1 from public.infrastructure_planned_upgrades limit 1);

-- Seed: business clients (from site projects)
insert into public.business_clients (name, company, status, notes)
select v.name, v.company, v.status::public.client_status, v.notes
from (values
  ('Blackgate Studios', 'Blackgate Studios', 'active', 'Production client website with admin portal'),
  ('Solea Nails', 'Solea Nails', 'prospect', 'Nail design visualizer concept')
) as v(name, company, status, notes)
where not exists (select 1 from public.business_clients limit 1);

insert into public.business_tasks (title, status, priority, notes)
select v.title, v.status::public.task_status, v.priority, v.notes
from (values
  ('Build lead workflow', 'open', 1, 'Connect Lead Generation module to live pipeline'),
  ('Track revenue entries manually', 'open', 2, 'Add first revenue records via dashboard')
) as v(title, status, priority, notes)
where not exists (select 1 from public.business_tasks limit 1);

-- Seed: projects (from ProjectsSection)
insert into public.os_projects (name, slug, description, status, stack, url, display_order)
select v.name, v.slug, v.description, v.status::public.project_status, v.stack, v.url, v.display_order
from (values
  ('Forgeonix', 'forgeonix', 'Personal tech brand and portfolio platform.', 'live', 'Next.js, Tailwind, Supabase, Vercel', 'https://www.forgeonix.dev', 0),
  ('Liftboard', 'liftboard', 'Full-stack workout leaderboard with auth and teams.', 'in_development', 'Next.js, Supabase', 'https://liftboard.forgeonix.dev', 1),
  ('Blackgate Studios', 'blackgate', 'Production client website with media gallery and admin portal.', 'live', 'Next.js, Cloudinary, Supabase', 'https://www.blackgatestudios.art', 2),
  ('Home Infrastructure Lab', 'homelab', 'Proxmox + Docker homelab with monitoring and automation.', 'active', 'Proxmox, Docker, Tailscale, Uptime Kuma', '/infrastructure', 3),
  ('Solea Nails', 'solea', 'Nail design visualizer app concept.', 'in_development', 'Next.js, Concept', null, 4)
) as v(name, slug, description, status, stack, url, display_order)
where not exists (select 1 from public.os_projects limit 1);

-- Seed: notes (architecture doc)
insert into public.os_notes (title, body, note_type, tags)
select v.title, v.body, v.note_type::public.note_type, v.tags
from (values
  (
    'Forgeonix OS Memory Architecture',
    'Dashboard reads from Supabase. Future Jarvis agents write to domain tables: leads, business_*, infrastructure_*, os_projects, os_notes, os_records, career_*.',
    'documentation',
    'architecture,forgeonix-os'
  )
) as v(title, body, note_type, tags)
where not exists (select 1 from public.os_notes limit 1);

-- Seed: records (from resume projects + case studies)
insert into public.os_records (title, description, record_type, project, category)
select v.title, v.description, v.record_type::public.record_type, v.project, v.category
from (values
  ('Blackgate Supabase ownership restored', 'Client project database and admin access restored.', 'win', 'Blackgate Studios', 'Client Projects'),
  ('Liftboard full-stack deployment', 'Auth, profiles, teams, and gym leaderboards shipped.', 'build', 'Liftboard', 'Client Projects'),
  ('Homelab monitoring online', 'Uptime Kuma and service dashboards operational.', 'milestone', 'Infrastructure Lab', 'Infrastructure'),
  ('Forgeonix Command Center boot', 'Database-backed module hub under /command.', 'milestone', 'Forgeonix', 'Platform')
) as v(title, description, record_type, project, category)
where not exists (select 1 from public.os_records limit 1);
