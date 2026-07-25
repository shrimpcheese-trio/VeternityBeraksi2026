"use client";

import { useRef, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { X, User, Mail, MessageSquare, Edit3 } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
}

export function ContactModal({ open, onClose }: ContactModalProps) {
  const t = useTranslations("contact");
  const overlayRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [animatingOut, setAnimatingOut] = useState(false);

  useEffect(() => {
    if (!open) return;

    let ctx: gsap.Context;

    (async () => {
      const gsap = (await import("gsap")).default;
      const overlay = overlayRef.current;
      const card = cardRef.current;
      if (!overlay || !card) return;

      const items = card.querySelectorAll<HTMLElement>("[data-gsap]");

      ctx = gsap.context(() => {
        gsap.set(overlay, { autoAlpha: 0 });
        gsap.set(card, { autoAlpha: 0, scale: 0.92 });
        gsap.set(items, { opacity: 0, y: 12 });

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.to(overlay, { autoAlpha: 1, duration: 0.25 })
          .to(card, { autoAlpha: 1, scale: 1, duration: 0.4, ease: "back.out(1.7)" }, "-=0.1")
          .to(items, { opacity: 1, y: 0, stagger: 0.06, duration: 0.35 }, "-=0.15");
      });
    })();

    return () => {
      ctx?.revert();
    };
  }, [open]);

  function handleClose() {
    setAnimatingOut(true);
    const card = cardRef.current;
    const overlay = overlayRef.current;
    if (!card || !overlay) {
      onClose();
      return;
    }

    (async () => {
      const gsap = (await import("gsap")).default;
      const tl = gsap.timeline({
        defaults: { ease: "power2.in" },
        onComplete: () => {
          setAnimatingOut(false);
          onClose();
        },
      });
      tl.to(card, { autoAlpha: 0, scale: 0.95, duration: 0.2 }).to(
        overlay,
        { autoAlpha: 0, duration: 0.15 },
        "-=0.05",
      );
    })();
  }

  if (!open && !animatingOut) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        ref={cardRef}
        className="w-full max-w-lg rounded-xl border border-border bg-background p-8 shadow-xl"
      >
        <div data-gsap className="mb-6 flex items-center justify-between">
          <h2 className="font-heading text-xl font-bold tracking-tight">
            {t("title")}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-surface-soft hover:text-foreground"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div data-gsap>
            <label className="mb-1 block text-step--1 font-medium text-foreground">
              {t("name")}
            </label>
            <div className="relative">
              <User size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-soft" />
              <Input
                required
                className="border-border bg-background pl-9 text-step-0"
                placeholder={t("namePlaceholder")}
              />
            </div>
          </div>

          <div data-gsap>
            <label className="mb-1 block text-step--1 font-medium text-foreground">
              {t("email")}
            </label>
            <div className="relative">
              <Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-soft" />
              <Input
                type="email"
                required
                className="border-border bg-background pl-9 text-step-0"
                placeholder={t("emailPlaceholder")}
              />
            </div>
          </div>

          <div data-gsap>
            <label className="mb-1 block text-step--1 font-medium text-foreground">
              {t("subject")}
            </label>
            <div className="relative">
              <MessageSquare size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-soft" />
              <Input
                required
                className="border-border bg-background pl-9 text-step-0"
                placeholder={t("subjectPlaceholder")}
              />
            </div>
          </div>

          <div data-gsap>
            <label className="mb-1 block text-step--1 font-medium text-foreground">
              {t("message")}
            </label>
            <div className="relative">
              <Edit3 size={16} className="pointer-events-none absolute left-3 top-[14px] text-muted-soft" />
              <textarea
                required
                rows={4}
                className="flex w-full rounded-md border border-border bg-background pl-9 py-2 pr-3 text-step-0 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-soft focus-visible:border-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                placeholder={t("messagePlaceholder")}
              />
            </div>
          </div>

          <button
            type="submit"
            data-gsap
            className="inline-flex w-full items-center justify-center rounded-md bg-primary px-5 py-2.5 text-step-0 font-medium text-primary-foreground hover:bg-primary-active"
          >
            {t("send")}
          </button>
        </form>

        <p
          data-gsap
          className="mt-4 text-center text-step--1 text-muted-foreground"
        >
          {t("orEmail")}{" "}
          <a
            href="mailto:hello@upahku.com"
            className="font-medium text-primary hover:underline"
          >
            hello@upahku.com
          </a>
        </p>
      </div>
    </div>
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    window.location.href = "mailto:hello@upahku.com";
  }
}
