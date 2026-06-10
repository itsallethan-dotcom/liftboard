import type { ReactNode } from "react";

type SiteSectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
};

export function SiteSection({ children, className = "", id }: SiteSectionProps) {
  return (
    <section
      id={id}
      className={`relative border-t border-white/[0.06] bg-[#1a1a1a]/75 px-6 py-20 backdrop-blur-[2px] ${className}`}
    >
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}
