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
      ? "forgeonix-btn-primary inline-block rounded-sm border border-transparent px-6 py-3 text-sm font-semibold tracking-wide transition-all duration-500"
      : "forgeonix-btn-ghost inline-block rounded-sm border border-white/20 px-6 py-3 text-sm font-semibold tracking-wide text-[#9aa0aa] transition-all duration-500";

  if (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("#")) {
    return (
      <a
        href={href}
        className={className}
        download={download}
        {...(href.startsWith("http")
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
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
