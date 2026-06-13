"use client";

import { motion } from "framer-motion";
import { CaseStudyCard } from "@/components/CaseStudyCard";
import { CASE_STUDIES } from "@/lib/case-studies";
import { staggerContainer, viewportOnce } from "@/lib/home-motion";

export function CaseStudyGrid() {
  return (
    <motion.div
      className="mt-10 grid auto-rows-fr gap-6 md:grid-cols-2"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
    >
      {CASE_STUDIES.map((study) => (
        <CaseStudyCard key={study.slug} study={study} />
      ))}
    </motion.div>
  );
}
