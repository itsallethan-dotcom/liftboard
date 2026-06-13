import { CaseStudyDetail } from "@/components/CaseStudyDetail";
import { getCaseStudy, getCaseStudySlugs } from "@/lib/case-studies";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type CaseStudyPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getCaseStudySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);

  if (!study) {
    return { title: "Case Study Not Found | Forgeonix" };
  }

  return {
    title: `${study.title} | Case Study | Forgeonix`,
    description: study.summary,
  };
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const study = getCaseStudy(slug);

  if (!study) {
    notFound();
  }

  return <CaseStudyDetail study={study} />;
}
