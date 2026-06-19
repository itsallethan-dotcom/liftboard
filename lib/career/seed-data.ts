/**
 * Seed data extracted from app/resume/page.tsx and components/SkillsSection.tsx.
 * Used by the SQL migration and for reference — do not invent skills beyond site content.
 */

export const CAREER_PROFILE_SEED = {
  summary:
    "Systems-focused IT professional specializing in troubleshooting, infrastructure, and production-ready deployments. Experienced in end-user support, account provisioning, hardware/software diagnostics, Windows environments, DNS/email authentication, Docker-based services, and full-stack application deployment.",
  resume_url: "/resume.pdf",
  current_role: "Systems-focused IT Professional",
  target_role: "Systems Administrator",
} as const;

type SeedSkill = {
  name: string;
  category: string;
  is_featured: boolean;
  display_order: number;
};

/** Maps resume categories to dashboard skill categories. */
const RESUME_SKILLS: { category: string; items: readonly string[]; featuredCount: number }[] = [
  {
    category: "Systems Administration",
    items: [
      "Executive Support",
      "End User Support",
      "Incident Management",
      "Endpoint Administration",
      "Hardware Troubleshooting",
      "Software Troubleshooting",
      "Active Directory",
      "Windows Server",
      "DNS",
      "DHCP",
      "Virtualization",
      "Proxmox",
      "VMware",
      "Network Troubleshooting",
      "Docker",
      "Portainer",
      "Linux",
      "TCP/IP",
      "VPN",
      "Tailscale",
    ],
    featuredCount: 6,
  },
  {
    category: "Cloud / Identity",
    items: [
      "Microsoft 365",
      "Entra ID",
      "Intune",
      "Group Policy",
      "Exchange Online",
      "User Lifecycle Management",
      "Azure",
      "AWS",
      "AWS EC2",
      "Cloudflare",
      "Vercel",
      "SaaS Administration",
    ],
    featuredCount: 5,
  },
  {
    category: "Web Development",
    items: ["Next.js", "React", "TypeScript", "Tailwind", "Git", "GitHub"],
    featuredCount: 4,
  },
  {
    category: "Automation",
    items: [
      "PowerShell",
      "n8n",
      "Monitoring Solutions",
      "Process Automation",
      "Scripts",
      "Workflows",
    ],
    featuredCount: 3,
  },
  {
    category: "Databases",
    items: ["Supabase"],
    featuredCount: 1,
  },
  {
    category: "Tools / Platforms",
    items: [
      "NinjaOne",
      "Jira",
      "ArcGIS",
      "Acumatica",
      "Rackspace",
      "Adobe Creative Cloud",
      "Samsara",
      "Bitdefender",
      "SAP Concur",
      "Snipe-IT",
      "FedEx Ship Manager",
      "AI & LLM Platform",
      "Uptime Kuma",
      "Netdata",
      "Kaseya VSA",
    ],
    featuredCount: 5,
  },
];

function dedupeSkills(): SeedSkill[] {
  const seen = new Set<string>();
  const result: SeedSkill[] = [];
  let globalOrder = 0;

  for (const group of RESUME_SKILLS) {
    let categoryOrder = 0;
    const uniqueItems = [...new Set(group.items)];

    for (const name of uniqueItems) {
      const key = name.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);

      result.push({
        name,
        category: group.category,
        is_featured: categoryOrder < group.featuredCount,
        display_order: globalOrder++,
      });
      categoryOrder++;
    }
  }

  return result;
}

export const CAREER_SKILLS_SEED = dedupeSkills();

export const CAREER_MILESTONES_SEED = [
  {
    title: "Delivered white-glove technical support for end users",
    description: "Enterprise IT support across hardware, software, and third-party applications.",
    project: "Enterprise IT",
    category: "Experience",
    milestone_date: null,
  },
  {
    title: "Built and deployed a full-stack workout leaderboard app",
    description: "Live app with auth, data, and deployment on Vercel with Supabase.",
    project: "Workout Leaderboard",
    category: "Client Projects",
    milestone_date: null,
  },
  {
    title: "Configured custom domain email authentication with SPF, DKIM, and DMARC",
    description: "DNS and email security configuration for production domain.",
    project: "Forgeonix",
    category: "Infrastructure",
    milestone_date: null,
  },
  {
    title: "Built a Proxmox/Docker homelab for service deployment and monitoring",
    description: "Self-hosted infrastructure lab for services and observability.",
    project: "Infrastructure Lab",
    category: "Infrastructure",
    milestone_date: null,
  },
  {
    title: "Forgeonix Landing Site",
    description: "Brand site and portfolio hub with executive resume and case studies.",
    project: "Forgeonix",
    category: "Client Projects",
    milestone_date: null,
  },
  {
    title: "Troubleshooting Case Studies",
    description: "Documented real issues, root causes, and resolutions.",
    project: "Forgeonix",
    category: "Client Projects",
    milestone_date: null,
  },
] as const;
