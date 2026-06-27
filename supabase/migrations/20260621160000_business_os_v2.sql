-- Forgeonix OS — Business OS v2 (Phase 4, Chunk 1: schema only)
-- Turns Forgeonix Business into an operational CRM + revenue tracker.
-- This chunk builds: contacts, communication history, invoices, and the
-- lead -> client conversion fields. Testimonials & deliverables are DEFERRED
-- (schema documented at the bottom so they can be added later without refactor).
-- Reuses existing tables (leads, business_clients, business_tasks,
-- business_follow_ups, business_offers, business_revenue, os_projects).
-- RLS service-role only. Apply in the Supabase SQL editor or via `supabase db push`.

create extension if not exists pgcrypto;

create or replace function public.set_os_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Enums (built this chunk)
do $$ begin
  if not exists (select 1 from pg_type where typname = 'client_stage') then
    create type public.client_stage as enum ('active','project_work','revenue','review','archived');
  end if;
  if not exists (select 1 from pg_type where typname = 'priority_level') then
    create type public.priority_level as enum ('low','medium','high');
  end if;
  if not exists (select 1 from pg_type where typname = 'communication_channel') then
    create type public.communication_channel as enum ('email','call','meeting','message','note','other');
  end if;
  if not exists (select 1 from pg_type where typname = 'communication_direction') then
    create type public.communication_direction as enum ('inbound','outbound');
  end if;
  if not exists (select 1 from pg_type where typname = 'invoice_status') then
    create type public.invoice_status as enum ('draft','sent','paid','overdue','void');
  end if;
end $$;

-- New tables (create invoices/contacts before the FKs that reference them)
create table if not exists public.business_invoices (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.business_clients (id) on delete set null,
  project_id uuid references public.os_projects (id) on delete set null,
  invoice_number text,
  amount numeric(12,2),
  currency text not null default 'USD',
  status public.invoice_status not null default 'draft',
  issued_date date,
  due_date date,
  paid_date date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.business_contacts (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.business_clients (id) on delete set null,
  lead_id uuid references public.leads (id) on delete set null,
  name text not null,
  role text,
  email text,
  phone text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.business_communications (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.business_clients (id) on delete set null,
  lead_id uuid references public.leads (id) on delete set null,
  contact_id uuid references public.business_contacts (id) on delete set null,
  channel public.communication_channel not null default 'note',
  direction public.communication_direction,
  subject text,
  summary text,
  occurred_at timestamptz,
  owner text,
  created_at timestamptz not null default now()
);

-- Upgrade existing tables (additive)
alter table public.leads
  add column if not exists owner text,
  add column if not exists converted_client_id uuid references public.business_clients (id) on delete set null,
  add column if not exists last_contacted_at timestamptz,
  add column if not exists estimated_value numeric(12,2);

alter table public.business_clients
  add column if not exists stage public.client_stage not null default 'active',
  add column if not exists lead_id uuid references public.leads (id) on delete set null,
  add column if not exists won_at timestamptz;

alter table public.business_tasks
  add column if not exists lead_id uuid references public.leads (id) on delete set null,
  add column if not exists owner text,
  add column if not exists priority_level public.priority_level not null default 'medium';

alter table public.business_follow_ups
  add column if not exists owner text,
  add column if not exists channel public.communication_channel;

alter table public.business_offers
  add column if not exists lead_id uuid references public.leads (id) on delete set null,
  add column if not exists project_id uuid references public.os_projects (id) on delete set null,
  add column if not exists sent_at timestamptz,
  add column if not exists accepted_at timestamptz;

alter table public.business_revenue
  add column if not exists invoice_id uuid references public.business_invoices (id) on delete set null;

alter table public.os_projects
  add column if not exists value numeric(12,2),
  add column if not exists start_date date,
  add column if not exists completed_at timestamptz;

-- Indexes
create index if not exists business_contacts_client_idx on public.business_contacts (client_id);
create index if not exists business_contacts_lead_idx on public.business_contacts (lead_id);
create index if not exists business_comms_client_idx on public.business_communications (client_id);
create index if not exists business_comms_lead_idx on public.business_communications (lead_id);
create index if not exists business_comms_occurred_idx on public.business_communications (occurred_at desc);
create index if not exists business_invoices_client_idx on public.business_invoices (client_id);
create index if not exists business_invoices_status_idx on public.business_invoices (status);
create index if not exists business_clients_stage_idx on public.business_clients (stage);
create index if not exists leads_converted_idx on public.leads (converted_client_id);

-- Triggers (updated_at) for tables that track it
drop trigger if exists business_contacts_set_updated_at on public.business_contacts;
create trigger business_contacts_set_updated_at before update on public.business_contacts
  for each row execute function public.set_os_updated_at();
drop trigger if exists business_invoices_set_updated_at on public.business_invoices;
create trigger business_invoices_set_updated_at before update on public.business_invoices
  for each row execute function public.set_os_updated_at();

-- RLS: service-role only
alter table public.business_contacts enable row level security;
alter table public.business_communications enable row level security;
alter table public.business_invoices enable row level security;

-- Backfill client stage from existing status (archived stays archived; else active).
update public.business_clients set stage = 'archived' where status = 'archived' and stage = 'active';

-- ---------------------------------------------------------------------------
-- DEFERRED (Phase 4, later pass) — documented so they can be added without
-- refactoring. Do NOT create yet.
--
-- create type public.testimonial_status as enum ('requested','received','published');
-- create type public.deliverable_status  as enum ('planned','in_progress','delivered','accepted');
--
-- create table public.business_testimonials (
--   id uuid primary key default gen_random_uuid(),
--   client_id uuid references public.business_clients (id) on delete set null,
--   project_id uuid references public.os_projects (id) on delete set null,
--   author text, role text, quote text,
--   rating smallint check (rating between 1 and 5),
--   status public.testimonial_status not null default 'requested',
--   received_at timestamptz, is_public boolean not null default false,
--   created_at timestamptz not null default now(),
--   updated_at timestamptz not null default now()
-- );
--
-- create table public.business_deliverables (
--   id uuid primary key default gen_random_uuid(),
--   project_id uuid references public.os_projects (id) on delete set null,
--   client_id uuid references public.business_clients (id) on delete set null,
--   title text not null, description text,
--   status public.deliverable_status not null default 'planned',
--   due_date date, delivered_at timestamptz, notes text,
--   created_at timestamptz not null default now(),
--   updated_at timestamptz not null default now()
-- );
-- ---------------------------------------------------------------------------
