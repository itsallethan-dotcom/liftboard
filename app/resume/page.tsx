import { ForgeonixNavMark } from "@/components/forgeonix-mark";
import { LandingBackgroundLayer } from "@/components/landing-background-layer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume | Forgeonix",
  description:
    "Systems-focused IT professional — troubleshooting, infrastructure, deployment, and support.",
};

const badgeHover =
  "transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(0,255,255,0.15)] hover:border-cyan-400/40";

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
              <a
                className="rounded-md px-3 py-1.5 text-zinc-300 hover:text-cyan-300"
                href="/infrastructure"
              >
                Infrastructure
              </a>
              <a
                className="rounded-md px-3 py-1.5 text-zinc-300 hover:text-cyan-300"
                href="/troubleshooting"
              >
                Troubleshooting
              </a>
              <span className="rounded-md px-3 py-1.5 font-medium text-cyan-300">Resume</span>
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
              Portfolio · Resume
            </p>
            <h1 className="fn-cine-title max-w-4xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl md:text-7xl">
              Resume
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-zinc-300 sm:text-xl">
              Systems-focused IT professional with hands-on experience in troubleshooting,
              infrastructure, application deployment, and user support.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="/"
                className="fn-cine-btn fn-cine-btn--ghost rounded-2xl border border-zinc-700/90 bg-zinc-950/35 px-6 py-3 font-semibold text-zinc-100 backdrop-blur-sm"
              >
                Back Home
              </a>
              <a
                href="/infrastructure"
                className="fn-cine-btn fn-cine-btn--ghost rounded-2xl border border-zinc-700/90 bg-zinc-950/35 px-6 py-3 font-semibold text-zinc-100 backdrop-blur-sm"
              >
                View Infrastructure
              </a>
              <a
                href="/troubleshooting"
                className="fn-cine-btn fn-cine-btn--ghost rounded-2xl border border-zinc-700/90 bg-zinc-950/35 px-6 py-3 font-semibold text-zinc-100 backdrop-blur-sm"
              >
                View Troubleshooting
              </a>
              <a
                href="/dashboard"
                className="fn-cine-btn fn-cine-btn--primary rounded-2xl bg-gradient-to-b from-cyan-300 to-cyan-500 px-6 py-3 font-semibold text-zinc-950"
              >
                Open Leaderboard
              </a>
              <a
                href="/resume.pdf"
                download="resume.pdf"
                className="fn-cine-btn fn-cine-btn--ghost rounded-2xl border border-zinc-700/90 bg-zinc-950/35 px-6 py-3 font-semibold text-zinc-100 backdrop-blur-sm"
              >
                Download PDF
              </a>
            </div>
          </div>
        </section>

        <section className="border-t border-zinc-800 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold">Professional summary</h2>
            <div className="mt-6 rounded-3xl border border-zinc-800 bg-zinc-900 p-6 sm:p-8">
              <p className="text-base leading-relaxed text-zinc-300 sm:text-lg">
                Systems-focused IT professional specializing in troubleshooting, infrastructure,
                and production-ready deployments. Experienced in end-user support, account provisioning,
                hardware/software diagnostics, Windows environments, DNS/email authentication, Docker-based
                services, and full-stack application deployment.
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-zinc-800 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold">Core skills</h2>
            <p className="mt-3 max-w-3xl text-zinc-400">Tools and domains I operate in regularly.</p>
            <div className="mt-8 flex flex-wrap gap-2 sm:gap-3">
              {SKILLS.map((skill) => (
                <span
                  key={skill}
                  className={`rounded-2xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-200 sm:text-sm ${badgeHover}`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-zinc-800 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold">Experience highlights</h2>
            <p className="mt-3 max-w-3xl text-zinc-400">
              Concrete contributions — practical scope, honest framing.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {EXPERIENCE.map((line) => (
                <div
                  key={line}
                  className="flex gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-4 text-sm text-zinc-200 transition hover:border-cyan-400/35"
                >
                  <span className="mt-1 shrink-0 text-cyan-400/70" aria-hidden>
                    ◆
                  </span>
                  <span>{line}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-zinc-800 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold">Projects</h2>
            <p className="mt-3 max-w-3xl text-zinc-400">Shipped work tied to living routes on this domain.</p>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {PROJECTS.map((p) => (
                <a
                  key={p.href}
                  href={p.href}
                  className="group rounded-3xl border border-zinc-800 bg-zinc-900 p-6 transition hover:border-cyan-400/35"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-xl font-semibold text-zinc-100 group-hover:text-cyan-200">
                      {p.title}
                    </h3>
                    <span className="shrink-0 text-cyan-400/60 transition group-hover:text-cyan-300">
                      →
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-zinc-400">{p.hint}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-zinc-800 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold">Current focus</h2>
            <p className="mt-3 max-w-3xl text-zinc-400">Areas I&apos;m actively leveling up.</p>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {FOCUS.map((item) => (
                <p
                  key={item}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-zinc-300"
                >
                  {item}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-zinc-800 px-6 py-20">
          <div className="mx-auto max-w-6xl rounded-3xl border border-cyan-400/20 bg-zinc-900 p-8">
            <h2 className="text-2xl font-bold sm:text-3xl">Want the deeper technical breakdown?</h2>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="/infrastructure"
                className="fn-cine-btn fn-cine-btn--ghost rounded-2xl border border-zinc-700 px-6 py-3 font-semibold text-zinc-100 transition hover:border-cyan-400"
              >
                View Infrastructure
              </a>
              <a
                href="/troubleshooting"
                className="fn-cine-btn fn-cine-btn--ghost rounded-2xl border border-zinc-700 px-6 py-3 font-semibold text-zinc-100 transition hover:border-cyan-400"
              >
                View Troubleshooting
              </a>
              <a
                href="mailto:ethan@forgeonix.dev"
                className="rounded-2xl bg-cyan-400 px-6 py-3 font-semibold text-zinc-950 transition hover:bg-cyan-300"
              >
                Contact Me
              </a>
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
