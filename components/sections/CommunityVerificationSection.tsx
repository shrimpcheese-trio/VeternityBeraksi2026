"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Check, CheckCircle2, ArrowRight } from "lucide-react";
import { BlurReveal, PopReveal, StaggerContainer, StaggerItem, StaggerTextContainer, SplitText } from "@/components/ui/motion";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards, Autoplay } from "swiper/modules";
import { useTranslations } from "next-intl";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-cards";

type CommunityTestimonial = {
  quote: string;
  name: string;
  role: string;
  location: string;
  image: string;
};

export function CommunityVerificationSection() {
  const t = useTranslations("community");
  const testimonials = t.raw("testimonials") as CommunityTestimonial[];
  const benefits = t.raw("benefits") as string[];
  return (
    <section id="untuk-pekerja" className="bg-white py-24 md:py-32 lg:py-40 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1200px]">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Left: Swiper Cards */}
          <BlurReveal className="order-2 lg:order-1 relative w-full flex justify-center perspective-1000">
            <Swiper
              effect={"cards"}
              grabCursor={true}
              modules={[EffectCards, Autoplay]}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
              }}
              speed={600}
              cardsEffect={{
                perSlideOffset: 12,
                perSlideRotate: 3,
                rotate: true,
                slideShadows: false,
              }}
              loop={true}
              className="w-full max-w-[320px] sm:max-w-[420px] md:max-w-[460px] !overflow-visible"
            >
              {[...testimonials, ...testimonials].map((testi, idx) => (
                <SwiperSlide key={idx} className="!rounded-[28px] overflow-hidden">
                  <div className="bg-white rounded-[28px] p-6 sm:p-8 md:p-10 lg:p-12 border border-border/60 shadow-[0_15px_40px_rgba(0,0,0,0.04)] min-h-[480px] sm:min-h-[550px] h-full flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1 relative">

                    {/* Subtle top gradient accent */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-navy/10 to-transparent"></div>

                    <div>
                      {/* Badge */}
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#10B981]/5 border border-[#10B981]/10 mb-6 sm:mb-8">
                        <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#10B981]" />
                        <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-widest text-navy">
                          {t("badge")}
                        </span>
                      </div>

                      {/* Quote */}
                      <blockquote className="text-lg sm:text-xl md:text-[28px] font-heading font-medium text-navy leading-[1.5] tracking-tight mb-8 sm:mb-10">
                        "{testi.quote}"
                      </blockquote>
                    </div>

                    {/* Profile */}
                    <div className="flex items-center gap-3 sm:gap-4 pt-5 sm:pt-6 border-t border-border/50">
                      <div className="relative">
                        <img
                          src={testi.image}
                          alt={t("photoAlt", { name: testi.name })}
                          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover shrink-0 grayscale contrast-125 opacity-90"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                          <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 bg-[#10B981] rounded-full border border-white"></div>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <p className="text-sm sm:text-base font-bold text-navy">{testi.name}</p>
                        <p className="text-xs sm:text-sm text-text-muted mt-0.5">{testi.role}, {testi.location}</p>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </BlurReveal>

          {/* Right: Modern Typography & Copy */}
          <div className="flex flex-col justify-center order-1 lg:order-2 lg:pl-8">

            {/* Label */}
            <PopReveal delay={0.1} className="mb-8">
              <div className="inline-flex self-start items-center px-3.5 py-1.5 rounded-full bg-navy/5 border border-navy/10 text-[10px] font-bold uppercase tracking-widest text-navy">
                {t("label")}
              </div>
            </PopReveal>

            {/* Heading */}
            <StaggerTextContainer delayChildren={0.2} className="text-[3rem] md:text-[3.5rem] lg:text-[4rem] font-heading text-navy leading-[1.1] tracking-tight mb-8">
              <span className="font-bold"><SplitText text={t("heading1")} /></span><br />
              <span className="font-medium text-sky"><SplitText text={t("heading2")} /></span>
            </StaggerTextContainer>

            {/* Description */}
            <BlurReveal delay={0.3}>
              <p className="text-lg text-text-muted leading-relaxed mb-10">
                {t("description")}
              </p>
            </BlurReveal>

            {/* Benefits List */}
            <StaggerContainer delayChildren={0.4} className="flex flex-col gap-4 mb-12">
              {benefits.map((benefit, i) => (
                <StaggerItem key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-navy/5 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-navy" strokeWidth={3} />
                  </div>
                  <span className="text-base font-medium text-navy">{benefit}</span>
                </StaggerItem>
              ))}
            </StaggerContainer>

            {/* CTA Button */}
            <BlurReveal delay={0.6}>
              <Button size="lg" className="rounded-full font-bold bg-navy text-white hover:bg-navy/90 px-8 py-6 flex items-center gap-2 group shadow-xl shadow-navy/10 transition-all duration-300 hover:-translate-y-1 w-fit">
                {t("cta")}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </BlurReveal>
          </div>

        </div>
      </div>
    </section>
  );
}
