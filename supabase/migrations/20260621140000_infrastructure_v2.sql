-- Forgeonix OS — Infrastructure Module v2 (Phase 3)
-- Turns Infrastructure into a real homelab source of truth:
--   host -> VM/LXC -> container/service hierarchy, IPs/ports/URLs, VM specs,
--   Docker containers, dependencies, backups, and status-event history.
-- All data is sensitive (internal addressing) → owner-gated API + RLS only.
-- Apply in the Supabase SQL editor or via `supabase db push`.

create extension if not exists pgcrypto;

create or replace function public.set_os_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Enums
do $$ begin
  if not exists (select 1 from pg_type where typname = 'asset_kind') then
    create type public.asset_kind as enum ('host','vm','lxc','network_device','storage','other');
  end if;
  if not exists (select 1 from pg_type where typname = 'container_status') then
    create type public.container_status as enum ('running','stopped','paused','restarting','exited');
  end if;
  if not exists (select 1 from pg_type where typname = 'backup_health') then
    create type public.backup_health as enum ('ok','stale','failing','none');
  end if;
end $$;

-- Extend assets: hierarchy + addressing + VM specs
alter table public.infrastructure_assets
  add column if not exists parent_id uuid references public.infrastructure_assets (id) on delete set null,
  add column if not exists kind public.asset_kind not null default 'other',
  add column if not exists ip_address text,
  add column if not exists mac_address text,
  add column if not exists os text,
  add column if not exists node_role text,
  add column if not exists cpu_cores integer,
  add column if not exists ram_mb integer,
  add column if not exists disk_gb integer;

-- Containers (run on a host/VM asset)
create table if not exists public.infrastructure_containers (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid references public.infrastructure_assets (id) on delete set null,
  name text not null,
  image text,
  status public.container_status not null default 'running',
  ports text,
  volumes text,
  compose_stack text,
  ip_address text,
  restart_policy text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Extend services: addressing + container linkage
alter table public.infrastructure_services
  add column if not exists ip_address text,
  add column if not exists port integer,
  add column if not exists internal_url text,
  add column if not exists container_id uuid references public.infrastructure_containers (id) on delete set null;

-- Generic dependency edges (asset|vm|container|service) -> (...)
create table if not exists public.infrastructure_dependencies (
  id uuid primary key default gen_random_uuid(),
  from_type text not null,
  from_id uuid not null,
  to_type text not null,
  to_id uuid not null,
  dependency_type text not null default 'depends_on',
  notes text,
  created_at timestamptz not null default now(),
  unique (from_type, from_id, to_type, to_id, dependency_type)
);

-- Backups
create table if not exists public.infrastructure_backups (
  id uuid primary key default gen_random_uuid(),
  target_type text,
  target_id uuid,
  name text not null,
  method text,
  schedule text,
  location text,
  retention text,
  last_run_at timestamptz,
  health public.backup_health not null default 'none',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Append-only status history (lightweight; incidents table stays for formal incidents)
create table if not exists public.infrastructure_status_events (
  id uuid primary key default gen_random_uuid(),
  target_type text not null,
  target_id uuid not null,
  status text not null,
  note text,
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists infra_assets_parent_idx on public.infrastructure_assets (parent_id);
create index if not exists infra_assets_kind_idx on public.infrastructure_assets (kind);
create index if not exists infra_containers_asset_idx on public.infrastructure_containers (asset_id);
create index if not exists infra_services_container_idx on public.infrastructure_services (container_id);
create index if not exists infra_deps_from_idx on public.infrastructure_dependencies (from_type, from_id);
create index if not exists infra_deps_to_idx on public.infrastructure_dependencies (to_type, to_id);
create index if not exists infra_status_events_target_idx
  on public.infrastructure_status_events (target_type, target_id, created_at desc);

-- Triggers (updated_at) for new tables
drop trigger if exists infra_containers_set_updated_at on public.infrastructure_containers;
create trigger infra_containers_set_updated_at before update on public.infrastructure_containers
  for each row execute function public.set_os_updated_at();

drop trigger if exists infra_backups_set_updated_at on public.infrastructure_backups;
create trigger infra_backups_set_updated_at before update on public.infrastructure_backups
  for each row execute function public.set_os_updated_at();

-- RLS: service-role only
alter table public.infrastructure_containers enable row level security;
alter table public.infrastructure_dependencies enable row level security;
alter table public.infrastructure_backups enable row level security;
alter table public.infrastructure_status_events enable row level security;

-- Backfill kind for any pre-existing assets that are still 'other'
update public.infrastructure_assets set kind = 'host'
  where kind = 'other' and (asset_type ilike '%hypervisor%' or name ilike '%proxmox%');
update public.infrastructure_assets set kind = 'vm'
  where kind = 'other' and asset_type ilike '%vm%';

-- ---------------------------------------------------------------------------
-- Seed the known homelab topology (only if no host asset exists yet).
-- Proxmox host -> Docker VM -> containers/services. Idempotent guard below.
-- ---------------------------------------------------------------------------
-- Guard on the (new in v2) containers table being empty, so this runs once and
-- correctly upgrades any pre-existing Proxmox Host / Docker VM rows.
do $$
declare
  v_host uuid;
  v_vm uuid;
begin
  if not exists (select 1 from public.infrastructure_containers limit 1) then
    -- Resolve or create the Proxmox host.
    select id into v_host from public.infrastructure_assets
      where kind = 'host' or name ilike '%proxmox%'
      order by created_at limit 1;
    if v_host is null then
      insert into public.infrastructure_assets (name, kind, asset_type, status, node_role, os, notes)
      values ('Proxmox Host', 'host', 'hypervisor', 'online', 'hypervisor', 'Proxmox VE',
              'Type-1 hypervisor for VMs and LXC')
      returning id into v_host;
    else
      update public.infrastructure_assets
        set kind = 'host', node_role = coalesce(node_role, 'hypervisor')
        where id = v_host;
    end if;

    -- Resolve or create the Docker VM, linked to the host.
    select id into v_vm from public.infrastructure_assets
      where name ilike '%docker%' and id <> v_host
      order by created_at limit 1;
    if v_vm is null then
      insert into public.infrastructure_assets (name, kind, parent_id, asset_type, status, os, cpu_cores, ram_mb, disk_gb, notes)
      values ('Docker VM', 'vm', v_host, 'vm', 'online', 'Debian', 4, 8192, 128,
              'Isolated Docker workloads')
      returning id into v_vm;
    else
      update public.infrastructure_assets
        set kind = 'vm', parent_id = v_host,
            cpu_cores = coalesce(cpu_cores, 4),
            ram_mb = coalesce(ram_mb, 8192),
            disk_gb = coalesce(disk_gb, 128)
        where id = v_vm;
    end if;

    insert into public.infrastructure_containers (asset_id, name, image, status, restart_policy, notes)
    values
      (v_vm, 'Home Assistant', 'ghcr.io/home-assistant/home-assistant', 'running', 'unless-stopped', 'Home automation hub'),
      (v_vm, 'n8n', 'n8nio/n8n', 'stopped', 'unless-stopped', 'Workflow automation — intentionally delayed'),
      (v_vm, 'AdGuard Home', 'adguard/adguardhome', 'running', 'unless-stopped', 'Network DNS / ad blocking'),
      (v_vm, 'Homepage', 'ghcr.io/gethomepage/homepage', 'running', 'unless-stopped', 'Internal service dashboard'),
      (v_vm, 'Uptime Kuma', 'louislam/uptime-kuma', 'running', 'unless-stopped', 'Uptime monitoring');

    if not exists (select 1 from public.infrastructure_backups limit 1) then
      insert into public.infrastructure_backups (target_type, target_id, name, method, schedule, health, notes)
      values ('asset', v_vm, 'Docker VM snapshot', 'Proxmox snapshot', 'weekly', 'none',
              'Set up scheduled VM snapshots + offsite copy');
    end if;
  end if;
end $$;
