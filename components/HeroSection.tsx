"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ParticleBackground } from "@/components/ParticleBackground";
import { playSound } from "@/lib/sounds";
import {
  easeOut,
  fadeUp,
  fadeUpScale,
  staggerContainer,
  viewportOnce,
} from "@/lib/home-motion";

export function HeroSection() {
  const hasPlayedTransition = useRef(false);

  return (
    <motion.section
      id="top"
      className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden px-6 pt-20"
      onViewportEnter={() => {
        if (!hasPlayedTransition.current) {
          hasPlayedTransition.current = true;
          playSound("transition");
        }
      }}
      viewport={viewportOnce}
    >
      <div className="forgeonix-hero-glow pointer-events-none absolute inset-0 z-0" aria-hidden />
      <ParticleBackground />

      <motion.div
        className="relative z-10 mx-auto w-full max-w-4xl text-center"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.p
          className="mb-6 text-xs tracking-[0.35em] text-[#c0c0c0] uppercase"
          variants={fadeUp}
        >
          Systems • Infrastructure • Automation
        </motion.p>

        <motion.h1
          className="forgeonix-metallic-text text-6xl font-bold tracking-tight sm:text-8xl lg:text-9xl"
          variants={fadeUpScale}
        >
          FORGEONIX
        </motion.h1>

        <motion.p
          className="mt-6 text-lg text-[#e0e0e0] sm:text-xl"
          variants={fadeUp}
        >
          Ethan Edwards — IT Support & Systems Builder
        </motion.p>

        <motion.p
          className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[#a0a0a0]"
          variants={fadeUp}
        >
          Systems-focused professional specializing in troubleshooting,
          infrastructure, and production-ready deployments.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
          variants={fadeUp}
        >
          <a
            href="#projects"
            className="forgeonix-btn-primary rounded border border-transparent px-6 py-3 text-sm font-semibold tracking-wide transition-all duration-500"
            onClick={() => playSound("click")}
          >
            View Projects
          </a>
          <Link
            href="/resume"
            className="forgeonix-btn-ghost rounded border border-white/20 px-6 py-3 text-sm font-semibold tracking-wide text-[#9aa0aa] transition-all duration-500"
            onClick={() => playSound("click")}
          >
            Download Resume
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="text-[#a0a0a0]"
          aria-hidden
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
