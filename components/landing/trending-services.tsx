"use client";

import { useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { ServiceCard } from "@/components/landing/service-card";

export function TrendingServices() {
  const t = useTranslations("trending");
  const sectionRef = useRef<HTMLElement>(null);
  const services = t.raw("services") as Array<{
    name: string;
    description: string;
    workers: number;
  }>;

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
            stagger: 0.1,
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
      id="services"
      ref={sectionRef}
      className="mx-auto max-w-6xl px-6 pb-44"
    >
      <h2
        data-gsap
        className="font-heading text-step-4 font-bold leading-[1.15] tracking-tight"
      >
        {t("title")}
      </h2>

      <div className="mt-10 grid gap-6 md:grid-cols-3 md:gap-8">
        {services.map((service, i) => (
          <div data-gsap key={service.name}>
            <ServiceCard
              name={service.name}
              description={service.description}
              workers={service.workers}
              rank={i + 1}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
