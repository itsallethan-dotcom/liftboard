import type { CaseStudyBadge } from "@/lib/case-studies";

const BADGE_CLASS: Record<CaseStudyBadge, string> = {
  Live: "forgeonix-case-badge forgeonix-case-badge--live",
  "In Progress": "forgeonix-case-badge forgeonix-case-badge--progress",
  Completed: "forgeonix-case-badge forgeonix-case-badge--completed",
  Ongoing: "forgeonix-case-badge forgeonix-case-badge--ongoing",
};

type CaseStudyStatusBadgeProps = {
  badge: CaseStudyBadge;
};

export function CaseStudyStatusBadge({ badge }: CaseStudyStatusBadgeProps) {
  return <span className={BADGE_CLASS[badge]}>{badge}</span>;
}
