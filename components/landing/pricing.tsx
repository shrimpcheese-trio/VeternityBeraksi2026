"use client";

import { useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { CheckIcon } from "lucide-react";

const tiers = ["free", "pro", "enterprise"] as const;

export function Pricing() {
  const t = useTranslations("pricing");
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let active = true;
    let ctx: gsap.Context | undefined;

    (async () => {
      const gsap = (await import("gsap")).default;
      const ScrollTrigger = (await import("gsap/ScrollTrigger")).ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      if (!active) return;

      ctx = gsap.context(() => {
        gsap.fromTo(
          section.querySelectorAll<HTMLElement>("[data-gsap]"),
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.12,
            duration: 0.5,
            ease: "back.out(1.2)",
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              end: "top 40%",
            },
          },
        );
      });
    })();

    return () => {
      active = false;
      ctx?.revert();
    };
  }, []);

  return (
    <section
      id="plans"
      ref={sectionRef}
      className="mx-auto max-w-6xl px-6 pb-44"
    >
      <div data-gsap className="mb-12">
        <h2 className="font-heading text-step-4 font-bold leading-[1.15] tracking-tight">
          {t("title")}
        </h2>
        <p className="mt-3 max-w-lg text-step-0 leading-[1.55] text-muted-foreground">
          {t("subheadline")}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {tiers.map((tier, i) => {
          const isPro = tier === "pro";
          const features = t.raw(`${tier}.features`) as string[];

          return (
            <div
              key={tier}
              data-gsap
              className={`flex flex-col rounded-lg border p-8 ${
                isPro
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-surface-card"
              }`}
            >
              <p
                className={`text-step--1 font-medium uppercase tracking-[1.5px] ${
                  isPro ? "text-primary-foreground/70" : "text-muted-foreground"
                }`}
              >
                {t(`${tier}.name`)}
              </p>

              <div className="mt-4">
                <span
                  className={`font-heading text-step-5 font-bold leading-none tracking-tight ${
                    isPro ? "text-primary-foreground" : ""
                  }`}
                >
                  {t(`${tier}.price`)}
                </span>
                {t(`${tier}.period`) && (
                  <span
                    className={`ml-1 text-step--1 ${
                      isPro
                        ? "text-primary-foreground/60"
                        : "text-muted-foreground"
                    }`}
                  >
                    {t(`${tier}.period`)}
                  </span>
                )}
                {t(`${tier}.priceSub`) && (
                  <span
                    className={`ml-1 text-step--1 ${
                      isPro
                        ? "text-primary-foreground/60"
                        : "text-muted-foreground"
                    }`}
                  >
                    {t(`${tier}.priceSub`)}
                  </span>
                )}
              </div>

              <p
                className={`mt-2 text-step--1 leading-relaxed ${
                  isPro
                    ? "text-primary-foreground/80"
                    : "text-muted-foreground"
                }`}
              >
                {t(`${tier}.description`)}
              </p>

              <div className="mt-6 flex-1 space-y-3">
                {features.map((feature: string) => (
                  <div key={feature} className="flex items-start gap-2">
                    <CheckIcon
                      size={14}
                      className={`mt-0.5 shrink-0 ${
                        isPro
                          ? "text-primary-foreground"
                          : "text-primary"
                      }`}
                    />
                    <span
                      className={`text-step--1 leading-relaxed ${
                        isPro
                          ? "text-primary-foreground/90"
                          : "text-foreground"
                      }`}
                    >
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <Link
                href={isPro ? "/register?plan=pro" : "/register"}
                className={`mt-8 inline-flex h-10 items-center justify-center rounded-md px-5 text-step--1 font-medium ${
                  isPro
                    ? "bg-white text-primary hover:bg-white/90"
                    : "border border-border bg-background text-foreground hover:bg-surface-soft"
                }`}
              >
                {t(`${tier}.cta`)}
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
