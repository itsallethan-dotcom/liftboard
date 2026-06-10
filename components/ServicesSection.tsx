"use client";

import { motion } from "framer-motion";
import { PanelCorners } from "@/components/PanelCorners";
import { SectionLabel } from "@/components/SectionLabel";
import {
  IconCycle,
  IconLayers,
  IconTerminal,
  IconTool,
} from "@/components/section-icons";
import { playSound } from "@/lib/sounds";
import {
  fadeUp,
  staggerContainer,
  viewportOnce,
} from "@/lib/home-motion";

const CARD_CLASS =
  "forgeonix-card forgeonix-panel group relative flex h-full flex-col overflow-hidden rounded-sm bg-[#1c1c1c]/90 p-8 backdrop-blur-sm";

const SERVICES = [
  {
    icon: IconTool,
    title: "IT Support",
    description:
      "Windows, M365, troubleshooting, and endpoint support with clear resolutions.",
  },
  {
    icon: IconLayers,
    title: "Infrastructure",
    description:
      "Proxmox, Docker, homelab design, backup strategy, and maintainable systems.",
  },
  {
    icon: IconCycle,
    title: "Automation",
    description:
      "Scripts, workflows, n8n integrations, and task automation that saves time.",
  },
  {
    icon: IconTerminal,
    title: "Web & App Dev",
    description:
      "Full-stack apps, auth, deployment, and production-ready delivery.",
  },
] as const;

function ServiceCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof IconTool;
  title: string;
  description: string;
}) {
  return (
    <motion.article
      className={CARD_CLASS}
      variants={fadeUp}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4 }}
      onMouseEnter={() => playSound("hover")}
    >
      <PanelCorners />
      <div className="pointer-events-none absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent via-[#67e8f9]/40 to-transparent" />
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-[#67e8f9]/20 bg-[#141414]/80 shadow-[inset_0_0_12px_rgba(103,232,249,0.06)]">
        <Icon />
      </div>
      <h3 className="mt-5 text-xl font-semibold text-[#e8e8e8]">{title}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-[#a0a0a0]">
        {description}
      </p>
    </motion.article>
  );
}

export function ServicesSection() {
  return (
    <section id="services" className="relative bg-[#1a1a1a]/75 px-6 py-24 backdrop-blur-[2px]">
      <div className="mx-auto max-w-6xl">
        <SectionLabel>// SERVICES</SectionLabel>

        <motion.div
          className="grid auto-rows-fr gap-6 sm:grid-cols-2"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {SERVICES.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
