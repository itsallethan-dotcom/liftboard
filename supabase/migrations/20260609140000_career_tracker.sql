-- Career Tracker memory system (apply in Supabase SQL editor or `supabase db push`)
-- Requires: SUPABASE_SERVICE_ROLE_KEY on the Next.js server for API routes

create extension if not exists pgcrypto;

-- Job application status enum
do $$
begin
  if not exists (select 1 from pg_type where typname = 'job_application_status') then
    create type public.job_application_status as enum (
      'applied',
      'follow_up_due',
      'interview',
      'rejected',
      'offer',
      'archived'
    );
  end if;
end $$;

create table if not exists public.career_profile (
  id uuid primary key default gen_random_uuid(),
  summary text,
  resume_url text,
  "current_role" text,
  target_role text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.career_skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  proficiency text,
  source text,
  display_order integer not null default 0,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint career_skills_name_category_unique unique (name, category)
);

create index if not exists career_skills_category_idx
  on public.career_skills (category, display_order);

create index if not exists career_skills_featured_idx
  on public.career_skills (is_featured, display_order);

create table if not exists public.job_applications (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  role_title text not null,
  source text,
  status public.job_application_status not null default 'applied',
  applied_date date,
  follow_up_date date,
  contact_email text,
  job_url text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists job_applications_status_idx
  on public.job_applications (status, applied_date desc);

create index if not exists job_applications_company_idx
  on public.job_applications (company_name);

create table if not exists public.career_milestones (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  project text,
  milestone_date date,
  category text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists career_milestones_date_idx
  on public.career_milestones (milestone_date desc nulls last);

-- updated_at triggers
create or replace function public.set_career_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists career_profile_set_updated_at on public.career_profile;
create trigger career_profile_set_updated_at
  before update on public.career_profile
  for each row execute function public.set_career_updated_at();

drop trigger if exists career_skills_set_updated_at on public.career_skills;
create trigger career_skills_set_updated_at
  before update on public.career_skills
  for each row execute function public.set_career_updated_at();

drop trigger if exists job_applications_set_updated_at on public.job_applications;
create trigger job_applications_set_updated_at
  before update on public.job_applications
  for each row execute function public.set_career_updated_at();

drop trigger if exists career_milestones_set_updated_at on public.career_milestones;
create trigger career_milestones_set_updated_at
  before update on public.career_milestones
  for each row execute function public.set_career_updated_at();

-- RLS: no public policies — all access via service role API routes
alter table public.career_profile enable row level security;
alter table public.career_skills enable row level security;
alter table public.job_applications enable row level security;
alter table public.career_milestones enable row level security;

-- Seed data from lib/career/seed-data.ts (resume + site content only)
-- Regenerate with: npx tsx scripts/gen-career-seed-sql.ts

insert into public.career_profile (summary, resume_url, "current_role", target_role)
select
  'Systems-focused IT professional specializing in troubleshooting, infrastructure, and production-ready deployments. Experienced in end-user support, account provisioning, hardware/software diagnostics, Windows environments, DNS/email authentication, Docker-based services, and full-stack application deployment.',
  '/resume.pdf',
  'Systems-focused IT Professional',
  'Systems Administrator'
where not exists (select 1 from public.career_profile);

insert into public.career_skills (name, category, proficiency, source, display_order, is_featured)
select v.name, v.category, v.proficiency, v.source, v.display_order, v.is_featured
from (values
  ('Executive Support', 'Systems Administration', 'proficient', 'resume', 0, true),
  ('End User Support', 'Systems Administration', 'proficient', 'resume', 1, true),
  ('Incident Management', 'Systems Administration', 'proficient', 'resume', 2, true),
  ('Endpoint Administration', 'Systems Administration', 'proficient', 'resume', 3, true),
  ('Hardware Troubleshooting', 'Systems Administration', 'proficient', 'resume', 4, true),
  ('Software Troubleshooting', 'Systems Administration', 'proficient', 'resume', 5, true),
  ('Active Directory', 'Systems Administration', 'proficient', 'resume', 6, false),
  ('Windows Server', 'Systems Administration', 'proficient', 'resume', 7, false),
  ('DNS', 'Systems Administration', 'proficient', 'resume', 8, false),
  ('DHCP', 'Systems Administration', 'proficient', 'resume', 9, false),
  ('Virtualization', 'Systems Administration', 'proficient', 'resume', 10, false),
  ('Proxmox', 'Systems Administration', 'proficient', 'resume', 11, false),
  ('VMware', 'Systems Administration', 'proficient', 'resume', 12, false),
  ('Network Troubleshooting', 'Systems Administration', 'proficient', 'resume', 13, false),
  ('Docker', 'Systems Administration', 'proficient', 'resume', 14, false),
  ('Portainer', 'Systems Administration', 'proficient', 'resume', 15, false),
  ('Linux', 'Systems Administration', 'proficient', 'resume', 16, false),
  ('TCP/IP', 'Systems Administration', 'proficient', 'resume', 17, false),
  ('VPN', 'Systems Administration', 'proficient', 'resume', 18, false),
  ('Tailscale', 'Systems Administration', 'proficient', 'resume', 19, false),
  ('Microsoft 365', 'Cloud / Identity', 'proficient', 'resume', 20, true),
  ('Entra ID', 'Cloud / Identity', 'proficient', 'resume', 21, true),
  ('Intune', 'Cloud / Identity', 'proficient', 'resume', 22, true),
  ('Group Policy', 'Cloud / Identity', 'proficient', 'resume', 23, true),
  ('Exchange Online', 'Cloud / Identity', 'proficient', 'resume', 24, true),
  ('User Lifecycle Management', 'Cloud / Identity', 'proficient', 'resume', 25, false),
  ('Azure', 'Cloud / Identity', 'proficient', 'resume', 26, false),
  ('AWS', 'Cloud / Identity', 'proficient', 'resume', 27, false),
  ('AWS EC2', 'Cloud / Identity', 'proficient', 'resume', 28, false),
  ('Cloudflare', 'Cloud / Identity', 'proficient', 'resume', 29, false),
  ('Vercel', 'Cloud / Identity', 'proficient', 'resume', 30, false),
  ('SaaS Administration', 'Cloud / Identity', 'proficient', 'resume', 31, false),
  ('Next.js', 'Web Development', 'proficient', 'resume', 32, true),
  ('React', 'Web Development', 'proficient', 'resume', 33, true),
  ('TypeScript', 'Web Development', 'proficient', 'resume', 34, true),
  ('Tailwind', 'Web Development', 'proficient', 'resume', 35, true),
  ('Git', 'Web Development', 'proficient', 'resume', 36, false),
  ('GitHub', 'Web Development', 'proficient', 'resume', 37, false),
  ('PowerShell', 'Automation', 'proficient', 'resume', 38, true),
  ('n8n', 'Automation', 'proficient', 'resume', 39, true),
  ('Monitoring Solutions', 'Automation', 'proficient', 'resume', 40, true),
  ('Process Automation', 'Automation', 'proficient', 'resume', 41, false),
  ('Scripts', 'Automation', 'proficient', 'resume', 42, false),
  ('Workflows', 'Automation', 'proficient', 'resume', 43, false),
  ('Supabase', 'Databases', 'proficient', 'resume', 44, true),
  ('NinjaOne', 'Tools / Platforms', 'proficient', 'resume', 45, true),
  ('Jira', 'Tools / Platforms', 'proficient', 'resume', 46, true),
  ('ArcGIS', 'Tools / Platforms', 'proficient', 'resume', 47, true),
  ('Acumatica', 'Tools / Platforms', 'proficient', 'resume', 48, true),
  ('Rackspace', 'Tools / Platforms', 'proficient', 'resume', 49, true),
  ('Adobe Creative Cloud', 'Tools / Platforms', 'proficient', 'resume', 50, false),
  ('Samsara', 'Tools / Platforms', 'proficient', 'resume', 51, false),
  ('Bitdefender', 'Tools / Platforms', 'proficient', 'resume', 52, false),
  ('SAP Concur', 'Tools / Platforms', 'proficient', 'resume', 53, false),
  ('Snipe-IT', 'Tools / Platforms', 'proficient', 'resume', 54, false),
  ('FedEx Ship Manager', 'Tools / Platforms', 'proficient', 'resume', 55, false),
  ('AI & LLM Platform', 'Tools / Platforms', 'proficient', 'resume', 56, false),
  ('Uptime Kuma', 'Tools / Platforms', 'proficient', 'resume', 57, false),
  ('Netdata', 'Tools / Platforms', 'proficient', 'resume', 58, false),
  ('Kaseya VSA', 'Tools / Platforms', 'proficient', 'resume', 59, false)
) as v(name, category, proficiency, source, display_order, is_featured)
where not exists (select 1 from public.career_skills limit 1);

insert into public.career_milestones (title, description, project, category)
select v.title, v.description, v.project, v.category
from (values
  ('Delivered white-glove technical support for end users', 'Enterprise IT support across hardware, software, and third-party applications.', 'Enterprise IT', 'Experience'),
  ('Built and deployed a full-stack workout leaderboard app', 'Live app with auth, data, and deployment on Vercel with Supabase.', 'Workout Leaderboard', 'Client Projects'),
  ('Configured custom domain email authentication with SPF, DKIM, and DMARC', 'DNS and email security configuration for production domain.', 'Forgeonix', 'Infrastructure'),
  ('Built a Proxmox/Docker homelab for service deployment and monitoring', 'Self-hosted infrastructure lab for services and observability.', 'Infrastructure Lab', 'Infrastructure'),
  ('Forgeonix Landing Site', 'Brand site and portfolio hub with executive resume and case studies.', 'Forgeonix', 'Client Projects'),
  ('Troubleshooting Case Studies', 'Documented real issues, root causes, and resolutions.', 'Forgeonix', 'Client Projects')
) as v(title, description, project, category)
where not exists (select 1 from public.career_milestones limit 1);
