"use client";

import { motion } from "framer-motion";
import { SectionLabel } from "@/components/SectionLabel";
import { playSound } from "@/lib/sounds";
import { easeOut, fadeUp, viewportOnce } from "@/lib/home-motion";

export function ContactSection() {
  return (
    <section id="contact" className="bg-[#1e1e1e] px-6 py-24">
      <div className="mx-auto max-w-3xl text-center">
        <SectionLabel>// CONTACT</SectionLabel>

        <motion.div
          className="mx-auto mb-10 h-px w-32 bg-gradient-to-r from-transparent via-[#c0c0c0] to-transparent"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 0.6, ease: easeOut }}
        />

        <motion.h2
          className="text-4xl font-bold text-white sm:text-5xl"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          Let&apos;s Build Something.
        </motion.h2>

        <motion.p
          className="mx-auto mt-4 max-w-xl text-[#a0a0a0]"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          Available for consulting, freelance projects, and collaboration.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <a
            href="mailto:ethan@forgeonix.dev"
            className="forgeonix-btn-primary rounded border border-[#c0c0c0] px-6 py-3 text-sm font-semibold tracking-wide text-[#e8e8e8] transition-all duration-500"
            onClick={() => playSound("click")}
          >
            ethan@forgeonix.dev
          </a>
          <a
            href="https://www.linkedin.com/in/ethan-edwards-948934187/"
            target="_blank"
            rel="noopener noreferrer"
            className="forgeonix-btn-ghost rounded border border-white/20 px-6 py-3 text-sm font-semibold tracking-wide text-[#c0c0c0] transition-all duration-500 hover:border-[#c0c0c0] hover:text-white"
            onClick={() => playSound("click")}
          >
            LinkedIn
          </a>
        </motion.div>
      </div>
    </section>
  );
}
