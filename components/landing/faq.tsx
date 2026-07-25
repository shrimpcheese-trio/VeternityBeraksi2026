"use client";

import { useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export function Faq() {
  const t = useTranslations("faq");
  const sectionRef = useRef<HTMLElement>(null);
  const items = t.raw("items") as Array<{
    question: string;
    answer: string;
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
      ref={sectionRef}
      id="faq"
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

        <div data-gsap>
          <Accordion type="single" collapsible className="w-full border-0">
            {items.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-b border-border last:border-b-0">
                <AccordionTrigger className="text-step-0 font-medium leading-[1.4]">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-step-0 leading-[1.55] text-muted-foreground">
                    {item.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
