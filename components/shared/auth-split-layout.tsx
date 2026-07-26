"use client";

import type { ReactNode } from "react";
import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface AuthSplitLayoutProps {
  brandName: string;
  heading: string;
  subtext: string;
  bottomText: string;
  bottomLinkText: string;
  bottomLinkHref: string;
  backHref?: string;
  children: ReactNode;
}

export function AuthSplitLayout({
  brandName,
  heading,
  subtext,
  bottomText,
  bottomLinkText,
  bottomLinkHref,
  backHref,
  children,
}: AuthSplitLayoutProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

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
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, stagger: 0.08, duration: 0.45, ease: "back.out(1.4)" },
        );
      });
    })();

    return () => {
      active = false;
      ctx?.revert();
    };
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="flex w-full max-w-5xl overflow-hidden rounded-2xl border border-border shadow-lg">
        <div className="relative hidden w-1/2 md:block">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-surface-dark to-accent-teal/20">
            <div className="flex h-full w-full items-center justify-center p-16">
              <div className="w-full">
                <div className="mb-12 flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/30 text-sm font-bold text-white">
                    U
                  </div>
                  <span className="font-heading text-lg font-bold tracking-tight text-white">
                    {brandName}
                  </span>
                </div>
                <div className="mt-8 flex gap-2">
                  <div className="size-2 rounded-full bg-primary" />
                  <div className="size-2 rounded-full bg-white/20" />
                  <div className="size-2 rounded-full bg-white/20" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div ref={containerRef} className="w-full md:w-1/2">
          <div className="px-10 py-12">
            <div data-gsap className="flex items-center justify-between">
              {backHref && (
                <button
                  type="button"
                  onClick={() => router.push(backHref)}
                  className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-surface-soft hover:text-foreground"
                >
                  <ArrowLeft size={16} />
                  Kembali
                </button>
              )}
              <span className="font-heading text-lg font-bold tracking-tight text-primary md:text-ink">
                {brandName}
              </span>
            </div>

            <h2 data-gsap className="mt-10 font-heading text-2xl font-bold tracking-tight">
              {heading}
            </h2>
            <p data-gsap className="mt-1 text-sm text-muted-foreground">{subtext}</p>

            <div className="mt-8">{children}</div>

            <p data-gsap className="mt-8 text-center text-sm text-muted-foreground">
              {bottomText}{" "}
              <a
                href={bottomLinkHref}
                className="font-medium text-primary hover:underline"
              >
                {bottomLinkText}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
