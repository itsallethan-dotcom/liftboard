import { ForgeonixNavMark } from "@/components/forgeonix-mark";
import { LandingBackgroundLayer } from "@/components/landing-background-layer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Infrastructure & Systems Lab | Forgeonix",
  description:
    "Homelab and infrastructure: Proxmox, Docker, monitoring, DNS, email authentication, and practical systems work.",
};

/** Subtle card hover — matches portfolio pages (no redesign; class-only). */
const cardHover =
  "transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(0,255,255,0.15)] hover:border-cyan-400/40";

function FlowArrow() {
  return (
    <div className="flex flex-col items-center py-1">
      <div className="h-6 w-px bg-gradient-to-b from-cyan-400/35 to-cyan-400/5" aria-hidden />
      <span className="text-sm text-cyan-400/50" aria-hidden>
        ↓
      </span>
    </div>
  );
}

export default function InfrastructurePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-zinc-950 text-zinc-100">
      <LandingBackgroundLayer />

      <div className="relative z-10">
        <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-zinc-950/80 backdrop-blur-md">
          <nav className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-5">
            <a
              href="/"
              className="flex items-center gap-2.5 text-base font-semibold tracking-wide text-zinc-100"
            >
              <ForgeonixNavMark />
              <span>Forgeonix</span>
            </a>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-2 text-sm sm:gap-3">
              <a className="rounded-md px-3 py-1.5 text-zinc-300 hover:text-cyan-300" href="/">
                Home
              </a>
              <a
                className="rounded-md px-3 py-1.5 text-zinc-300 hover:text-cyan-300"
                href="/#projects"
              >
                Projects
              </a>
              <span className="rounded-md px-3 py-1.5 font-medium text-cyan-300">
                Infrastructure
              </span>
              <a
                className="rounded-md px-3 py-1.5 text-zinc-300 hover:text-cyan-300"
                href="/troubleshooting"
              >
                Troubleshooting
              </a>
              <a className="rounded-md px-3 py-1.5 text-zinc-300 hover:text-cyan-300" href="/resume">
                Resume
              </a>
              <a
                href="/dashboard"
                className="rounded-md border border-cyan-400/40 bg-zinc-900/80 px-3 py-1.5 font-semibold text-cyan-300 transition hover:border-cyan-300 hover:text-cyan-200"
              >
                Open Leaderboard
              </a>
            </div>
          </nav>
        </header>

        <section className="fn-cine-hero fn-cine-hero--compact">
          <div className="fn-cine-hero__bg" aria-hidden>
            <div className="fn-cine-hero__bg-base" />
            <div className="fn-cine-hero__bg-bloom" />
            <div className="fn-cine-hero__grid" />
            <div className="fn-cine-hero__dots" />
            <div className="fn-cine-hero__scan" />
            <div className="fn-cine-hero__light" />
            <div className="fn-cine-hero__vignette" />
          </div>

          <div className="relative z-[1] mx-auto max-w-6xl px-6 pt-24 pb-16 text-left md:pt-28 md:pb-20">
            <p className="mb-4 inline-flex max-w-full flex-wrap gap-x-2 rounded-full border border-cyan-400/25 bg-black/20 px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] text-cyan-300/90 backdrop-blur-sm sm:text-sm">
              Case study · Homelab
            </p>
            <h1 className="fn-cine-title max-w-4xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl md:text-7xl">
              Infrastructure & Systems Lab
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-zinc-300 sm:text-xl">
              A practical homelab environment built to learn, deploy, monitor, and
              troubleshoot real services.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="/"
                className="fn-cine-btn fn-cine-btn--ghost rounded-2xl border border-zinc-700/90 bg-zinc-950/35 px-6 py-3 font-semibold text-zinc-100 backdrop-blur-sm"
              >
                Back Home
              </a>
              <a
                href="/dashboard"
                className="fn-cine-btn fn-cine-btn--ghost rounded-2xl border border-zinc-700/90 bg-zinc-950/35 px-6 py-3 font-semibold text-zinc-100 backdrop-blur-sm"
              >
                Open Leaderboard
              </a>
              <a
                href="mailto:ethan@forgeonix.dev"
                className="fn-cine-btn fn-cine-btn--primary rounded-2xl bg-gradient-to-b from-cyan-300 to-cyan-500 px-6 py-3 font-semibold text-zinc-950"
              >
                Contact Me
              </a>
            </div>
          </div>
        </section>

        <section className="border-t border-zinc-800 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold">Visual architecture</h2>
            <p className="mt-3 max-w-3xl text-zinc-400">
              End-to-end flow from the network edge to services I run and maintain
              in a controlled lab environment.
            </p>

            <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_minmax(0,15rem)] lg:items-start">
              <div className="flex min-w-0 flex-col">
                <div
                  className={`group rounded-3xl border border-zinc-800 bg-zinc-900 p-5 text-center sm:p-6 ${cardHover}`}
                >
                  <p className="text-sm font-semibold uppercase tracking-wider text-cyan-300/90">
                    Edge
                  </p>
                  <p className="mt-2 text-lg font-semibold text-zinc-100">
                    Internet / Local Network
                  </p>
                  <p className="mt-2 max-h-0 overflow-hidden text-xs text-zinc-500 opacity-0 transition-all duration-300 ease-out group-hover:max-h-12 group-hover:opacity-100">
                    Ingress path for lab traffic and routing context.
                  </p>
                </div>
                <FlowArrow />
                <div
                  className={`group rounded-3xl border border-zinc-800 bg-zinc-900 p-5 text-center sm:p-6 ${cardHover}`}
                >
                  <p className="text-lg font-semibold text-zinc-100">Proxmox Host</p>
                  <p className="mt-2 text-sm text-zinc-400">Virtualization layer</p>
                  <p className="mt-2 max-h-0 overflow-hidden text-xs text-zinc-500 opacity-0 transition-all duration-300 ease-out group-hover:max-h-12 group-hover:opacity-100">
                    Where VMs and LXC are provisioned and isolated.
                  </p>
                </div>
                <FlowArrow />
                <div
                  className={`group rounded-3xl border border-zinc-800 bg-zinc-900 p-5 text-center sm:p-6 ${cardHover}`}
                >
                  <p className="text-lg font-semibold text-zinc-100">Docker VM</p>
                  <p className="mt-2 text-sm text-zinc-400">Compose-backed services</p>
                  <p className="mt-2 max-h-0 overflow-hidden text-xs text-zinc-500 opacity-0 transition-all duration-300 ease-out group-hover:max-h-12 group-hover:opacity-100">
                    Primary runtime for internal tools and automation.
                  </p>
                </div>
                <FlowArrow />
                <div className={`rounded-3xl border border-zinc-800 bg-zinc-900 p-6 ${cardHover}`}>
                  <p className="text-center text-lg font-semibold text-zinc-100">
                    Core services
                  </p>
                  <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                    {[
                      { item: "Portainer", hint: "Container management UI and endpoint control." },
                      { item: "Uptime Kuma", hint: "Synthetic checks and alert history." },
                      { item: "Home Assistant", hint: "Automation hub and device mesh." },
                      { item: "Homepage Dashboard", hint: "Single pane for internal links." },
                      { item: "AdGuard / DNS tooling", hint: "Recursive DNS and filtering policy." },
                      { item: "n8n automation", hint: "Workflow glue between APIs and hooks." },
                      { item: "Netdata monitoring", hint: "Live metrics and resource signals." },
                    ].map(({ item, hint }) => (
                      <li
                        key={item}
                        className={`group rounded-2xl border border-zinc-800/80 bg-zinc-950/50 px-4 py-3 text-center text-sm text-zinc-200 ${cardHover}`}
                      >
                        {item}
                        <span className="mt-1 block max-h-0 overflow-hidden text-[11px] leading-snug text-zinc-500 opacity-0 transition-all duration-300 ease-out group-hover:max-h-16 group-hover:opacity-100">
                          {hint}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <aside className="flex flex-col gap-4">
                <div className={`group rounded-3xl border border-zinc-800 bg-zinc-900 p-5 ${cardHover}`}>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-cyan-300/85">
                    Domain & DNS
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    Custom domain with DNS records managed for mail and service
                    routing.
                  </p>
                  <p className="mt-2 max-h-0 overflow-hidden text-xs text-zinc-500 opacity-0 transition-all duration-300 ease-out group-hover:max-h-10 group-hover:opacity-100">
                    Records validated against provider expectations.
                  </p>
                </div>
                <div className={`group rounded-3xl border border-zinc-800 bg-zinc-900 p-5 ${cardHover}`}>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-cyan-300/85">
                    Email authentication
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    SPF, DKIM, and DMARC aligned with provider guidance; monitored
                    before tightening policy.
                  </p>
                  <p className="mt-2 max-h-0 overflow-hidden text-xs text-zinc-500 opacity-0 transition-all duration-300 ease-out group-hover:max-h-10 group-hover:opacity-100">
                    Policy tightened only after clean reporting windows.
                  </p>
                </div>
                <div
                  className={`group rounded-3xl border border-dashed border-zinc-700 bg-zinc-900/80 p-5 ${cardHover}`}
                >
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
                    Next direction
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                    Remote access hardening and Tailscale-style mesh for
                    admin paths—planned, not overstated.
                  </p>
                  <p className="mt-2 max-h-0 overflow-hidden text-xs text-zinc-500 opacity-0 transition-all duration-300 ease-out group-hover:max-h-10 group-hover:opacity-100">
                    Zero-trust admin paths under evaluation.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="border-t border-zinc-800 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold">Systems I&apos;ve worked with</h2>
            <p className="mt-3 max-w-3xl text-zinc-400">
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
          </div>
        </section>

        <section className="border-t border-zinc-800 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold">Troubleshooting wins</h2>
            <p className="mt-3 max-w-3xl text-zinc-400">
              Concrete problems solved—not theory.
            </p>
            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <WinCard text="Resolved Docker service access issues (ports, networks, dependency order)." />
              <WinCard text="Debugged reverse proxy / host validation mismatches." />
              <WinCard text="Fixed DNS and email authentication records after provider changes." />
              <WinCard text="Moved DMARC from monitoring toward enforcement-ready posture." />
              <WinCard text="Deployed and verified self-hosted services end-to-end." />
              <WinCard text="Built a full-stack app with database, auth, deployment, and real users." />
            </div>
          </div>
        </section>

        <section className="border-t border-zinc-800 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold">Current roadmap</h2>
            <p className="mt-3 max-w-3xl text-zinc-400">
              Active learning—not claimed mastery. These are the next concrete
              improvements I&apos;m focused on.
            </p>
            <div className="mt-6 grid gap-3 text-zinc-300 md:grid-cols-2">
              <RoadmapPill text="Improve networking fundamentals" />
              <RoadmapPill text="Expand monitoring dashboards" />
              <RoadmapPill text="Harden remote access" />
              <RoadmapPill text="Add better backups" />
              <RoadmapPill text="Build automation workflows" />
              <RoadmapPill text="Document repeatable deployment steps" />
            </div>
          </div>
        </section>

        <footer className="border-t border-zinc-800 px-6 py-8">
          <div className="mx-auto flex max-w-6xl flex-col justify-between gap-2 text-sm text-zinc-400 sm:flex-row">
            <p>Forgeonix © 2026</p>
            <a href="mailto:ethan@forgeonix.dev" className="hover:text-cyan-300">
              ethan@forgeonix.dev
            </a>
          </div>
        </footer>
      </div>
    </main>
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
    <div className={`rounded-3xl border border-zinc-800 bg-zinc-900 p-6 ${cardHover}`}>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-3 text-sm text-zinc-400">
        <span className="font-medium text-zinc-300">What:</span> {what}
      </p>
      <p className="mt-2 text-sm text-zinc-400">
        <span className="font-medium text-zinc-300">Used for:</span> {used}
      </p>
      <p className="mt-2 text-sm text-zinc-400">
        <span className="font-medium text-zinc-300">Learned:</span> {learned}
      </p>
    </div>
  );
}

function WinCard({ text }: { text: string }) {
  return (
    <div
      className={`rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-4 text-sm font-medium text-zinc-200 ${cardHover}`}
    >
      {text}
    </div>
  );
}

function RoadmapPill({ text }: { text: string }) {
  return (
    <p className="rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3">{text}</p>
  );
}
