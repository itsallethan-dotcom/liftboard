import { AboutSection } from "@/components/AboutSection";
import { ContactSection } from "@/components/ContactSection";
import { HeroSection } from "@/components/HeroSection";
import { NavBar } from "@/components/NavBar";
import { ProjectsSection } from "@/components/ProjectsSection";
import { ServicesSection } from "@/components/ServicesSection";
import { SkillsSection } from "@/components/SkillsSection";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteLayout } from "@/components/SiteLayout";

export default function Home() {
  return (
    <SiteLayout showFooter={false}>
      <NavBar activeHref="/" />
      <main>
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <ServicesSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </SiteLayout>
  );
}
