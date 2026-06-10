"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { playSound } from "@/lib/sounds";
import { easeOut } from "@/lib/home-motion";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/#projects" },
  { label: "Infrastructure", href: "/infrastructure" },
  { label: "Troubleshooting", href: "/troubleshooting" },
  { label: "Resume", href: "/resume" },
] as const;

type NavBarProps = {
  activeHref?: string;
  showCta?: boolean;
};

function NavLink({
  href,
  label,
  isActive,
  onNavigate,
}: {
  href: string;
  label: string;
  isActive: boolean;
  onNavigate?: () => void;
}) {
  const isAnchor = href.includes("#");

  const content = (
    <>
      <span
        className={`relative z-10 transition-colors duration-300 ${isActive ? "text-white" : "group-hover:text-white"}`}
      >
        {label}
      </span>
      <motion.span
        className="absolute bottom-0 left-0 h-px w-full origin-left bg-gradient-to-r from-[#c0c0c0] to-[#e8e8e8]"
        initial={{ scaleX: isActive ? 1 : 0 }}
        animate={{ scaleX: isActive ? 1 : 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.4, ease: easeOut }}
      />
    </>
  );

  const className = `group relative px-3 py-2 text-sm tracking-wide transition-colors ${
    isActive ? "text-white" : "text-[#c0c0c0]"
  }`;

  const handlers = {
    onMouseEnter: () => playSound("hover"),
    onClick: () => {
      playSound("click");
      onNavigate?.();
    },
  };

  if (isAnchor) {
    return (
      <a href={href} className={className} {...handlers}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={className} {...handlers}>
      {content}
    </Link>
  );
}

export function NavBar({ activeHref, showCta = true }: NavBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const resolvedActive = activeHref ?? pathname;
  const projectsHref = pathname === "/" ? "#projects" : "/#projects";

  const closeMenu = () => setMenuOpen(false);

  const links = NAV_LINKS.map((link) =>
    link.label === "Projects" ? { ...link, href: projectsHref } : link,
  );

  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-b border-white/[0.08] bg-[rgba(18,18,18,0.85)] backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-3"
          onClick={() => playSound("click")}
        >
          <Image
            src="/forgeonix-logo-transparent.png"
            alt="Forgeonix"
            width={36}
            height={36}
            className="h-9 w-9 object-contain"
            priority
          />
          <span className="text-sm font-semibold tracking-[0.25em] text-[#c0c0c0] uppercase">
            Forgeonix
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.label}
              href={link.href}
              label={link.label}
              isActive={resolvedActive === link.href}
            />
          ))}
          {showCta ? (
            <Link
              href="/leaderboard"
              className="forgeonix-nav-cta forgeonix-btn-ghost rounded-sm border px-3 py-2 text-sm font-semibold tracking-wide transition-all duration-500"
              onMouseEnter={() => playSound("hover")}
              onClick={() => playSound("click")}
            >
              Open Leaderboard
            </Link>
          ) : null}
        </div>

        <button
          type="button"
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => {
            playSound("click");
            setMenuOpen((open) => !open);
          }}
        >
          <span
            className={`block h-0.5 w-5 bg-[#c0c0c0] transition-transform duration-300 ${menuOpen ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`block h-0.5 w-5 bg-[#c0c0c0] transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block h-0.5 w-5 bg-[#c0c0c0] transition-transform duration-300 ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="border-t border-white/[0.08] bg-[rgba(18,18,18,0.95)] backdrop-blur-md md:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: easeOut }}
          >
            <div className="flex flex-col px-6 py-4">
              {links.map((link) => (
                <NavLink
                  key={link.label}
                  href={link.href}
                  label={link.label}
                  isActive={resolvedActive === link.href}
                  onNavigate={closeMenu}
                />
              ))}
              {showCta ? (
                <Link
                  href="/leaderboard"
                  className="forgeonix-nav-cta-mobile"
                  onClick={() => {
                    playSound("click");
                    closeMenu();
                  }}
                >
                  Open Leaderboard
                </Link>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
