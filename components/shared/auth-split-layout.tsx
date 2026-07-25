"use client";

import type { ReactNode } from "react";
import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface AuthSplitLayoutProps {
  imagePlaceholder?: string;
  quoteLabel: string;
  quoteHeading: string[];
  quoteParagraph: string;
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
  imagePlaceholder = "IMAGE_PLACEHOLDER",
  quoteLabel,
  quoteHeading,
  quoteParagraph,
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
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                `linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.4)), url(${imagePlaceholder})`,
            }}
          >
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-xs font-medium uppercase tracking-widest text-white/30">
                {imagePlaceholder}
              </span>
            </div>
          </div>
          <div className="relative flex h-full flex-col justify-between p-10">
            <div data-gsap className="flex items-center gap-4">
              <span className="shrink-0 text-xs font-medium uppercase tracking-[0.2em] text-white/70">
                {quoteLabel}
              </span>
              <div className="h-px flex-1 bg-white/20" />
            </div>
            <div>
              {quoteHeading.map((line, i) => (
                <h1
                  key={i}
                  data-gsap
                  className="font-heading text-4xl font-bold leading-tight text-white"
                >
                  {line}
                </h1>
              ))}
              <p data-gsap className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
                {quoteParagraph}
              </p>
            </div>
          </div>
        </div>

        <div ref={containerRef} className="w-full md:w-1/2">
          <div className="mb-4 mt-4 px-10 md:hidden">
            <div data-gsap className="flex items-center gap-3">
              <span className="shrink-0 text-[0.625rem] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                {quoteLabel}
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>
            {quoteHeading.map((line, i) => (
              <h2
                key={i}
                data-gsap
                className="mt-3 font-heading text-xl font-bold leading-tight tracking-tight"
              >
                {line}
              </h2>
            ))}
          </div>
          <div className="px-10 py-12">
            <div data-gsap className="flex items-center justify-between">
              {backHref && (
                <button
                  type="button"
                  onClick={() => router.push(backHref)}
                  className="inline-flex items-center gap-1.5 rounded-md px-3 py-3 text-sm text-muted-foreground hover:bg-surface-soft hover:text-foreground"
                >
                  <ArrowLeft size={16} />
                  Kembali
                </button>
              )}
              <span className="font-heading text-lg font-bold tracking-tight text-primary">
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
