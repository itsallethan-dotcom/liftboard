import Link from "next/link";
import type { ReactNode } from "react";
import { PanelCorners } from "@/components/PanelCorners";

type SitePanelProps = {
  children: ReactNode;
  className?: string;
  href?: string;
  hover?: boolean;
};

const PANEL_CLASS =
  "forgeonix-card forgeonix-panel relative overflow-hidden rounded-md bg-gradient-to-b from-[#191d28]/85 to-[#12151d]/92 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-md";

export function SitePanel({
  children,
  className = "",
  href,
  hover = true,
}: SitePanelProps) {
  const hoverClass = hover ? "forgeonix-panel-interactive" : "";
  const composed = `${PANEL_CLASS} ${hoverClass} ${className}`.trim();

  const inner = (
    <>
      <PanelCorners />
      <div className="forgeonix-panel-accent-line" />
      {children}
    </>
  );

  if (href) {
    const isExternal = href.startsWith("http");
    if (isExternal) {
      return (
        <a
          href={href}
          className={`${composed} block`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {inner}
        </a>
      );
    }
    return (
      <Link href={href} className={`${composed} block`}>
        {inner}
      </Link>
    );
  }

  return <div className={composed}>{inner}</div>;
}
