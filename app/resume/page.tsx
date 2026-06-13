import { NavBar } from "@/components/NavBar";
import { SiteButton } from "@/components/SiteButton";
import { SiteLayout } from "@/components/SiteLayout";
import { SitePageHero } from "@/components/SitePageHero";
import { SitePanel } from "@/components/SitePanel";
import { SiteSection } from "@/components/SiteSection";
import { SiteSectionLabel } from "@/components/SiteSectionLabel";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume | Forgeonix",
  description:
    "Systems-focused IT professional — troubleshooting, infrastructure, deployment, and support.",
};

const AREAS_OF_EXPERTISE = [
  {
    title: "Troubleshooting",
    description:
      "Rapid diagnosis and resolution of complex hardware, software, networking, and user-impacting issues across enterprise environments.",
  },
  {
    title: "Infrastructure",
    description:
      "Designing, deploying, and maintaining virtualized systems, cloud resources, networking services, and self-hosted environments.",
  },
  {
    title: "Automation",
    description:
      "Improving efficiency through PowerShell scripting, workflow automation, monitoring solutions, and process optimization.",
  },
  {
    title: "Development",
    description:
      "Building modern web applications, dashboards, and business solutions using contemporary development platforms and tools.",
  },
  {
    title: "Security & Access",
    description:
      "Managing identities, permissions, endpoint security, authentication systems, and access control across enterprise environments.",
  },
  {
    title: "Documentation",
    description:
      "Creating clear technical documentation, operational procedures, user guides, and repeatable support processes.",
  },
] as const;

const CORE_TECHNICAL_SKILLS = [
  {
    category: "Enterprise IT Support",
    items: [
      "Executive Support",
      "End User Support",
      "Incident Management",
      "Endpoint Administration",
      "Hardware Troubleshooting",
      "Software Troubleshooting",
    ],
  },
  {
    category: "Microsoft Ecosystem",
    items: [
      "Microsoft 365",
      "Entra ID",
      "Intune",
      "Group Policy",
      "Exchange Online",
      "User Lifecycle Management",
    ],
  },
  {
    category: "Infrastructure & Systems",
    items: [
      "Active Directory",
      "Windows Server",
      "DNS",
      "DHCP",
      "Virtualization",
      "Proxmox",
      "VMware",
      "Network Troubleshooting",
    ],
  },
  {
    category: "Cloud & Platforms",
    items: ["Azure", "AWS", "Cloudflare", "Vercel", "SaaS Administration"],
  },
  {
    category: "Automation & Scripting",
    items: ["PowerShell", "n8n", "Monitoring Solutions", "Process Automation"],
  },
  {
    category: "Development",
    items: ["Next.js", "React", "TypeScript", "Supabase", "GitHub", "Docker"],
  },
] as const;

const TOOLS = [
  "Microsoft 365",
  "Entra ID",
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
  "AWS",
  "Docker",
  "Proxmox",
  "Cloudflare",
  "GitHub",
  "Supabase",
  "Vercel",
  "PowerShell",
] as const;

const EXPERIENCE = [
  "Delivered white-glove technical support for end users",
  "Created, modified, and dissolved user accounts across multiple platforms",
  "Diagnosed hardware, software, and third-party application issues",
  "Supported Windows environments and endpoint troubleshooting",
  "Built and deployed a full-stack workout leaderboard app",
  "Configured custom domain email authentication with SPF, DKIM, and DMARC",
  "Built a Proxmox/Docker homelab for service deployment and monitoring",
];

const PROJECTS: { title: string; hint: string; href: string }[] = [
  { title: "Forgeonix Landing Site", hint: "Brand site and portfolio hub", href: "/" },
  { title: "Workout Leaderboard App", hint: "Live app · auth · data · deployment", href: "/dashboard" },
  {
    title: "Infrastructure & Systems Lab",
    hint: "Homelab architecture and services",
    href: "/infrastructure",
  },
  {
    title: "Troubleshooting Case Studies",
    hint: "Real issues · root causes · resolutions",
    href: "/troubleshooting",
  },
];

const FOCUS = [
  "Systems administration",
  "Networking and DNS",
  "Docker/self-hosting",
  "Automation and scripting",
  "Monitoring and observability",
  "Power BI / business analysis",
];

export default function ResumePage() {
  return (
    <SiteLayout themeClassName="forgeonix-theme-executive">
      <NavBar activeHref="/resume" />
      <SitePageHero
        eyebrow="Portfolio · Resume"
        title="Resume"
        description="Systems-focused IT professional with hands-on experience in troubleshooting, infrastructure, application deployment, and user support."
        actions={
          <>
            <SiteButton href="/">Back Home</SiteButton>
            <SiteButton href="/infrastructure">View Infrastructure</SiteButton>
            <SiteButton href="/troubleshooting">View Troubleshooting</SiteButton>
            <SiteButton href="/leaderboard" variant="primary">
              Open Leaderboard
            </SiteButton>
            <SiteButton href="/resume.pdf" download="resume.pdf">
              Download Resume (PDF)
            </SiteButton>
          </>
        }
      />

      <SiteSection>
        <SiteSectionLabel>// EXPERTISE</SiteSectionLabel>
        <h2 className="text-3xl font-bold text-white">Areas of Expertise</h2>
        <p className="mt-3 max-w-3xl text-[#a0a0a0]">
          Technical strengths developed through enterprise IT support, infrastructure
          management, automation, and hands-on project work.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {AREAS_OF_EXPERTISE.map(({ title, description }) => (
            <ExpertiseCard key={title} title={title} description={description} />
          ))}
        </div>
      </SiteSection>

      <SiteSection className="bg-[#1e1e1e]/75">
        <SitePanel className="forgeonix-featured-callout p-6 sm:p-8" hover={false}>
          <SiteSectionLabel>// BUILDER</SiteSectionLabel>
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Builder Mindset</h2>
          <p className="mt-4 max-w-4xl text-base leading-relaxed text-[#e0e0e0] sm:text-lg">
            Beyond enterprise IT support, I actively build and maintain websites, cloud-hosted
            applications, automation workflows, and self-hosted infrastructure. This hands-on
            approach allows me to understand technology from both the operational and
            implementation sides, bridging the gap between supporting systems and creating them.
          </p>
        </SitePanel>
      </SiteSection>

      <SiteSection>
        <SiteSectionLabel>// TECHNICAL</SiteSectionLabel>
        <h2 className="text-3xl font-bold text-white">Core Technical Skills</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CORE_TECHNICAL_SKILLS.map(({ category, items }) => (
            <SkillCategory key={category} title={category} items={items} />
          ))}
        </div>
      </SiteSection>

      <SiteSection className="bg-[#1e1e1e]/75">
        <SiteSectionLabel>// TOOLS</SiteSectionLabel>
        <h2 className="text-3xl font-bold text-white">Tools I Work With</h2>
        <div className="mt-8 flex flex-wrap gap-2 sm:gap-3">
          {TOOLS.map((tool) => (
            <SitePanel
              key={tool}
              className="px-3 py-2 text-xs font-medium text-[#e0e0e0] sm:text-sm"
              hover={false}
            >
              {tool}
            </SitePanel>
          ))}
        </div>
      </SiteSection>

      <SiteSection>
        <SiteSectionLabel>// SUMMARY</SiteSectionLabel>
        <h2 className="text-3xl font-bold text-white">Professional summary</h2>
        <SitePanel className="mt-6 p-6 sm:p-8" hover={false}>
          <p className="text-base leading-relaxed text-[#e0e0e0] sm:text-lg">
            Systems-focused IT professional specializing in troubleshooting, infrastructure,
            and production-ready deployments. Experienced in end-user support, account
            provisioning, hardware/software diagnostics, Windows environments, DNS/email
            authentication, Docker-based services, and full-stack application deployment.
          </p>
        </SitePanel>
      </SiteSection>

      <SiteSection className="bg-[#1e1e1e]/75">
        <SiteSectionLabel>// EXPERIENCE</SiteSectionLabel>
        <h2 className="text-3xl font-bold text-white">Experience highlights</h2>
        <p className="mt-3 max-w-3xl text-[#a0a0a0]">
          Concrete contributions — practical scope, honest framing.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {EXPERIENCE.map((line) => (
            <SitePanel key={line} className="flex gap-3 px-4 py-4 text-sm text-[#e0e0e0]">
              <span className="forgeonix-list-marker" aria-hidden>
                ◆
              </span>
              <span>{line}</span>
            </SitePanel>
          ))}
        </div>
      </SiteSection>

      <SiteSection>
        <SiteSectionLabel>// PROJECTS</SiteSectionLabel>
        <h2 className="text-3xl font-bold text-white">Projects</h2>
        <p className="mt-3 max-w-3xl text-[#a0a0a0]">
          Shipped work tied to living routes on this domain.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {PROJECTS.map((p) => (
            <SitePanel key={p.href} href={p.href} className="group p-6">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-xl font-semibold text-[#e8e8e8] group-hover:text-white">
                  {p.title}
                </h3>
                <span className="forgeonix-panel-arrow">→</span>
              </div>
              <p className="mt-2 text-sm text-[#a0a0a0]">{p.hint}</p>
            </SitePanel>
          ))}
        </div>
      </SiteSection>

      <SiteSection className="bg-[#1e1e1e]/75">
        <SiteSectionLabel>// FOCUS</SiteSectionLabel>
        <h2 className="text-3xl font-bold text-white">Current focus</h2>
        <p className="mt-3 max-w-3xl text-[#a0a0a0]">Areas I&apos;m actively leveling up.</p>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {FOCUS.map((item) => (
            <SitePanel key={item} className="px-4 py-3 text-[#e0e0e0]" hover={false}>
              {item}
            </SitePanel>
          ))}
        </div>
      </SiteSection>

      <SiteSection>
        <SitePanel className="p-8" hover={false}>
          <SiteSectionLabel>// DEEP DIVE</SiteSectionLabel>
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Want the deeper technical breakdown?
          </h2>
          <div className="mt-8 flex flex-wrap gap-4">
            <SiteButton href="/infrastructure">View Infrastructure</SiteButton>
            <SiteButton href="/troubleshooting">View Troubleshooting</SiteButton>
            <SiteButton href="mailto:ethan@forgeonix.dev" variant="primary">
              Contact Me
            </SiteButton>
          </div>
        </SitePanel>
      </SiteSection>
    </SiteLayout>
  );
}

function ExpertiseCard({ title, description }: { title: string; description: string }) {
  return (
    <SitePanel className="p-6">
      <h3 className="text-lg font-semibold text-[#e8e8e8]">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-[#a0a0a0]">{description}</p>
    </SitePanel>
  );
}

function SkillCategory({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <SitePanel className="p-5 sm:p-6" hover={false}>
      <h3 className="forgeonix-accent-heading font-mono text-sm font-semibold tracking-wider uppercase">
        {title}
      </h3>
      <ul className="mt-4 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm text-[#e0e0e0]">
            <span className="forgeonix-list-marker" aria-hidden>
              •
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </SitePanel>
  );
}
