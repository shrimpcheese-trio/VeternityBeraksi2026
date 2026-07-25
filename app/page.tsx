import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { PromoBanner } from "@/components/landing/promo-banner";
import { TrendingServices } from "@/components/landing/trending-services";
import { AboutUs } from "@/components/landing/about-us";
import { SuccessStories } from "@/components/landing/success-stories";
import { Pricing } from "@/components/landing/pricing";
import { Faq } from "@/components/landing/faq";
import { FinalCta } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";
import { FadeIn } from "@/components/landing/fade-in";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <FadeIn><Hero /></FadeIn>
      <FadeIn><PromoBanner /></FadeIn>
      <FadeIn><TrendingServices /></FadeIn>
      <FadeIn><AboutUs /></FadeIn>
      <FadeIn><SuccessStories /></FadeIn>
      <FadeIn><Pricing /></FadeIn>
      <FadeIn><Faq /></FadeIn>
      <FadeIn><FinalCta /></FadeIn>
      <Footer />
    </>
  );
}
