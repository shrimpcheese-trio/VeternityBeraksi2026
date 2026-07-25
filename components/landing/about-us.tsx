"use client";

import { useRef, useEffect } from "react";
import { useTranslations } from "next-intl";

export function AboutUs() {
  const t = useTranslations("about");
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
            stagger: 0.15,
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
      id="about"
      ref={sectionRef}
      className="mx-auto max-w-6xl px-6 pb-44"
    >
      <div className="grid gap-10 md:grid-cols-[1fr_1.5fr] md:gap-16">
        <div data-gsap>
          <h2 className="font-heading text-step-4 font-bold leading-[1.15] tracking-tight">
            {t("title")}
          </h2>
          <p className="mt-3 text-step-0 leading-[1.55] text-muted-foreground">
            {t("subheadline")}
          </p>
        </div>

        <div className="space-y-4 text-step-0 leading-[1.55] text-muted-foreground">
          <p data-gsap>{t("description1")}</p>
          <p data-gsap>{t("description2")}</p>
        </div>
      </div>
    </section>
  );
}
