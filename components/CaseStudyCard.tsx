"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CaseStudyStatusBadge } from "@/components/CaseStudyStatusBadge";
import { PanelCorners } from "@/components/PanelCorners";
import { playSound } from "@/lib/sounds";
import type { CaseStudy } from "@/lib/case-studies";
import { fadeUp } from "@/lib/home-motion";

const CARD_CLASS =
  "forgeonix-card forgeonix-panel group relative flex h-full flex-col overflow-hidden rounded-sm bg-[#1c1c1c]/90 backdrop-blur-sm";

type CaseStudyCardProps = {
  study: CaseStudy;
};

export function CaseStudyCard({ study }: CaseStudyCardProps) {
  return (
    <motion.div variants={fadeUp} className="h-full min-h-0">
      <Link
        href={`/case-studies/${study.slug}`}
        className={`${CARD_CLASS} forgeonix-panel-interactive block p-6 sm:p-7`}
        aria-label={`View ${study.title} case study`}
        onMouseEnter={() => playSound("hover")}
        onClick={() => playSound("click")}
      >
        <PanelCorners />
        <div className="forgeonix-panel-accent-line" />
        <div className="flex flex-wrap items-center gap-2">
          <CaseStudyStatusBadge badge={study.badge} />
          <span className="font-mono text-[10px] tracking-widest text-[#a0a0a0] uppercase">
            {study.category}
          </span>
        </div>
        <h3 className="mt-4 text-xl font-semibold text-[#e8e8e8] transition-colors group-hover:text-white">
          {study.title}
        </h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-[#a0a0a0]">{study.summary}</p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {study.technologies.slice(0, 4).map((tech) => (
            <li
              key={tech}
              className="rounded-sm border border-white/10 bg-[#141414]/80 px-2 py-1 font-mono text-[10px] tracking-wide text-[#c0c0c0] uppercase"
            >
              {tech}
            </li>
          ))}
          {study.technologies.length > 4 ? (
            <li className="px-1 py-1 text-[10px] text-[#a0a0a0]">
              +{study.technologies.length - 4} more
            </li>
          ) : null}
        </ul>
        <span className="forgeonix-panel-arrow mt-6 inline-block text-sm">View case study →</span>
      </Link>
    </motion.div>
  );
}
