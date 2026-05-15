import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AboutHero } from "@/components/about/AboutHero";
import { StatsSection } from "@/components/about/StatsSection";
import { MissionBento } from "@/components/about/MissionBento";
import { ValuesSection } from "@/components/about/ValuesSection";
import { TimelineSection } from "@/components/about/TimelineSection";
import { TeamSection } from "@/components/about/TeamSection";
import { TechSection } from "@/components/about/TechSection";
import { CTASection } from "@/components/about/CTASection";
import { ContactForm } from "@/components/about/ContactForm";

export const metadata = {
  title: "About DocTime — Tajikistan's #1 Healthcare Platform",
  description:
    "Learn about DocTime's mission to make quality healthcare accessible to every person in Tajikistan through technology, verified doctors, and real-time booking.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <AboutHero />
        <StatsSection />
        <MissionBento />
        <ValuesSection />
        <TimelineSection />
        <TeamSection />
        <TechSection />
        <CTASection />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}
