"use client";

import { useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export function PromoBanner() {
  const t = useTranslations("promo");
  const sectionRef = useRef<HTMLDivElement>(null);

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
          section,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
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
    <div ref={sectionRef} className="mx-auto max-w-6xl px-6 pb-44">
      <div className="rounded-lg border border-border bg-surface-card p-8 md:p-10">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-lg">
            <h3 className="font-heading text-step-3 font-bold tracking-tight">
              {t("title")}
            </h3>
            <p className="mt-2 text-step-0 leading-[1.55] text-muted-foreground">
              {t("description")}
            </p>
          </div>
          <Link
            href="#"
            className="inline-flex h-10 shrink-0 items-center rounded-md bg-primary px-5 text-step--1 font-medium text-primary-foreground hover:bg-primary-active"
          >
            {t("cta")}
          </Link>
        </div>
      </div>
    </div>
  );
}
