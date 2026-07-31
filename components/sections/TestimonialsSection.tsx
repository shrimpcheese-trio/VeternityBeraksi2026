"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { ShieldCheck, Calendar, CheckCircle2, Briefcase, Star, Users, Quote } from "lucide-react";
import { useTranslations } from "next-intl";
import { BlurReveal, StaggerTextContainer, SplitText } from "@/components/ui/motion";
import "swiper/css";

const metadataIcons = [
  [Calendar, CheckCircle2],
  [Briefcase, Star],
  [Calendar, Briefcase],
  [CheckCircle2, Users],
  [Star, CheckCircle2]
];

export function TestimonialsSection() {
  const t = useTranslations("testimonials");
  const testimonials = t.raw("items") as { type: string; before: string; highlight: string; after: string; name: string; role: string; location: string; image: string; metadata: string[] }[];
  const extendedTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="bg-bg-alt py-24 md:py-32 lg:py-40 overflow-hidden relative">

      {/* Subtle background blurs for depth */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-50">
        <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] bg-sky/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-navy/5 rounded-full blur-[120px]" />
      </div>

      {/* Global CSS for Swiper active/inactive transitions */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .testimonial-swiper {
           overflow: visible !important;
        }
        .testimonial-swiper .swiper-slide {
           transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
           opacity: 0.45;
           transform: scale(0.95);
        }
        .testimonial-swiper .swiper-slide-active {
           opacity: 1;
           transform: scale(1);
           z-index: 10;
        }
        
        .testimonial-card {
           transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
           border: 1px solid transparent;
           box-shadow: none;
        }
        
        .testimonial-swiper .swiper-slide-active .testimonial-card {
           border-color: rgba(0, 0, 0, 0.05);
           box-shadow: 0 10px 40px -10px rgba(0,0,0,0.06);
        }
        
        .testimonial-swiper .swiper-slide-active:hover .testimonial-card {
           transform: translateY(-4px);
           border-color: var(--color-sky);
           box-shadow: 0 25px 50px -12px rgba(0,0,0,0.1);
        }
      `}} />

      <div className="container mx-auto px-4 max-w-[1200px] relative z-10">

        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16 md:mb-24">
          <BlurReveal delay={0.1}>
            <span className="text-[11px] uppercase font-bold tracking-widest text-sky mb-4 px-4 py-1.5 bg-sky/5 border border-sky/10 rounded-full">
              {t("eyebrow")}
            </span>
          </BlurReveal>
          <StaggerTextContainer delayChildren={0.2} className="text-[2.75rem] md:text-[3.5rem] lg:text-[4rem] font-heading font-semibold text-navy leading-[1.1] tracking-tight mb-6 mt-4">
            <SplitText text={t("heading1")} /> <br /> <span className="font-light text-sky"><SplitText text={t("heading2")} /></span>
          </StaggerTextContainer>
          <BlurReveal delay={0.3}>
            <p className="text-lg md:text-xl text-text-body max-w-[480px] leading-relaxed">
              {t("description")}
            </p>
          </BlurReveal>
        </div>

      </div>

      {/* Full bleed slider container */}
      <BlurReveal 
        delay={0.2}
        className="w-full relative z-10"
      >
        <Swiper
          modules={[Autoplay]}
          spaceBetween={24}
          slidesPerView={1.2}
          centeredSlides={true}
          loop={true}
          grabCursor={true}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 1.5, spaceBetween: 32 },
            1024: { slidesPerView: 2.5, spaceBetween: 48 },
            1280: { slidesPerView: 3, spaceBetween: 48 },
          }}
          className="testimonial-swiper"
        >
          {extendedTestimonials.map((testi, idx) => (
            <SwiperSlide key={idx} className="h-auto">
              <div className="testimonial-card group relative bg-bg rounded-[32px] p-8 md:p-10 lg:p-12 flex flex-col justify-between h-full min-h-[480px] cursor-grab active:cursor-grabbing border border-border/40 overflow-hidden">

                {/* Decorative huge quote mark */}
                <Quote className="absolute top-8 right-8 w-24 h-24 text-bg-alt/60 select-none z-0 fill-bg-alt/20" strokeWidth={1} />

                {/* Top Badge */}
                <div className="mb-10 relative z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-navy/5 text-navy text-[11px] font-bold uppercase tracking-widest border border-navy/10 group-hover:bg-sky/10 group-hover:text-sky transition-colors duration-300">
                    <ShieldCheck className="w-3.5 h-3.5" /> {testi.type}
                  </span>
                </div>

                {/* Quote */}
                <p className="text-xl md:text-2xl font-light text-navy leading-[1.6] mb-12 tracking-tight relative z-10">
                  {testi.before}<span className="text-sky font-medium">{testi.highlight}</span>{testi.after}
                </p>

                {/* Bottom Area */}
                <div className="pt-6 border-t border-border/50 mt-auto flex flex-col gap-5 relative z-10">

                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 bg-bg-alt shadow-sm">
                      <img
                        src={testi.image}
                        alt={testi.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-heading font-semibold text-navy text-lg leading-tight">{testi.name}</span>
                      <span className="text-sm font-medium text-text-muted mt-0.5">{testi.role} • {testi.location}</span>
                    </div>
                  </div>

                  {/* Metadata Snippets */}
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    {testi.metadata.map((meta, i) => {
                      const Icon = metadataIcons[idx % testimonials.length][i];
                      return (
                        <div key={i} className="flex items-center gap-1.5 text-[11px] text-text-muted font-medium bg-bg-alt/50 px-2.5 py-1.5 rounded-md border border-border/30">
                          <Icon className="w-3 h-3 text-sky" />
                          {meta}
                        </div>
                      )
                    })}
                  </div>

                </div>

              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </BlurReveal>

    </section>
  );
}
