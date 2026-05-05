export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto flex w-full max-w-6xl justify-end px-6 pt-6">
        <a
          href="/dashboard"
          className="rounded-lg border border-cyan-400/40 bg-zinc-900/80 px-3 py-1.5 text-sm font-semibold text-cyan-300 transition hover:border-cyan-300 hover:text-cyan-200"
        >
          Open Leaderboard
        </a>
      </div>

      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16">
        <div className="mb-10 inline-flex w-fit rounded-full border border-cyan-400/30 px-4 py-2 text-sm text-cyan-300">
          Systems • Support • Infrastructure
        </div>

        <h1 className="max-w-4xl text-5xl font-bold tracking-tight sm:text-7xl">
          Forgeonix
        </h1>

        <p className="mt-6 max-w-2xl text-xl leading-8 text-zinc-300">
          Practical IT support, systems troubleshooting, automation, and
          infrastructure-minded solutions built for reliability.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="mailto:ethan@forgeonix.dev"
            className="rounded-2xl border border-zinc-700 px-6 py-3 font-semibold text-zinc-100 hover:border-cyan-400"
          >
            Contact Me
          </a>

          <a
            href="#projects"
            className="rounded-2xl border border-zinc-700 px-6 py-3 font-semibold text-zinc-100 hover:border-cyan-400"
          >
            View Projects
          </a>
        </div>
      </section>

      <section className="border-t border-zinc-800 px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 xl:grid-cols-4">
          <Card
            title="IT Support"
            text="Hands-on troubleshooting for Windows systems, printers, software issues, performance problems, and user support."
          />
          <Card
            title="Systems & Homelab"
            text="Homelab, Docker, Proxmox, monitoring, backups, remote access, and practical infrastructure projects."
          />
          <Card
            title="Automation"
            text="Small tools, scripts, dashboards, and workflow improvements that save time and reduce repeated work."
          />
          <Card
            title="Web & App Projects"
            text="Modern web and app builds with pragmatic architecture, reliable deployment, and maintainable code."
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
              text="A full-stack fitness leaderboard with authentication, user profiles, workout logging, team features, and live deployment."
            />
            <Project
              title="Home Infrastructure Lab"
              text="A self-hosted environment using Proxmox, Docker, monitoring tools, Home Assistant, and remote access services."
            />
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-800 px-6 py-20">
        <div className="mx-auto max-w-6xl rounded-3xl border border-cyan-400/20 bg-zinc-900 p-8">
          <h2 className="text-3xl font-bold">Let’s build something solid.</h2>
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
