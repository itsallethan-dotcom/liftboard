import type { ReactNode } from "react";
import { NavBar } from "@/components/NavBar";
import { CaseStudyStatusBadge } from "@/components/CaseStudyStatusBadge";
import { SiteButton } from "@/components/SiteButton";
import { SiteLayout } from "@/components/SiteLayout";
import { SitePageHero } from "@/components/SitePageHero";
import { SitePanel } from "@/components/SitePanel";
import { SiteSection } from "@/components/SiteSection";
import { SiteSectionLabel } from "@/components/SiteSectionLabel";
import type { CaseStudy } from "@/lib/case-studies";

type CaseStudyDetailProps = {
  study: CaseStudy;
};

function BulletList({ items }: { items: readonly string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm leading-relaxed text-[#e0e0e0] sm:text-base">
          <span className="forgeonix-list-marker mt-1.5" aria-hidden>
            ◆
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function ProsePanel({ children }: { children: ReactNode }) {
  return (
    <SitePanel className="p-6 sm:p-8" hover={false}>
      <p className="text-base leading-relaxed text-[#e0e0e0] sm:text-lg">{children}</p>
    </SitePanel>
  );
}

export function CaseStudyDetail({ study }: CaseStudyDetailProps) {
  const heroActions = (
    <>
      <SiteButton href="/case-studies">All Case Studies</SiteButton>
      {study.relatedLinks?.map((link) => (
        <SiteButton
          key={link.href}
          href={link.href}
          variant={link.href.startsWith("http") ? "primary" : undefined}
        >
          {link.label}
        </SiteButton>
      ))}
      {study.externalUrl && !study.relatedLinks?.some((l) => l.href === study.externalUrl) ? (
        <SiteButton href={study.externalUrl} variant="primary">
          View Live Project
        </SiteButton>
      ) : null}
    </>
  );

  return (
    <SiteLayout themeClassName={study.themeClassName}>
      <NavBar activeHref="/case-studies" />
      <SitePageHero
        eyebrow={`${study.category} · ${study.statusLabel}`}
        title={study.title}
        description={study.summary}
        actions={heroActions}
      />

      <SiteSection>
        <div className="flex flex-wrap items-center gap-3">
          <CaseStudyStatusBadge badge={study.badge} />
          <span className="font-mono text-xs tracking-widest text-[#a0a0a0] uppercase">
            {study.category}
          </span>
        </div>
        <SiteSectionLabel>// OVERVIEW</SiteSectionLabel>
        <h2 className="text-3xl font-bold text-white">Project overview</h2>
        <div className="mt-6">
          <ProsePanel>{study.overview}</ProsePanel>
        </div>
      </SiteSection>

      <SiteSection className="bg-[#1e1e1e]/75">
        <SiteSectionLabel>// CHALLENGE</SiteSectionLabel>
        <h2 className="text-3xl font-bold text-white">The challenge</h2>
        <div className="mt-6">
          <ProsePanel>{study.challenge}</ProsePanel>
        </div>
      </SiteSection>

      <SiteSection>
        <SiteSectionLabel>// SOLUTION</SiteSectionLabel>
        <h2 className="text-3xl font-bold text-white">The solution</h2>
        <div className="mt-6">
          <ProsePanel>{study.solution}</ProsePanel>
        </div>
      </SiteSection>

      <SiteSection className="bg-[#1e1e1e]/75">
        <SiteSectionLabel>// STACK</SiteSectionLabel>
        <h2 className="text-3xl font-bold text-white">Technologies used</h2>
        <div className="mt-6 flex flex-wrap gap-2 sm:gap-3">
          {study.technologies.map((tech) => (
            <SitePanel
              key={tech}
              className="px-3 py-2 text-xs font-medium text-[#e0e0e0] sm:text-sm"
              hover={false}
            >
              {tech}
            </SitePanel>
          ))}
        </div>
      </SiteSection>

      <SiteSection>
        <SiteSectionLabel>// SCREENSHOTS</SiteSectionLabel>
        <h2 className="text-3xl font-bold text-white">Project visuals</h2>
        <p className="mt-3 max-w-3xl text-[#a0a0a0]">
          Screenshot placeholders — production captures will be added as assets are finalized.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((index) => (
            <SitePanel
              key={index}
              className="flex aspect-video items-center justify-center border border-dashed border-white/15 bg-[#141414]/60"
              hover={false}
            >
              <p className="font-mono text-xs tracking-widest text-[#6b7280] uppercase">
                Screenshot {index}
              </p>
            </SitePanel>
          ))}
        </div>
      </SiteSection>

      <SiteSection className="bg-[#1e1e1e]/75">
        <SiteSectionLabel>// LESSONS</SiteSectionLabel>
        <h2 className="text-3xl font-bold text-white">Lessons learned</h2>
        <SitePanel className="mt-6 p-6 sm:p-8" hover={false}>
          <BulletList items={study.lessonsLearned} />
        </SitePanel>
      </SiteSection>

      <SiteSection>
        <SiteSectionLabel>// OUTCOMES</SiteSectionLabel>
        <h2 className="text-3xl font-bold text-white">Results / outcomes</h2>
        <SitePanel className="mt-6 p-6 sm:p-8" hover={false}>
          <BulletList items={study.results} />
        </SitePanel>
      </SiteSection>

      <SiteSection className="bg-[#1e1e1e]/75">
        <SiteSectionLabel>// ROADMAP</SiteSectionLabel>
        <h2 className="text-3xl font-bold text-white">Future improvements</h2>
        <SitePanel className="mt-6 p-6 sm:p-8" hover={false}>
          <BulletList items={study.futureImprovements} />
        </SitePanel>
      </SiteSection>
    </SiteLayout>
  );
}
