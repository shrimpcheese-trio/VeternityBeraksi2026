"use client";

import { useRef, useEffect } from "react";

export function StoryCard({
  name,
  role,
  quote,
}: {
  name: string;
  role: string;
  quote: string;
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
      <p className="flex-1 text-step-0 leading-[1.55] italic text-foreground/80">
        &ldquo;{quote}&rdquo;
      </p>
      <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
        <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-step--1 font-bold text-primary uppercase">
          {name.charAt(0)}
        </div>
        <div>
          <p className="text-step-0 font-medium">{name}</p>
          <p className="text-step--1 text-muted-foreground">{role}</p>
        </div>
      </div>
    </div>
  );
}
