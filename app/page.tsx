import { ForgeonixHeroMark, ForgeonixNavMark } from "@/components/forgeonix-mark";
import { LandingBackgroundLayer } from "@/components/landing-background-layer";

export default function Home() {
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
          <div className="flex items-center gap-3 text-sm">
            <a className="rounded-md px-3 py-1.5 text-zinc-300 hover:text-cyan-300" href="/">
              Home
            </a>
            <a className="rounded-md px-3 py-1.5 text-zinc-300 hover:text-cyan-300" href="#projects">
              Projects
            </a>
            <a className="rounded-md px-3 py-1.5 text-zinc-300 hover:text-cyan-300" href="/troubleshooting">
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

      <section className="fn-cine-hero">
        <div className="fn-cine-hero__bg" aria-hidden>
          <div className="fn-cine-hero__bg-base" />
          <div className="fn-cine-hero__bg-bloom" />
          <div className="fn-cine-hero__grid" />
          <div className="fn-cine-hero__dots" />
          <div className="fn-cine-hero__scan" />
          <div className="fn-cine-hero__light" />
          <div className="fn-cine-hero__vignette" />
        </div>

        <div className="relative z-[1] mx-auto flex min-h-[100dvh] max-w-6xl flex-col justify-center px-6 py-16 text-left sm:py-20">
          <div className="fn-cine-hero__stagger fn-cine-hero__stagger--logo mb-10 flex w-full justify-center sm:mb-12">
            <ForgeonixHeroMark />
          </div>

          <div className="fn-cine-hero__stagger fn-cine-hero__stagger--text">
            <div className="mb-8 inline-flex w-fit rounded-full border border-cyan-400/25 bg-black/20 px-4 py-2 text-sm text-cyan-300/95 backdrop-blur-sm">
              IT Support • Systems • Automation
            </div>

            <h1 className="fn-cine-title max-w-4xl text-5xl font-bold leading-[1.05] tracking-tight sm:text-7xl">
              Forgeonix
            </h1>

            <p className="mt-6 max-w-2xl text-xl leading-8 text-zinc-300">
              Systems-focused IT professional specializing in troubleshooting,
              infrastructure, and production-ready deployments.
            </p>

            <p className="mt-8 text-lg font-semibold text-zinc-200">
              Ethan Edwards
            </p>
            <p className="text-zinc-400">IT Support & Systems Builder</p>
            <p className="mt-4 max-w-3xl text-sm text-cyan-300/85">
              5+ years hands-on IT experience • Windows systems • troubleshooting
              • user support
            </p>
          </div>

          <div className="fn-cine-hero__stagger fn-cine-hero__stagger--cta mt-10 flex flex-wrap gap-4">
            <a
              href="mailto:ethan@forgeonix.dev"
              className="fn-cine-btn fn-cine-btn--primary rounded-2xl bg-gradient-to-b from-cyan-300 to-cyan-500 px-6 py-3 font-semibold text-zinc-950"
            >
              Contact Me
            </a>

            <a
              href="/dashboard"
              className="fn-cine-btn fn-cine-btn--ghost rounded-2xl border border-zinc-700/90 bg-zinc-950/35 px-6 py-3 font-semibold text-zinc-100 backdrop-blur-sm"
            >
              Open Leaderboard
            </a>

            <a
              href="#projects"
              className="fn-cine-btn fn-cine-btn--ghost rounded-2xl border border-zinc-700/90 bg-zinc-950/35 px-6 py-3 font-semibold text-zinc-100 backdrop-blur-sm"
            >
              View Projects
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
              href="/resume"
              className="fn-cine-btn fn-cine-btn--ghost rounded-2xl border border-zinc-700/90 bg-zinc-950/35 px-6 py-3 font-semibold text-zinc-100 backdrop-blur-sm"
            >
              View Resume
            </a>
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-800 px-6 py-20">
        <div className="mx-auto mb-10 max-w-6xl">
          <h2 className="text-3xl font-bold">Services</h2>
          <p className="mt-3 max-w-3xl text-zinc-400">
            Practical support and systems work focused on uptime, clarity, and
            long-term reliability.
          </p>
        </div>
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 xl:grid-cols-4">
          <Card
            title="IT Support"
            text="Windows troubleshooting, software break/fix, printer/network issues, and user support with clear, practical resolutions."
          />
          <Card
            title="Systems & Homelab"
            text="Proxmox and Docker setup, backup strategy, remote access hardening, and infrastructure that is documented and maintainable."
          />
          <Card
            title="Automation"
            text="Task automation with scripts, scheduled jobs, and operational workflows that reduce repetitive support work."
          />
          <Card
            title="Web & App Projects"
            text="Production-minded web apps with auth, data models, deployment, and practical feature delivery for real users."
          />
        </div>
      </section>

      <section id="projects" className="border-t border-zinc-800 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold">Projects</h2>
          <p className="mt-3 max-w-2xl text-zinc-400">
            Real builds, practical learning, and systems-focused experiments.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <Project
              title="Workout Leaderboard App"
              text="Full-stack Next.js + Supabase app with user authentication, profiles, workout logging, and leaderboard logic. Deployed on Vercel with real users."
            />
            <Project
              title="Home Infrastructure Lab"
              text="Proxmox + Docker environment with monitoring, uptime tracking, Home Assistant, remote access, and self-hosted automation workflows."
            />
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-800 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold">Currently Building</h2>
          <div className="mt-6 grid gap-3 text-zinc-300 md:grid-cols-2">
            <p className="rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3">
              Expanding homelab infrastructure
            </p>
            <p className="rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3">
              Building automation workflows
            </p>
            <p className="rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3">
              Improving system monitoring and dashboards
            </p>
            <p className="rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3">
              Developing Forgeonix as a portfolio and future IT services brand
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-800 px-6 py-20">
        <div className="mx-auto max-w-6xl rounded-3xl border border-cyan-400/20 bg-zinc-900 p-8">
          <h2 className="text-3xl font-bold">Let&apos;s build something solid.</h2>
          <p className="mt-4 max-w-2xl text-zinc-300">
            Whether it’s troubleshooting, systems support, automation, or a
            practical tech project, Forgeonix is built around dependable
            solutions.
          </p>

          <a
            href="mailto:ethan@forgeonix.dev"
            className="mt-8 inline-block rounded-2xl bg-cyan-400 px-6 py-3 font-semibold text-zinc-950 hover:bg-cyan-300"
          >
            ethan@forgeonix.dev
          </a>
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

function Card({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-3 text-zinc-400">{text}</p>
    </div>
  );
}

function Project({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
      <h3 className="text-2xl font-semibold">{title}</h3>
      <p className="mt-3 text-zinc-400">{text}</p>
    </div>
  );
}
