"use client";

import { motion } from "framer-motion";
import { PanelCorners } from "@/components/PanelCorners";
import { SectionLabel } from "@/components/SectionLabel";
import {
  IconChart,
  IconCloud,
  IconCode,
  IconGear,
  IconNetwork,
  IconServer,
} from "@/components/section-icons";
import { playSound } from "@/lib/sounds";
import {
  fadeUp,
  staggerContainer,
  viewportOnce,
} from "@/lib/home-motion";

const CARD_CLASS =
  "forgeonix-card forgeonix-panel group relative flex h-full flex-col overflow-hidden rounded-sm bg-[#1c1c1c]/90 p-6 backdrop-blur-sm";

const SKILLS = [
  {
    icon: IconServer,
    title: "Infrastructure",
    items: ["Proxmox", "Docker", "Portainer", "Linux", "Windows Server"],
  },
  {
    icon: IconCloud,
    title: "Cloud & Identity",
    items: ["AWS EC2", "Entra ID", "Intune", "Active Directory"],
  },
  {
    icon: IconNetwork,
    title: "Networking",
    items: ["TCP/IP", "DNS", "DHCP", "VPN", "Tailscale"],
  },
  {
    icon: IconGear,
    title: "Automation",
    items: ["n8n", "PowerShell", "Scripts", "Workflows"],
  },
  {
    icon: IconChart,
    title: "Monitoring",
    items: ["Uptime Kuma", "Netdata", "Kaseya VSA", "NinjaOne"],
  },
  {
    icon: IconCode,
    title: "Development",
    items: ["Next.js", "React", "Supabase", "Tailwind", "Git"],
  },
] as const;

function SkillCard({
  icon: Icon,
  title,
  items,
}: {
  icon: typeof IconServer;
  title: string;
  items: readonly string[];
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
      <h3 className="mt-4 text-lg font-semibold text-[#e8e8e8]">{title}</h3>
      <ul className="mt-3 flex-1 space-y-1.5">
        {items.map((item) => (
          <li key={item} className="text-sm leading-relaxed text-[#a0a0a0]">
            {item}
          </li>
        ))}
      </ul>
    </motion.article>
  );
}

export function SkillsSection() {
  return (
    <section id="capabilities" className="relative bg-[#1a1a1a]/75 px-6 py-24 backdrop-blur-[2px]">
      <div className="mx-auto max-w-6xl">
        <SectionLabel>// CAPABILITIES</SectionLabel>

        <motion.div
          className="grid auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {SKILLS.map((skill) => (
            <SkillCard key={skill.title} {...skill} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
