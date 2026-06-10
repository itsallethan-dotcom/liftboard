"use client";

import { motion } from "framer-motion";
import { fadeUp, viewportOnce } from "@/lib/home-motion";

type SectionLabelProps = {
  children: string;
};

export function SectionLabel({ children }: SectionLabelProps) {
  return (
    <motion.p
      className="mb-8 font-mono text-xs tracking-widest text-[#a0a0a0] uppercase"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
    >
      {children}
    </motion.p>
  );
}
