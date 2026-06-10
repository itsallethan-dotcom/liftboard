import Link from "next/link";
import type { ReactNode } from "react";

type SiteButtonProps = {
  children: ReactNode;
  href: string;
  variant?: "primary" | "ghost";
  download?: string;
};

export function SiteButton({
  children,
  href,
  variant = "ghost",
  download,
}: SiteButtonProps) {
  const className =
    variant === "primary"
      ? "forgeonix-btn-primary rounded-sm border border-[#c0c0c0] px-6 py-3 text-sm font-semibold tracking-wide text-[#e8e8e8] transition-all duration-500"
      : "forgeonix-btn-ghost rounded-sm border border-white/20 px-6 py-3 text-sm font-semibold tracking-wide text-[#c0c0c0] transition-all duration-500";

  if (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("#")) {
    return (
      <a href={href} className={className} download={download}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} download={download}>
      {children}
    </Link>
  );
}
