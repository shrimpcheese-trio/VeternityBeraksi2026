import { Navbar } from "@/components/sections/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { InsightSection } from "@/components/sections/InsightSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { CommunityVerificationSection } from "@/components/sections/CommunityVerificationSection";
import { CoreFeaturesSection } from "@/components/sections/CoreFeaturesSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { EmployersSection } from "@/components/sections/EmployersSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { CtaSection } from "@/components/sections/CtaSection";
import { Footer } from "@/components/sections/Footer";
import { ScrollHighlightStatement } from "@/components/shared/ScrollHighlightStatement";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <InsightSection />
        <ScrollHighlightStatement />
        <HowItWorksSection />
        <CommunityVerificationSection />
        <CoreFeaturesSection />
        <TestimonialsSection />
        <EmployersSection />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
