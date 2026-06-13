import type { Metadata } from "next";
import Link from "next/link";
import { NavBar } from "@/components/NavBar";
import { SiteButton } from "@/components/SiteButton";
import { SiteLayout } from "@/components/SiteLayout";
import { SitePageHero } from "@/components/SitePageHero";
import { SitePanel } from "@/components/SitePanel";
import { SiteSection } from "@/components/SiteSection";
import { SiteSectionLabel } from "@/components/SiteSectionLabel";

export const metadata: Metadata = {
  title: "Workout Leaderboard | Forgeonix",
  description:
    "Live gym leaderboards that drive competition with member rankings, team challenges, and PR tracking.",
};

const features = [
  {
    title: "Live leaderboard",
    text: "Auto-updated rankings based on workout volume and top lifts.",
  },
  {
    title: "Team competitions",
    text: "Run team-vs-team challenges with clear standings for coaches and members.",
  },
  {
    title: "Personal records tracking",
    text: "Highlight PR progress while keeping every workout entry structured and visible.",
  },
  {
    title: "Simple gym setup",
    text: "Set up members, teams, and gyms quickly without complicated onboarding.",
  },
];

const steps = [
  "Members log workouts",
  "System calculates volume & rankings",
  "Leaderboard updates instantly",
  "Gyms run challenges effortlessly",
];

const useCases = ["Gyms", "Personal trainers", "CrossFit-style competitions", "Small teams"];

const previewRows = [
  { rank: "#1", name: "A. Carter", volume: "52,340", bestLift: "315" },
  { rank: "#2", name: "M. Brooks", volume: "49,720", bestLift: "335" },
  { rank: "#3", name: "S. Nguyen", volume: "48,110", bestLift: "295" },
];

export default function LeaderboardLandingPage() {
  return (
    <SiteLayout>
      <NavBar activeHref="/leaderboard" showCta={false} />
      <SitePageHero
        eyebrow="Workout Leaderboard"
        title="Live Gym Leaderboards That Drive Competition"
        description="Track workouts, rank members, and run challenges that keep people coming back."
        actions={
          <>
            <SiteButton href="https://liftboard.forgeonix.dev" variant="primary">
              Try Demo
            </SiteButton>
            <SiteButton href="/login">Log In</SiteButton>
            <SiteButton href="/signup">Sign Up</SiteButton>
          </>
        }
      />

      <SiteSection>
        <SiteSectionLabel>// FEATURES</SiteSectionLabel>
        <h2 className="text-3xl font-bold text-white">What It Does</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {features.map((feature) => (
            <SitePanel key={feature.title} className="p-5">
              <h3 className="text-lg font-semibold text-[#e8e8e8]">{feature.title}</h3>
              <p className="mt-2 text-sm text-[#a0a0a0]">{feature.text}</p>
            </SitePanel>
          ))}
        </div>
      </SiteSection>

      <SiteSection className="bg-[#1e1e1e]/75">
        <SiteSectionLabel>// WORKFLOW</SiteSectionLabel>
        <h2 className="text-3xl font-bold text-white">How It Works</h2>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {steps.map((step, index) => (
            <SitePanel key={step} className="p-4">
              <p className="font-mono text-xs font-semibold tracking-wider text-[#a5f3fc]/90 uppercase">
                Step {index + 1}
              </p>
              <p className="mt-2 text-[#e0e0e0]">{step}</p>
            </SitePanel>
          ))}
        </div>
      </SiteSection>

      <SiteSection>
        <SiteSectionLabel>// PREVIEW</SiteSectionLabel>
        <h2 className="text-3xl font-bold text-white">Preview the Leaderboard Experience</h2>
        <SitePanel className="mt-6 p-4" hover={false}>
          <div className="rounded-sm border border-white/[0.06] bg-[#141414]/80 p-3">
            <div className="grid grid-cols-4 border-b border-white/[0.06] px-2 py-2 font-mono text-xs font-semibold tracking-wide text-[#a0a0a0] uppercase">
              <span>Rank</span>
              <span>Athlete</span>
              <span>Total Volume</span>
              <span>Best Lift</span>
            </div>
            {previewRows.map((row) => (
              <div
                key={row.rank}
                className="grid grid-cols-4 border-b border-white/[0.04] px-2 py-2 text-sm text-[#e0e0e0] last:border-0"
              >
                <span>{row.rank}</span>
                <span>{row.name}</span>
                <span>{row.volume}</span>
                <span>{row.bestLift}</span>
              </div>
            ))}
          </div>
        </SitePanel>
      </SiteSection>

      <SiteSection className="bg-[#1e1e1e]/75">
        <SiteSectionLabel>// USE CASES</SiteSectionLabel>
        <h2 className="text-3xl font-bold text-white">Use Cases</h2>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {useCases.map((item) => (
            <SitePanel key={item} className="px-4 py-3 text-[#e0e0e0]">
              {item}
            </SitePanel>
          ))}
        </div>
      </SiteSection>

      <SiteSection>
        <SitePanel className="p-8" hover={false}>
          <SiteSectionLabel>// GET STARTED</SiteSectionLabel>
          <h2 className="text-3xl font-bold text-white">Ready to start a challenge?</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            <SiteButton href="https://liftboard.forgeonix.dev" variant="primary">
              Try Demo
            </SiteButton>
            <SiteButton href="/signup">Create Account</SiteButton>
            <Link
              href="/"
              className="forgeonix-btn-ghost rounded-sm border border-white/20 px-5 py-2.5 text-sm font-semibold tracking-wide text-[#c0c0c0] transition-all duration-500 hover:border-[#67e8f9]/40 hover:text-white"
            >
              Back to Forgeonix
            </Link>
          </div>
        </SitePanel>
      </SiteSection>
    </SiteLayout>
  );
}
