export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800/80">
        <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
          <a href="/" className="text-base font-semibold tracking-wide text-zinc-100">
            Forgeonix
          </a>
          <div className="flex items-center gap-3 text-sm">
            <a className="rounded-md px-3 py-1.5 text-zinc-300 hover:text-cyan-300" href="/">
              Home
            </a>
            <a className="rounded-md px-3 py-1.5 text-zinc-300 hover:text-cyan-300" href="#projects">
              Projects
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

      <section className="mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-center px-6 py-20">
        <div className="mb-8 inline-flex w-fit rounded-full border border-cyan-400/30 px-4 py-2 text-sm text-cyan-300">
          IT Support • Systems • Automation
        </div>

        <h1 className="max-w-4xl text-5xl font-bold tracking-tight sm:text-7xl">
          Forgeonix
        </h1>

        <p className="mt-6 max-w-2xl text-xl leading-8 text-zinc-300">
          I build, fix, and maintain reliable systems — from everyday tech
          issues to full homelab infrastructure and automation.
        </p>

        <p className="mt-8 text-lg font-semibold text-zinc-200">
          Ethan Edwards
        </p>
        <p className="text-zinc-400">IT Support & Systems Builder</p>
        <p className="mt-4 max-w-3xl text-sm text-cyan-300/90">
          3+ years hands-on IT experience • Windows systems • troubleshooting
          • user support
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="mailto:ethan@forgeonix.dev"
            className="rounded-2xl bg-cyan-400 px-6 py-3 font-semibold text-zinc-950 transition hover:bg-cyan-300"
          >
            Contact Me
          </a>

          <a
            href="/dashboard"
            className="rounded-2xl border border-zinc-700 px-6 py-3 font-semibold text-zinc-100 hover:border-cyan-400"
          >
            Open Leaderboard
          </a>
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
