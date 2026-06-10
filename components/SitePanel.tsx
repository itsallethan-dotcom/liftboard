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
  "forgeonix-card forgeonix-panel relative overflow-hidden rounded-sm bg-[#1c1c1c]/90 backdrop-blur-sm";

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
