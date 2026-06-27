"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PanelCorners } from "@/components/PanelCorners";
import { SectionLabel } from "@/components/SectionLabel";
import { playSound } from "@/lib/sounds";
import {
  fadeUp,
  staggerContainer,
  viewportOnce,
} from "@/lib/home-motion";

const MotionLink = motion.create(Link);

type ProjectStatus = "LIVE" | "IN DEVELOPMENT" | "COMPLETED" | "ACTIVE";

type Project = {
  title: string;
  description: string;
  stack: readonly string[];
  status: ProjectStatus;
  href: string;
  external?: boolean;
};

const PROJECTS: Project[] = [
  {
    title: "Forgeonix",
    description:
      "Personal tech brand and portfolio platform built for systems-focused professional presence.",
    stack: ["Next.js", "Tailwind", "Supabase", "Vercel"],
    status: "LIVE",
    href: "https://www.forgeonix.dev",
    external: true,
  },
  {
    title: "Liftboard",
    description:
      "Full-stack workout leaderboard with auth, profiles, teams, and gym leaderboards.",
    stack: ["Next.js", "Supabase"],
    status: "IN DEVELOPMENT",
    href: "https://liftboard.forgeonix.dev",
    external: true,
  },
  {
    title: "Blackgate Studios",
    description:
      "Production client website with media gallery, admin portal, and image management.",
    stack: ["Next.js", "Cloudinary", "Supabase"],
    status: "LIVE",
    href: "https://www.blackgatestudios.art",
    external: true,
  },
  {
    title: "Home Infrastructure Lab",
    description:
      "Proxmox + Docker homelab with monitoring, automation, remote access, and self-hosted services.",
    stack: ["Proxmox", "Docker", "Tailscale", "Uptime Kuma"],
    status: "ACTIVE",
    href: "/infrastructure",
  },
  {
    title: "Solea Nails",
    description:
      "Nail design visualizer app concept for small business client engagement.",
    stack: ["Next.js", "Concept"],
    status: "IN DEVELOPMENT",
    // TODO: Replace with Solea Nails project URL when available.
    href: "#solea",
  },
];

const CARD_CLASS =
  "forgeonix-card forgeonix-panel group relative flex h-full flex-col overflow-hidden rounded-sm bg-[#1c1c1c]/90 p-6 backdrop-blur-sm";

const STATUS_LIGHT: Record<ProjectStatus, string> = {
  LIVE: "forgeonix-status-light--live",
  ACTIVE: "forgeonix-status-light--active",
  "IN DEVELOPMENT": "forgeonix-status-light--dev",
  COMPLETED: "forgeonix-status-light--complete",
};

function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span className="shrink-0 rounded-sm border border-white/10 bg-[#141414]/90 px-2 py-0.5 font-mono text-[10px] tracking-widest text-[#c0c0c0] uppercase">
      {status}
    </span>
  );
}

function StatusIndicator({ status }: { status: ProjectStatus }) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <span
        className={`forgeonix-status-light ${STATUS_LIGHT[status]}`}
        aria-hidden
      />
      <StatusBadge status={status} />
    </div>
  );
}

function ProjectCardContent({ project }: { project: Project }) {
  return (
    <>
      <PanelCorners />
      <div className="pointer-events-none absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent via-[#ff7a36]/50 to-transparent" />
      <div className="flex items-start justify-between gap-3">
        <h3 className="min-w-0 text-xl font-semibold text-[#e8e8e8]">
          {project.title}
        </h3>
        <StatusIndicator status={project.status} />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <span
            key={tech}
            className="rounded-sm border border-white/10 bg-[#141414]/80 px-2.5 py-0.5 font-mono text-xs text-[#c0c0c0]"
          >
            {tech}
          </span>
        ))}
      </div>
      <p className="mt-4 flex-1 text-sm leading-relaxed text-[#a0a0a0]">
        {project.description}
      </p>
      <span className="forgeonix-panel-link mt-4 inline-flex items-center gap-1 font-mono text-xs tracking-wide">
        View Project
        <span aria-hidden>→</span>
      </span>
    </>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const ariaLabel = `View ${project.title} project`;
  const motionProps = {
    variants: fadeUp,
    whileHover: { y: -5 as const },
    transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] as const },
    onMouseEnter: () => playSound("hover"),
    className: CARD_CLASS,
    "aria-label": ariaLabel,
  };

  if (project.external) {
    return (
      <motion.a
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
        {...motionProps}
        onClick={() => playSound("click")}
      >
        <ProjectCardContent project={project} />
      </motion.a>
    );
  }

  if (project.href.startsWith("/")) {
    return (
      <MotionLink href={project.href} {...motionProps} onClick={() => playSound("click")}>
        <ProjectCardContent project={project} />
      </MotionLink>
    );
  }

  return (
    <motion.a href={project.href} {...motionProps} onClick={() => playSound("click")}>
      <ProjectCardContent project={project} />
    </motion.a>
  );
}

export function ProjectsSection() {
  return (
    <section id="projects" className="relative bg-[#1e1e1e]/75 px-6 py-24 backdrop-blur-[2px]">
      <div className="mx-auto max-w-6xl">
        <SectionLabel>// PROJECTS</SectionLabel>

        <motion.div
          className="grid auto-rows-fr gap-6 md:grid-cols-2"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {PROJECTS.map((project) => (
            <div key={project.title} className="h-full min-h-0">
              <ProjectCard project={project} />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
