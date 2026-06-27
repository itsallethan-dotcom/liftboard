-- Forgeonix OS — AI Memory layer (Phase 2)
-- Structured "second brain": durable knowledge about the operator, projects,
-- business, infrastructure, career, and plans.
--   memory_categories     — hierarchy + module linkage
--   memory_items          — the memories (type/source/importance/confidence/tags)
--   memory_relationships  — item <-> item links (free-text relation_type)
-- Reads/writes via owner-gated, service-role API routes. RLS denies public access.
-- Apply in the Supabase SQL editor or via `supabase db push`.
--
-- DEFERRED (not built yet, noted for later phases):
--   * pgvector `embedding` column on memory_items for semantic search
--   * agent write access / AI summary generation

create extension if not exists pgcrypto;

-- Reuse the shared updated_at trigger from earlier OS migrations.
create or replace function public.set_os_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Enums
do $$ begin
  if not exists (select 1 from pg_type where typname = 'memory_type') then
    create type public.memory_type as enum ('fact','preference','goal','event','contact','reference','idea');
  end if;
  if not exists (select 1 from pg_type where typname = 'memory_status') then
    create type public.memory_status as enum ('active','archived');
  end if;
end $$;

-- Categories (hierarchy via parent_id; module_key links to module_status.key)
create table if not exists public.memory_categories (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  label text not null,
  parent_id uuid references public.memory_categories (id) on delete set null,
  module_key text,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Memory items
create table if not exists public.memory_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text,
  category_id uuid references public.memory_categories (id) on delete set null,
  module_key text,
  source text not null default 'manual',
  type public.memory_type not null default 'fact',
  importance smallint not null default 3 check (importance between 1 and 5),
  confidence smallint not null default 3 check (confidence between 1 and 5),
  tags text[] not null default '{}',
  pinned boolean not null default false,
  status public.memory_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Relationships (item <-> item; relation_type is free-text)
create table if not exists public.memory_relationships (
  id uuid primary key default gen_random_uuid(),
  from_item_id uuid not null references public.memory_items (id) on delete cascade,
  to_item_id uuid not null references public.memory_items (id) on delete cascade,
  relation_type text not null default 'related',
  created_at timestamptz not null default now(),
  unique (from_item_id, to_item_id, relation_type)
);

-- Indexes
create index if not exists memory_items_category_idx on public.memory_items (category_id);
create index if not exists memory_items_module_idx on public.memory_items (module_key);
create index if not exists memory_items_status_idx on public.memory_items (status);
create index if not exists memory_items_tags_idx on public.memory_items using gin (tags);
create index if not exists memory_items_fts_idx on public.memory_items
  using gin (to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content, '')));
create index if not exists memory_categories_parent_idx on public.memory_categories (parent_id);
create index if not exists memory_relationships_from_idx on public.memory_relationships (from_item_id);
create index if not exists memory_relationships_to_idx on public.memory_relationships (to_item_id);

-- Triggers
drop trigger if exists memory_categories_set_updated_at on public.memory_categories;
create trigger memory_categories_set_updated_at before update on public.memory_categories
  for each row execute function public.set_os_updated_at();

drop trigger if exists memory_items_set_updated_at on public.memory_items;
create trigger memory_items_set_updated_at before update on public.memory_items
  for each row execute function public.set_os_updated_at();

-- RLS: no public policies — service-role API only.
alter table public.memory_categories enable row level security;
alter table public.memory_items enable row level security;
alter table public.memory_relationships enable row level security;

-- Seed: parent categories (idempotent per-row via unique key)
insert into public.memory_categories (key, label, module_key, display_order) values
  ('infrastructure', 'Infrastructure', 'infrastructure', 0),
  ('business',       'Business',       'business',       1),
  ('career',         'Career',         'career',         2),
  ('fitness',        'Fitness',        'health',         3),
  ('personal',       'Personal',       null,             4)
on conflict (key) do nothing;

-- Seed: child categories (parent resolved by key)
insert into public.memory_categories (key, label, parent_id, module_key, display_order)
select v.key, v.label,
       (select id from public.memory_categories where key = v.parent_key),
       v.module_key, v.display_order
from (values
  ('homelab',        'Homelab',        'infrastructure', 'infrastructure', 0),
  ('proxmox',        'Proxmox',        'infrastructure', 'infrastructure', 1),
  ('docker',         'Docker',         'infrastructure', 'infrastructure', 2),
  ('networking',     'Networking',     'infrastructure', 'infrastructure', 3),
  ('forgeonix',      'Forgeonix',      'business',       'business',       0),
  ('clients',        'Clients',        'business',       'business',       1),
  ('leads',          'Leads',          'business',       'business',       2),
  ('certifications', 'Certifications', 'career',         'career',         0),
  ('job-search',     'Job Search',     'career',         'career',         1),
  ('skills',         'Skills',         'career',         'career',         2),
  ('weight',         'Weight',         'fitness',        'health',         0),
  ('calories',       'Calories',       'fitness',        'health',         1),
  ('training',       'Training',       'fitness',        'health',         2),
  ('bloodwork',      'Bloodwork',      'fitness',        'health',         3),
  ('goals',          'Goals',          'personal',       null,             0),
  ('philosophy',     'Philosophy',     'personal',       null,             1),
  ('family',         'Family',         'personal',       null,             2)
) as v(key, label, parent_key, module_key, display_order)
on conflict (key) do nothing;

-- Seed: starter memories (only when the table is empty)
insert into public.memory_items (title, content, category_id, module_key, source, type, importance, confidence)
select v.title, v.content,
       (select id from public.memory_categories where key = v.category_key),
       v.module_key, 'manual', v.type::public.memory_type, v.importance, v.confidence
from (values
  ('Forgeonix OS is the personal command center',
   'Forgeonix OS is the modular personal operating system / command center that every module plugs into.',
   'forgeonix', 'business', 'reference', 5, 5),
  ('Liftboard is a Forgeonix product',
   'Liftboard is a full-stack workout leaderboard, treated as a Forgeonix product (not a separate project).',
   'forgeonix', 'liftboard', 'fact', 4, 5),
  ('Blackgate Studios is a completed client project',
   'Blackgate Studios is a delivered client website with media gallery and admin portal.',
   'clients', 'business', 'fact', 3, 5),
  ('Solea Nails is a planned/internal project',
   'Solea Nails is a planned/internal nail design visualizer concept.',
   'clients', 'business', 'fact', 2, 4),
  ('Homelab stack',
   'Homelab runs Proxmox, a Docker VM, Home Assistant, n8n, AdGuard, Homepage, and Uptime Kuma.',
   'homelab', 'infrastructure', 'reference', 4, 5),
  ('Career goal: Systems Administrator',
   'Career goal is Systems Administrator, progressing toward a future higher-level tech role.',
   'job-search', 'career', 'goal', 5, 5),
  ('n8n intentionally delayed',
   'n8n is important but intentionally delayed until the dashboard foundation and AI memory are stable.',
   'homelab', 'automations', 'idea', 3, 5)
) as v(title, content, category_key, module_key, type, importance, confidence)
where not exists (select 1 from public.memory_items limit 1);
