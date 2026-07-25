"use client";

import { useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { StoryCard } from "@/components/landing/story-card";

export function SuccessStories() {
  const t = useTranslations("stories");
  const sectionRef = useRef<HTMLElement>(null);
  const stories = t.raw("stories") as Array<{
    name: string;
    role: string;
    quote: string;
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
      ref={sectionRef}
      className="mx-auto max-w-6xl px-6 pb-44"
    >
      <h2
        data-gsap
        className="font-heading text-step-4 font-bold leading-[1.15] tracking-tight"
      >
        {t("title")}
      </h2>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {stories.map((story) => (
          <div data-gsap key={story.name}>
            <StoryCard
              name={story.name}
              role={story.role}
              quote={story.quote}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
