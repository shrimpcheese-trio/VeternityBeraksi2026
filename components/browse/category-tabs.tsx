"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";

interface Category {
  id: string;
  label: string;
  count: number;
}

function navigate(router: ReturnType<typeof useRouter>, searchParams: URLSearchParams, baseUrl: string, categoryId: string) {
  const params = new URLSearchParams(searchParams.toString());
  if (categoryId) {
    params.set("category", categoryId);
  } else {
    params.delete("category");
  }
  router.push(`${baseUrl}?${params.toString()}`);
}

export function CategoryTabs({ categories, activeCategory, baseUrl }: { categories: Category[]; activeCategory: string; baseUrl: string }) {
  const t = useTranslations("browse");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [show, setShow] = useState(false);
  const [animatingOut, setAnimatingOut] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!show) return;
    let activeFlag = true;
    let ctx: gsap.Context | undefined;

    (async () => {
      const gsap = (await import("gsap")).default;
      if (!activeFlag) return;
      const overlay = overlayRef.current;
      const card = cardRef.current;
      if (!overlay || !card) return;

      ctx = gsap.context(() => {
        gsap.set(overlay, { autoAlpha: 0 });
        gsap.set(card, { autoAlpha: 0, scale: 0.92 });

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.to(overlay, { autoAlpha: 1, duration: 0.2 }).to(
          card,
          { autoAlpha: 1, scale: 1, duration: 0.35, ease: "back.out(1.7)" },
          "-=0.05",
        );
      });
    })();

    return () => {
      activeFlag = false;
      ctx?.revert();
    };
  }, [show]);

  function open() {
    setShow(true);
  }

  function close() {
    setAnimatingOut(true);
    const overlay = overlayRef.current;
    const card = cardRef.current;
    if (!overlay || !card) {
      setShow(false);
      setAnimatingOut(false);
      return;
    }

    (async () => {
      const gsap = (await import("gsap")).default;
      const tl = gsap.timeline({
        defaults: { ease: "power2.in" },
        onComplete: () => {
          setAnimatingOut(false);
          setShow(false);
        },
      });
      tl.to(card, { autoAlpha: 0, scale: 0.95, duration: 0.15 }).to(
        overlay,
        { autoAlpha: 0, duration: 0.1 },
        "-=0.05",
      );
    })();
  }

  return (
    <>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.slice(0, 4).map((cat) => {
          const isActive = cat.id === activeCategory;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => navigate(router, searchParams, baseUrl, cat.id)}
              className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-bg-alt text-muted-foreground hover:bg-bg-card hover:text-foreground"
              }`}
            >
              {cat.label}
              <span
                className={`rounded-full px-1.5 py-0.5 text-[0.625rem] font-semibold ${
                  isActive
                    ? "bg-white/20 text-primary-foreground"
                    : "bg-background text-muted-foreground"
                }`}
              >
                {cat.count.toLocaleString(locale)}
              </span>
            </button>
          );
        })}

        <button
          type="button"
          onClick={open}
          className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-dashed border-border px-4 py-3 text-sm font-medium text-muted-foreground hover:border-foreground hover:text-foreground"
        >
          <Plus size={16} />
          {t("more")}
        </button>
      </div>

      {(show || animatingOut) && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={close}
        >
          <div
            ref={cardRef}
            className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">{t("allCategories")}</h2>
              <button
                type="button"
                onClick={close}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {categories.map((cat) => {
                const isActive = cat.id === activeCategory;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      navigate(router, searchParams, baseUrl, cat.id);
                      close();
                    }}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-bg-alt text-muted-foreground hover:bg-bg-card hover:text-foreground"
                    }`}
                  >
                    {cat.label}
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[0.625rem] font-semibold ${
                        isActive
                          ? "bg-white/20 text-primary-foreground"
                          : "bg-background text-muted-foreground"
                      }`}
                    >
                      {cat.count.toLocaleString(locale)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
