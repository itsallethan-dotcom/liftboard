import { HomelabTopology } from "@/components/HomelabTopology";
import { NavBar } from "@/components/NavBar";
import { SiteButton } from "@/components/SiteButton";
import { SiteLayout } from "@/components/SiteLayout";
import { SitePageHero } from "@/components/SitePageHero";
import { SitePanel } from "@/components/SitePanel";
import { SiteSection } from "@/components/SiteSection";
import { SiteSectionLabel } from "@/components/SiteSectionLabel";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Infrastructure & Systems Lab | Forgeonix",
  description:
    "Homelab and infrastructure: Proxmox, Docker, monitoring, DNS, email authentication, and practical systems work.",
};

export default function InfrastructurePage() {
  return (
    <SiteLayout themeClassName="forgeonix-theme-ops">
      <NavBar activeHref="/infrastructure" />
      <SitePageHero
        eyebrow="Case study · Homelab"
        title="Infrastructure & Systems Lab"
        description="A practical homelab environment built to learn, deploy, monitor, and troubleshoot real services."
        actions={
          <>
            <SiteButton href="/">Back Home</SiteButton>
            <SiteButton href="https://liftboard.forgeonix.dev">Open Leaderboard</SiteButton>
            <SiteButton href="mailto:ethan@forgeonix.dev" variant="primary">
              Contact Me
            </SiteButton>
          </>
        }
      />

      <SiteSection>
        <SiteSectionLabel>// ARCHITECTURE</SiteSectionLabel>
        <h2 className="text-3xl font-bold text-white">Visual Architecture</h2>
        <p className="mt-3 max-w-3xl text-[#a0a0a0]">
          Animated data paths from the network edge through secure access to the Proxmox host and
          downstream services in a controlled lab environment.
        </p>
        <HomelabTopology className="mt-8" />

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          <SitePanel className="group p-5">
            <h3 className="forgeonix-accent-heading font-mono text-sm font-semibold tracking-wider uppercase">
              Domain & DNS
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#a0a0a0]">
              Custom domain with DNS records managed for mail and service routing.
            </p>
            <p className="mt-2 max-h-0 overflow-hidden text-xs text-[#a0a0a0] opacity-0 transition-all duration-300 ease-out group-hover:max-h-10 group-hover:opacity-100">
              Records validated against provider expectations.
            </p>
          </SitePanel>
          <SitePanel className="group p-5">
            <h3 className="forgeonix-accent-heading font-mono text-sm font-semibold tracking-wider uppercase">
              Email authentication
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#a0a0a0]">
              SPF, DKIM, and DMARC aligned with provider guidance; monitored before tightening
              policy.
            </p>
            <p className="mt-2 max-h-0 overflow-hidden text-xs text-[#a0a0a0] opacity-0 transition-all duration-300 ease-out group-hover:max-h-10 group-hover:opacity-100">
              Policy tightened only after clean reporting windows.
            </p>
          </SitePanel>
          <SitePanel className="group border-dashed p-5" hover={false}>
            <h3 className="font-mono text-sm font-semibold tracking-wider text-[#c0c0c0] uppercase">
              Next direction
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#a0a0a0]">
              Remote access hardening and Tailscale-style mesh for admin paths—planned, not
              overstated.
            </p>
            <p className="mt-2 max-h-0 overflow-hidden text-xs text-[#a0a0a0] opacity-0 transition-all duration-300 ease-out group-hover:max-h-10 group-hover:opacity-100">
              Zero-trust admin paths under evaluation.
            </p>
          </SitePanel>
        </div>
      </SiteSection>

      <SiteSection className="bg-[#1e1e1e]/75">
        <SiteSectionLabel>// SYSTEMS</SiteSectionLabel>
        <h2 className="text-3xl font-bold text-white">Systems I&apos;ve worked with</h2>
        <p className="mt-3 max-w-3xl text-[#a0a0a0]">
          What it is, how I used it, and what I learned while operating it.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <SystemCard
            title="Proxmox virtualization"
            what="Type-1 hypervisor for VMs and LXC."
            used="Hosts lab workloads and isolates Docker workloads in a VM."
            learned="Snapshots, resource planning, and network bridge behavior under load."
          />
          <SystemCard
            title="Docker & Docker Compose"
            what="Container runtime and declarative stacks."
            used="Runs core services with repeatable compose files and clear ports/volumes."
            learned="Networking between stacks, health checks, and upgrade discipline."
          />
          <SystemCard
            title="Linux server administration"
            what="Headless server maintenance and permissions model."
            used="SSH access, service restarts, log inspection, disk and user hygiene."
            learned="Tracing failures from logs first instead of guessing at config."
          />
          <SystemCard
            title="DNS and email authentication"
            what="Public DNS records and mail trust mechanisms."
            used="Aligned TXT/CNAME records with provider requirements."
            learned="SPF/DKIM/DMARC interplay and why DNS TTL and validation matter."
          />
          <SystemCard
            title="Monitoring and uptime checks"
            what="Availability metrics and alerting paths."
            used="Heartbeat checks across internal services and dashboards for trends."
            learned="Reducing alert noise and confirming incidents with second signals."
          />
          <SystemCard
            title="Home automation"
            what="Local-first automation and device integration."
            used="Stable automations with clear failure modes."
            learned="Prefer reliability over novelty; document assumptions."
          />
          <SystemCard
            title="Automation workflows"
            what="Scheduled jobs and integration flows."
            used="n8n-style automation between APIs and internal hooks."
            learned="Idempotent steps and safe retries beat fragile one-off scripts."
          />
          <SystemCard
            title="Web app deployment"
            what="Shipping apps with hosting, TLS, and CI-style discipline."
            used="Shipped a full-stack app with auth, database, and production hosting."
            learned="Environment parity and deployment logs are half the battle."
          />
        </div>
      </SiteSection>

      <SiteSection>
        <SiteSectionLabel>// WINS</SiteSectionLabel>
        <h2 className="text-3xl font-bold text-white">Troubleshooting wins</h2>
        <p className="mt-3 max-w-3xl text-[#a0a0a0]">Concrete problems solved—not theory.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <WinCard text="Resolved Docker service access issues (ports, networks, dependency order)." />
          <WinCard text="Debugged reverse proxy / host validation mismatches." />
          <WinCard text="Fixed DNS and email authentication records after provider changes." />
          <WinCard text="Moved DMARC from monitoring toward enforcement-ready posture." />
          <WinCard text="Deployed and verified self-hosted services end-to-end." />
          <WinCard text="Built a full-stack app with database, auth, deployment, and real users." />
        </div>
      </SiteSection>

      <SiteSection className="bg-[#1e1e1e]/75">
        <SiteSectionLabel>// ROADMAP</SiteSectionLabel>
        <h2 className="text-3xl font-bold text-white">Current roadmap</h2>
        <p className="mt-3 max-w-3xl text-[#a0a0a0]">
          Active learning—not claimed mastery. These are the next concrete improvements
          I&apos;m focused on.
        </p>
        <div className="mt-6 grid gap-3 text-[#e0e0e0] md:grid-cols-2">
          <RoadmapPill text="Improve networking fundamentals" />
          <RoadmapPill text="Expand monitoring dashboards" />
          <RoadmapPill text="Harden remote access" />
          <RoadmapPill text="Add better backups" />
          <RoadmapPill text="Build automation workflows" />
          <RoadmapPill text="Document repeatable deployment steps" />
        </div>
      </SiteSection>
    </SiteLayout>
  );
}

function SystemCard({
  title,
  what,
  used,
  learned,
}: {
  title: string;
  what: string;
  used: string;
  learned: string;
}) {
  return (
    <SitePanel className="p-6">
      <h3 className="text-xl font-semibold text-[#e8e8e8]">{title}</h3>
      <p className="mt-3 text-sm text-[#a0a0a0]">
        <span className="font-medium text-[#e0e0e0]">What:</span> {what}
      </p>
      <p className="mt-2 text-sm text-[#a0a0a0]">
        <span className="font-medium text-[#e0e0e0]">Used for:</span> {used}
      </p>
      <p className="mt-2 text-sm text-[#a0a0a0]">
        <span className="font-medium text-[#e0e0e0]">Learned:</span> {learned}
      </p>
    </SitePanel>
  );
}

function WinCard({ text }: { text: string }) {
  return (
    <SitePanel className="px-4 py-4 text-sm font-medium text-[#e0e0e0]">{text}</SitePanel>
  );
}

function RoadmapPill({ text }: { text: string }) {
  return (
    <SitePanel className="px-4 py-3 text-[#e0e0e0]" hover={false}>
      {text}
    </SitePanel>
  );
}
