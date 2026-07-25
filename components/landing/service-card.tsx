"use client";

import { useRef, useEffect } from "react";

export function ServiceCard({
  name,
  description,
  workers,
  rank,
}: {
  name: string;
  description: string;
  workers: number;
  rank: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    let ctx: gsap.Context;

    async function init(target: HTMLElement) {
      const gsap = (await import("gsap")).default;
      ctx = gsap.context(() => {
        target.addEventListener("mouseenter", () => {
          gsap.to(target, { scale: 1.02, y: -4, duration: 0.3, ease: "power2.out" });
        });
        target.addEventListener("mouseleave", () => {
          gsap.to(target, { scale: 1, y: 0, duration: 0.3, ease: "power2.out" });
        });
      });
    }

    init(card);
    return () => ctx?.revert();
  }, []);

  return (
    <div
      ref={cardRef}
      className="flex flex-col rounded-lg border border-border bg-surface-card p-8 will-change-transform"
    >
      <span className="font-heading text-step-5 font-bold leading-[1.15] tracking-tight text-border/60">
        {String(rank).padStart(2, "0")}
      </span>
      <div className="mt-4 flex-1">
        <h3 className="font-heading text-step-1 font-bold tracking-tight">
          {name}
        </h3>
        <p className="mt-1.5 text-step-0 leading-[1.55] text-muted-foreground">
          {description}
        </p>
        <p className="mt-3 text-step--1 font-medium uppercase tracking-[1.5px] text-primary">
          {workers.toLocaleString("id-ID")} pekerja aktif
        </p>
      </div>
    </div>
  );
}
