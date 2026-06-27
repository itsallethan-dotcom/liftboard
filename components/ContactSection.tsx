"use client";

import { motion } from "framer-motion";
import { SectionLabel } from "@/components/SectionLabel";
import { playSound } from "@/lib/sounds";
import { easeOut, fadeUp, viewportOnce } from "@/lib/home-motion";

export function ContactSection() {
  return (
    <section id="contact" className="relative overflow-hidden bg-[#14161e] px-6 py-28">
      {/* CTA atmosphere — dual ember+blue glow */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 40% 55% at 32% 50%, rgba(255,122,54,0.10), transparent 62%), radial-gradient(ellipse 40% 55% at 70% 50%, rgba(45,125,255,0.08), transparent 64%)",
        }}
      />
      <div className="relative mx-auto max-w-3xl text-center">
        <SectionLabel>// CONTACT</SectionLabel>

        <motion.div
          className="mx-auto mb-10 h-px w-32 bg-gradient-to-r from-[#ff7a36]/0 via-[#ff7a36]/80 to-[#2d7dff]/0"
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
            className="forgeonix-btn-primary rounded border border-transparent px-6 py-3 text-sm font-semibold tracking-wide transition-all duration-500"
            onClick={() => playSound("click")}
          >
            ethan@forgeonix.dev
          </a>
          <a
            href="https://www.linkedin.com/in/ethan-edwards-948934187/"
            target="_blank"
            rel="noopener noreferrer"
            className="forgeonix-btn-ghost rounded border border-white/20 px-6 py-3 text-sm font-semibold tracking-wide text-[#9aa0aa] transition-all duration-500"
            onClick={() => playSound("click")}
          >
            LinkedIn
          </a>
        </motion.div>
      </div>
    </section>
  );
}
