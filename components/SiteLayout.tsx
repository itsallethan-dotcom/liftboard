import { CommandCenterBackground } from "@/components/CommandCenterBackground";
import { SiteFooter } from "@/components/SiteFooter";

type SiteLayoutProps = {
  children: React.ReactNode;
  showFooter?: boolean;
  themeClassName?: string;
};

export function SiteLayout({
  children,
  showFooter = true,
  themeClassName,
}: SiteLayoutProps) {
  const rootClass = ["forgeonix-site", "min-h-screen", "bg-[#1a1a1a]", "text-[#e0e0e0]", themeClassName]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClass}>
      <CommandCenterBackground />
      <div className="relative z-10">{children}</div>
      {showFooter ? <SiteFooter /> : null}
    </div>
  );
}
