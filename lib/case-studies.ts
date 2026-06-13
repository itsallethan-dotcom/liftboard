export type CaseStudyBadge = "Live" | "In Progress" | "Completed" | "Ongoing";

export type CaseStudy = {
  slug: string;
  title: string;
  statusLabel: string;
  badge: CaseStudyBadge;
  category: string;
  summary: string;
  technologies: readonly string[];
  overview: string;
  challenge: string;
  solution: string;
  lessonsLearned: readonly string[];
  results: readonly string[];
  futureImprovements: readonly string[];
  externalUrl?: string;
  themeClassName?: string;
  relatedLinks?: readonly { label: string; href: string }[];
};

export const CASE_STUDIES: readonly CaseStudy[] = [
  {
    slug: "blackgate-studios",
    title: "Blackgate Studios",
    statusLabel: "Live",
    badge: "Live",
    category: "Website Development",
    summary:
      "Designed and deployed a production website for a tattoo and media studio using modern web technologies, secure administration, and cloud-hosted infrastructure.",
    technologies: ["Next.js", "Vercel", "Cloudflare", "Cloudinary", "GitHub", "Supabase"],
    overview:
      "Blackgate Studios needed a production web presence that could showcase tattoo work, media content, and studio branding while giving staff a secure way to manage uploads and site content. The project required fast global delivery, reliable hosting, and an admin workflow that non-developers could operate confidently.",
    challenge:
      "The studio required a visually strong public site with a media-heavy gallery, responsive layouts across devices, and protected admin paths for content management. Image handling, performance, and deployment reliability were critical — downtime or slow loads directly impact client perception and booking interest.",
    solution:
      "Built a Next.js application deployed on Vercel with Cloudflare in front for DNS and edge performance. Cloudinary handles optimized image delivery and transformations. Supabase provides authentication and data persistence for admin operations. GitHub drives version control and repeatable deployments with environment parity between preview and production.",
    lessonsLearned: [
      "Media-heavy sites benefit most when image pipelines are designed before UI polish.",
      "Separating public routes from admin routes early reduces security rework later.",
      "Cloudflare + Vercel pairing simplifies TLS, caching, and deployment velocity for client sites.",
      "Documenting admin workflows for the client is as important as shipping features.",
    ],
    results: [
      "Production website live with branded gallery and studio presence.",
      "Secure admin portal for media and content management.",
      "Cloud-hosted infrastructure with CDN-backed asset delivery.",
      "Repeatable deployment workflow via GitHub and Vercel.",
    ],
    futureImprovements: [
      "Expand analytics and conversion tracking for booking flows.",
      "Add structured content modules for events and artist portfolios.",
      "Introduce automated image optimization presets per gallery type.",
    ],
    externalUrl: "https://www.blackgatestudios.art",
  },
  {
    slug: "liftboard",
    title: "LiftBoard",
    statusLabel: "Active Development",
    badge: "In Progress",
    category: "Web Application",
    summary:
      "Built a fitness leaderboard platform featuring authentication, workout tracking, team support, and public rankings.",
    technologies: ["Next.js", "Supabase", "TypeScript", "GitHub", "Vercel"],
    overview:
      "LiftBoard is a full-stack fitness leaderboard platform designed for gyms, teams, and training groups. It combines authenticated workout logging, ranking logic, team structures, and public-facing leaderboard views — bridging operational fitness tracking with competitive engagement.",
    challenge:
      "The application needed secure user authentication, profile management, team membership, workout data integrity, and real-time-feeling leaderboard updates without over-engineering infrastructure. Row-level security, deployment consistency, and a clear data model were essential before scaling features.",
    solution:
      "Implemented a Next.js App Router frontend with Supabase for auth, Postgres, and RLS policies. TypeScript enforces data contracts across hooks and server boundaries. Workout volume and ranking calculations run against structured schemas with user-scoped access controls. GitHub and Vercel provide CI-style deployment with environment separation.",
    lessonsLearned: [
      "RLS policies must be validated against real signup and profile-creation flows, not just admin tests.",
      "Leaderboard UX improves when ranking rules are transparent and consistently applied.",
      "Environment parity between local, preview, and production prevents auth and DNS surprises.",
      "Shipping a narrow MVP — auth, workouts, rankings — beats feature breadth without reliability.",
    ],
    results: [
      "Live deployment with authentication and user profiles.",
      "Workout logging with individual, team, and gym leaderboard views.",
      "Production database with policy-driven access control.",
      "Public demo path for showcasing the platform to stakeholders.",
    ],
    futureImprovements: [
      "Mobile-optimized logging flows and gym admin dashboards.",
      "Challenge seasons with time-boxed team competitions.",
      "Notification hooks for PR milestones and team movement.",
    ],
    externalUrl: "https://liftboard.forgeonix.dev",
    relatedLinks: [{ label: "Open LiftBoard", href: "https://liftboard.forgeonix.dev" }],
  },
  {
    slug: "homelab",
    title: "Homelab Infrastructure",
    statusLabel: "Ongoing",
    badge: "Ongoing",
    category: "Infrastructure",
    summary:
      "Designed and maintained a self-hosted infrastructure environment for learning, testing, automation, monitoring, and service hosting.",
    technologies: ["Proxmox", "Docker", "Tailscale", "Uptime Kuma", "Home Assistant", "n8n"],
    overview:
      "A Proxmox-backed homelab provides a controlled environment to deploy services, test networking changes, practice monitoring workflows, and run automation without risking production systems. The lab mirrors real operational patterns: virtualization, container stacks, remote access, and observability.",
    challenge:
      "Running multiple services reliably on consumer-grade hardware requires deliberate network segmentation, resource planning, and recovery discipline. Services must remain accessible for learning while failures remain isolated and diagnosable through logs and monitoring — not guesswork.",
    solution:
      "Proxmox hosts VMs and LXC workloads with Docker Compose stacks for application services. Tailscale enables secure remote admin paths. Uptime Kuma provides synthetic availability checks; Home Assistant and n8n extend automation across devices and APIs. DNS, reverse proxy, and backup patterns are documented as services evolve.",
    lessonsLearned: [
      "Snapshots and change logs matter more than raw uptime when learning infrastructure.",
      "Monitoring without alert tuning creates noise; start with high-signal checks.",
      "Container networking issues often trace back to bridge and dependency order — verify layers.",
      "Remote access should be hardened before exposing admin interfaces beyond the LAN.",
    ],
    results: [
      "Stable multi-service homelab with Proxmox and Docker workloads.",
      "Monitoring and uptime checks across internal tools.",
      "Automation workflows connecting APIs, devices, and scheduled jobs.",
      "Documented architecture for repeatable deployment and troubleshooting.",
    ],
    futureImprovements: [
      "Expand backup automation and restore testing cadence.",
      "Harden Tailscale ACLs and segment admin vs. service traffic.",
      "Add centralized logging and dashboard consolidation.",
    ],
    themeClassName: "forgeonix-theme-ops",
    relatedLinks: [
      { label: "View Infrastructure Lab", href: "/infrastructure" },
    ],
  },
  {
    slug: "troubleshooting",
    title: "Enterprise Troubleshooting",
    statusLabel: "Production Experience",
    badge: "Completed",
    category: "Operations",
    summary:
      "Real-world examples of diagnosing and resolving technical issues across enterprise environments, infrastructure, applications, and user support.",
    technologies: ["Microsoft 365", "Entra ID", "Windows", "Networking", "PowerShell"],
    overview:
      "Enterprise IT support demands structured diagnosis across identity systems, endpoints, SaaS platforms, and network paths. This case study captures recurring patterns from production support: reproduce the issue, gather evidence, isolate variables, fix root cause, and verify outcomes — not symptoms.",
    challenge:
      "User-impacting issues rarely present with a single obvious cause. Account provisioning failures, Docker connectivity problems, email authentication gaps, and host validation mismatches each span multiple layers — identity, DNS, application config, and vendor constraints — requiring methodical triage under time pressure.",
    solution:
      "Applied a consistent workflow: reproduce, inspect logs and timestamps, narrow scope, identify root cause, implement targeted fixes, and validate with a second signal. Examples include RLS policy corrections for Supabase signups, Docker daemon/network remediation in container hosts, SPF/DKIM/DMARC alignment after provider changes, and reverse-proxy host validation fixes for local services.",
    lessonsLearned: [
      "Symptom fixes without root-cause analysis create repeat tickets.",
      "Identity and DNS changes need verification windows before policy enforcement.",
      "Log-first debugging beats configuration guessing in complex stacks.",
      "Documentation after resolution turns one-off fixes into repeatable playbooks.",
    ],
    results: [
      "Restored service access for container and application workloads.",
      "Resolved profile creation and authentication policy blockers.",
      "Improved email deliverability through authentication record alignment.",
      "Stabilized local and domain-routed service access after networking fixes.",
    ],
    futureImprovements: [
      "Formalize runbooks for top recurring incident categories.",
      "Expand proactive monitoring to catch DNS and auth drift early.",
      "Build automation for validation checks after identity or mail changes.",
    ],
    themeClassName: "forgeonix-theme-diagnostics",
    relatedLinks: [
      { label: "View Troubleshooting Cases", href: "/troubleshooting" },
    ],
  },
] as const;

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((study) => study.slug === slug);
}

export function getCaseStudySlugs(): string[] {
  return CASE_STUDIES.map((study) => study.slug);
}
