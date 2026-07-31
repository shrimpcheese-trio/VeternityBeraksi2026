"use client";
import * as React from "react";
import { Hammer, ShieldAlert, Smartphone } from "lucide-react";
import { BlurReveal, CardReveal, StaggerTextContainer, SplitText } from "@/components/ui/motion";
import { useTranslations } from "next-intl";

export function InsightSection() {
  const t = useTranslations("insight");
  return (
    <section id="tentang" className="bg-bg-alt py-24 md:py-32 lg:py-40 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1000px]">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <StaggerTextContainer delayChildren={0.1} className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] font-heading font-semibold text-navy leading-[1.1] tracking-tight mb-6">
            <SplitText text={t("headline")} />
          </StaggerTextContainer>
          
          <BlurReveal delay={0.2}>
            <p className="text-base sm:text-lg text-text-muted leading-relaxed">
              {t("description")}
            </p>
          </BlurReveal>
        </div>

        {/* 3-Card Staggered Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-start">
          
          {/* Card 1 */}
          <CardReveal 
            delay={0.3}
            className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-border/50 flex flex-col h-full min-h-[300px]"
          >
            <div className="inline-flex self-start items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/80 bg-bg-alt/50 mb-10">
              <Hammer className="w-3.5 h-3.5 text-text-muted" />
              <span className="text-[11px] font-medium text-text-muted tracking-wide">{t("cards.hardWork.badge")}</span>
            </div>
            
            <h3 className="text-[3.5rem] sm:text-[5rem] font-heading font-semibold text-navy leading-none tracking-tighter mb-auto">
              {t("cards.hardWork.value")}
            </h3>
            
            <p className="text-sm text-text-muted leading-relaxed mt-12">
              {t("cards.hardWork.description")}
            </p>
          </CardReveal>

          {/* Card 2 (Staggered down) */}
          <CardReveal 
            delay={0.4}
            className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-border/50 flex flex-col h-full min-h-[300px] mt-0 md:mt-10 lg:mt-12"
          >
            <div className="inline-flex self-start items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/80 bg-bg-alt/50 mb-10">
              <ShieldAlert className="w-3.5 h-3.5 text-text-muted" />
              <span className="text-[11px] font-medium text-text-muted tracking-wide">{t("cards.reputation.badge")}</span>
            </div>
            
            <h3 className="text-[3.5rem] sm:text-[5rem] font-heading font-semibold text-navy leading-none tracking-tighter mb-auto">
              {t("cards.reputation.value")}
            </h3>
            
            <p className="text-sm text-text-muted leading-relaxed mt-12">
              {t("cards.reputation.description")}
            </p>
          </CardReveal>

          {/* Card 3 */}
          <CardReveal 
            delay={0.5}
            className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-border/50 flex flex-col h-full min-h-[300px]"
          >
            <div className="inline-flex self-start items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/80 bg-bg-alt/50 mb-10">
              <Smartphone className="w-3.5 h-3.5 text-text-muted" />
              <span className="text-[11px] font-medium text-text-muted tracking-wide">{t("cards.risk.badge")}</span>
            </div>
            
            <h3 className="text-[3.5rem] sm:text-[5rem] font-heading font-semibold text-navy leading-none tracking-tighter mb-auto">
              {t("cards.risk.value")}
            </h3>
            
            <p className="text-sm text-text-muted leading-relaxed mt-12">
              {t("cards.risk.description")}
            </p>
          </CardReveal>

        </div>
      </div>
    </section>
  );
}
