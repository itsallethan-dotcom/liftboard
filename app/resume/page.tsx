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

const SKILLS = [
  "Windows troubleshooting",
  "Active Directory / Azure AD support",
  "Account provisioning",
  "Hardware diagnostics",
  "Software diagnostics",
  "DNS fundamentals",
  "Email authentication: SPF, DKIM, DMARC",
  "Docker / Docker Compose",
  "Proxmox homelab",
  "Monitoring tools",
  "Next.js",
  "Supabase",
  "Vercel",
  "Technical documentation",
  "Customer support",
];

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
              Download PDF
            </SiteButton>
          </>
        }
      />

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
        <SiteSectionLabel>// SKILLS</SiteSectionLabel>
        <h2 className="text-3xl font-bold text-white">Core skills</h2>
        <p className="mt-3 max-w-3xl text-[#a0a0a0]">
          Tools and domains I operate in regularly.
        </p>
        <div className="mt-8 flex flex-wrap gap-2 sm:gap-3">
          {SKILLS.map((skill) => (
            <SitePanel
              key={skill}
              className="px-3 py-2 text-xs font-medium text-[#e0e0e0] sm:text-sm"
            >
              {skill}
            </SitePanel>
          ))}
        </div>
      </SiteSection>

      <SiteSection>
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

      <SiteSection className="bg-[#1e1e1e]/75">
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
                <span className="forgeonix-panel-arrow">
                  →
                </span>
              </div>
              <p className="mt-2 text-sm text-[#a0a0a0]">{p.hint}</p>
            </SitePanel>
          ))}
        </div>
      </SiteSection>

      <SiteSection>
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

      <SiteSection className="bg-[#1e1e1e]/75">
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
