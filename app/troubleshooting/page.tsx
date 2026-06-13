import { NavBar } from "@/components/NavBar";
import { SiteButton } from "@/components/SiteButton";
import { SiteLayout } from "@/components/SiteLayout";
import { SitePageHero } from "@/components/SitePageHero";
import { SitePanel } from "@/components/SitePanel";
import { SiteSection } from "@/components/SiteSection";
import { SiteSectionLabel } from "@/components/SiteSectionLabel";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Troubleshooting & Problem Solving | Forgeonix",
  description:
    "Real-world debugging across systems, infrastructure, and applications — diagnosis, root cause, resolution, and verification.",
};

function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <p className="forgeonix-field-label">
      <span aria-hidden className="forgeonix-field-label-dot" />
      {children}
    </p>
  );
}

export default function TroubleshootingPage() {
  return (
    <SiteLayout themeClassName="forgeonix-theme-diagnostics">
      <NavBar activeHref="/troubleshooting" />
      <SitePageHero
        eyebrow="Case studies · Debugging"
        title="Troubleshooting & Problem Solving"
        description="Real-world issues I've diagnosed and resolved across systems, infrastructure, and applications."
        actions={
          <>
            <SiteButton href="/">Back Home</SiteButton>
            <SiteButton href="/infrastructure">View Infrastructure</SiteButton>
            <SiteButton href="https://liftboard.forgeonix.dev" variant="primary">
              Open Leaderboard
            </SiteButton>
          </>
        }
      />

      <SiteSection>
        <SiteSectionLabel>// CASE STUDIES</SiteSectionLabel>
        <h2 className="text-3xl font-bold text-white">Case studies</h2>
        <p className="mt-3 max-w-3xl text-[#a0a0a0]">
          Structured breakdowns: environment, symptoms, root cause, fix, and verified
          outcome.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <CaseCard
            title="Docker Service Unreachable in Portainer"
            environment="Docker (LXC / VM), Portainer"
            symptoms={['"Local environment unreachable"', "Containers not responding"]}
            rootCause="Docker daemon / networking misconfiguration inside container"
            resolution={[
              "Adjusted container configuration",
              "Restarted Docker service",
              "Verified connectivity",
            ]}
            result="Services restored and accessible"
          />
          <CaseCard
            title="Supabase Profile Creation Failing"
            environment="Next.js, Supabase"
            symptoms={[
              "New users unable to complete signup",
              "Insert errors on profile creation",
            ]}
            rootCause="Row Level Security (RLS) blocking inserts"
            resolution={[
              "Implemented ensureProfileRow logic",
              "Adjusted policies to allow user-scoped insert",
            ]}
            result="Successful user onboarding and profile creation"
          />
          <CaseCard
            title="Tailwind Build Failure (Cannot Resolve Module)"
            environment="Next.js, TailwindCSS"
            symptoms={[`Build error: "Can't resolve tailwindcss"`]}
            rootCause="Incorrect project root resolution with Turbopack"
            resolution={[
              "Fixed project root configuration",
              "Verified dependencies and config files",
            ]}
            result="Successful production build"
          />
          <CaseCard
            title="Email Deliverability & Authentication Setup"
            environment="Custom domain email (Zoho), DNS"
            symptoms={["Emails flagged or untrusted", "Missing authentication records"]}
            rootCause="No DMARC policy + incomplete DNS setup"
            resolution={[
              "Configured SPF, DKIM, and DMARC",
              "Monitored reports and moved toward enforcement",
            ]}
            result="Improved deliverability and domain trust"
          />
          <CaseCard
            title="Host Validation / Access Issues in Local Services"
            environment="Docker, reverse proxy / local networking"
            symptoms={["Services accessible locally but failing via domain"]}
            rootCause="Host validation / DNS routing mismatch"
            resolution={["Adjusted host configuration", "Verified DNS and service routing"]}
            result="Stable and consistent access"
          />
        </div>
      </SiteSection>

      <SiteSection className="bg-[#1e1e1e]/75">
        <SiteSectionLabel>// METHODOLOGY</SiteSectionLabel>
        <h2 className="text-3xl font-bold text-white">How I approach problems</h2>
        <p className="mt-3 max-w-3xl text-[#a0a0a0]">
          Repeatable workflow—evidence first, then targeted change.
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <ApproachCard text="Reproduce the issue" />
          <ApproachCard text="Check logs and timestamps" />
          <ApproachCard text="Isolate variables" />
          <ApproachCard text="Identify root cause (not symptoms)" />
          <ApproachCard text="Apply targeted fix" />
          <ApproachCard text="Verify and document" />
        </div>
      </SiteSection>
    </SiteLayout>
  );
}

function CaseCard({
  title,
  environment,
  symptoms,
  rootCause,
  resolution,
  result,
}: {
  title: string;
  environment: string;
  symptoms: string[];
  rootCause: string;
  resolution: string[];
  result: string;
}) {
  return (
    <SitePanel className="p-6 lg:p-7">
      <h3 className="text-xl font-semibold leading-snug text-[#e8e8e8]">{title}</h3>
      <FieldLabel>Environment</FieldLabel>
      <p className="mt-2 text-sm text-[#e0e0e0]">{environment}</p>
      <FieldLabel>Symptoms</FieldLabel>
      <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-[#a0a0a0]">
        {symptoms.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      <FieldLabel>Root cause</FieldLabel>
      <p className="mt-2 text-sm text-[#e0e0e0]">{rootCause}</p>
      <FieldLabel>Resolution</FieldLabel>
      <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-[#a0a0a0]">
        {resolution.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>
      <FieldLabel>Result</FieldLabel>
      <p className="mt-2 text-sm font-medium text-[#e8e8e8]">{result}</p>
    </SitePanel>
  );
}

function ApproachCard({ text }: { text: string }) {
  return (
    <SitePanel className="flex items-start gap-3 px-4 py-3 text-sm text-[#e0e0e0]">
      <span className="forgeonix-accent-dot" aria-hidden />
      <span>{text}</span>
    </SitePanel>
  );
}
