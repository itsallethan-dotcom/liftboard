import { NavBar } from "@/components/NavBar";
import { CaseStudyGrid } from "@/components/CaseStudyGrid";
import { SiteButton } from "@/components/SiteButton";
import { SiteLayout } from "@/components/SiteLayout";
import { SitePageHero } from "@/components/SitePageHero";
import { SiteSection } from "@/components/SiteSection";
import { SiteSectionLabel } from "@/components/SiteSectionLabel";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case Studies | Forgeonix",
  description:
    "Real projects, infrastructure, troubleshooting, and solutions built through hands-on experience.",
};

export default function CaseStudiesPage() {
  return (
    <SiteLayout>
      <NavBar activeHref="/case-studies" />
      <SitePageHero
        eyebrow="Portfolio · Engineering"
        title="Case Studies"
        description="Real projects, infrastructure, troubleshooting, and solutions built through hands-on experience."
        actions={
          <>
            <SiteButton href="/">Back Home</SiteButton>
            <SiteButton href="/infrastructure">View Infrastructure</SiteButton>
            <SiteButton href="/troubleshooting">View Troubleshooting</SiteButton>
            <SiteButton href="/resume">View Resume</SiteButton>
          </>
        }
      />

      <SiteSection>
        <SiteSectionLabel>// FEATURED</SiteSectionLabel>
        <h2 className="text-3xl font-bold text-white">Featured work</h2>
        <p className="mt-3 max-w-3xl text-[#a0a0a0]">
          Production deployments, active builds, infrastructure labs, and enterprise operations —
          documented with context, constraints, and outcomes.
        </p>
        <CaseStudyGrid />
      </SiteSection>
    </SiteLayout>
  );
}
