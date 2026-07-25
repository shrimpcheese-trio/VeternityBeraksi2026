"use client";

import { useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export function FinalCta() {
  const t = useTranslations("cta");
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
          { opacity: 0, y: 24, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: "back.out(1.4)",
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
      ref={sectionRef}
      className="mx-auto max-w-6xl px-6 pb-44"
    >
      <div
        data-gsap
        className="rounded-lg bg-primary px-10 py-16 text-center md:px-16 md:py-20"
      >
        <h2 className="font-heading text-step-3 font-bold leading-[1.2] tracking-tight text-primary-foreground">
          {t("headline")}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-step-0 leading-[1.55] text-primary-foreground/80">
          {t("subHeadline")}
        </p>
        <Link
          href="/register"
          className="mt-8 inline-flex h-10 items-center rounded-md bg-white px-5 text-step--1 font-medium text-primary hover:bg-white/90"
        >
          {t("button")}
        </Link>
      </div>
    </section>
  );
}
