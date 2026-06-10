"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SectionLabel } from "@/components/SectionLabel";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/home-motion";

const FACTS = [
  "5+ years hands-on IT support and systems troubleshooting",
  "Ransomware recovery and endpoint remediation experience",
  "Homelab builder — Proxmox, Docker, monitoring, automation",
  "CompTIA A+, Network+, and Security+ certified",
] as const;

function ChevronBullet() {
  return (
    <svg
      className="mt-1 h-3 w-3 shrink-0 text-[#c0c0c0]"
      viewBox="0 0 12 12"
      fill="currentColor"
      aria-hidden
    >
      <path d="M4 2l4 4-4 4V2z" />
    </svg>
  );
}

export function AboutSection() {
  return (
    <section
      id="about"
      className="border-t border-white/[0.06] bg-[#1e1e1e] px-6 py-24"
    >
      <div className="mx-auto max-w-6xl">
        <SectionLabel>// ABOUT</SectionLabel>

        <motion.div
          className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <motion.div
            className="flex justify-center"
            variants={fadeUp}
          >
            <div className="forgeonix-logo-glow relative">
              <Image
                src="/forgeonix-logo-transparent.png"
                alt="Forgeonix logo"
                width={280}
                height={280}
                className="h-48 w-48 object-contain sm:h-64 sm:w-64"
              />
            </div>
          </motion.div>

          <motion.div variants={fadeUp}>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Ethan Edwards
            </h2>
            <p className="mt-2 text-lg text-[#c0c0c0]">
              IT Support & Systems Builder
            </p>
            <ul className="mt-8 space-y-4">
              {FACTS.map((fact) => (
                <li
                  key={fact}
                  className="flex items-start gap-3 text-[#e0e0e0]"
                >
                  <ChevronBullet />
                  <span className="leading-relaxed">{fact}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
