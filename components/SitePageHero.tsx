import type { ReactNode } from "react";

type SitePageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
};

export function SitePageHero({
  eyebrow,
  title,
  description,
  actions,
}: SitePageHeroProps) {
  return (
    <section className="relative overflow-hidden px-6 pt-28 pb-16 md:pt-32 md:pb-20">
      <div className="forgeonix-hero-glow pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative z-10 mx-auto max-w-6xl text-left">
        <p className="forgeonix-hero-eyebrow">
          {eyebrow}
        </p>
        <h1 className="forgeonix-metallic-text max-w-4xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl md:text-7xl">
          {title}
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[#a0a0a0] sm:text-xl">
          {description}
        </p>
        {actions ? <div className="mt-10 flex flex-wrap gap-4">{actions}</div> : null}
      </div>
    </section>
  );
}
