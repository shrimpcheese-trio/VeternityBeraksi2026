"use client";

import { useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { DuotoneBox } from "@/components/landing/duotone-box";
import { Search } from "lucide-react";

export function Hero() {
  const t = useTranslations("hero");
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let active = true;
    let ctx: gsap.Context | undefined;

    (async () => {
      const gsap = (await import("gsap")).default;
      if (!active) return;
      ctx = gsap.context(() => {
        gsap.fromTo(
          container.querySelectorAll<HTMLElement>("[data-gsap]"),
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, stagger: 0.12, duration: 0.6, ease: "back.out(1.5)" },
        );
      });
    })();

    return () => {
      active = false;
      ctx?.revert();
    };
  }, []);

  useEffect(() => {
    const el = imageRef.current;
    if (!el) return;
    let active = true;
    let ctx: gsap.Context | undefined;

    (async () => {
      const gsap = (await import("gsap")).default;
      if (!active) return;
      ctx = gsap.context(() => {
        gsap.fromTo(
          el,
          { y: -4 },
          {
            y: 4,
            repeat: -1,
            yoyo: true,
            duration: 3,
            ease: "sine.inOut",
          },
        );
      });
    })();

    return () => {
      active = false;
      ctx?.revert();
    };
  }, []);

  useEffect(() => {
    const el = imageRef.current;
    if (!el) return;
    const target = el;

    function onMove(e: MouseEvent) {
      const rect = target.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 12;
      target.style.setProperty("--px", `${x}px`);
      target.style.setProperty("--py", `${y}px`);
    }

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-6 pt-32 pb-28 md:pt-40 md:pb-48">
      <div className="grid gap-10 md:grid-cols-[3fr_2fr] md:gap-16">
        <div ref={containerRef} className="flex flex-col gap-5">
          <h1
            data-gsap
            className="font-heading text-step-4 font-bold leading-[1.15] tracking-tight sm:text-step-5 md:text-step-6 md:leading-[1.05] md:tracking-tighter"
          >
            {t("headline")}
          </h1>

          <p
            data-gsap
            className="max-w-lg text-step-0 leading-[1.55] text-body-strong"
          >
            {t("description")}
          </p>

          <div
            data-gsap
            className="mt-4 flex gap-2 rounded-md border-2 border-border/80 bg-surface-soft px-2 py-2 shadow-sm"
          >
            <Input
              placeholder={t("searchPlaceholder")}
              className="flex-1 border-0 bg-transparent px-2 text-step-0 shadow-none focus-visible:ring-0 placeholder:font-normal placeholder:text-muted-soft"
            />
            <button
              type="button"
              className="inline-flex h-11 items-center gap-1.5 rounded-md bg-primary px-3 sm:px-4 text-step--1 font-medium text-primary-foreground hover:bg-primary-active"
              aria-label={t("searchButtonText")}
            >
              <Search className="size-4" />
              <span className="hidden sm:inline">{t("searchButtonText")}</span>
            </button>
          </div>

          <p
            data-gsap
            className="mt-1 text-step--1 italic text-muted-soft"
          >
            {t("searchHelperText")}
          </p>
        </div>

        <div ref={imageRef} className="flex flex-col gap-2" style={{ translate: "var(--px, 0px) var(--py, 0px)" }}>
          <DuotoneBox aspect="aspect-[4/3]" className="w-full" />
        </div>
      </div>
    </section>
  );
}
