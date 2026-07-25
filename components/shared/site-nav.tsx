"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { setCookie } from "@/lib/cookie";

const locales = [
  { code: "id", label: "ID", name: "Indonesia" },
  { code: "en", label: "EN", name: "English" },
];

export function SiteNav({ user }: { user: boolean }) {
  const locale = useLocale();
  const t = useTranslations("browse");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function switchLocale(next: string) {
    setCookie("locale", next, 365);
    window.location.reload();
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-6">
        <a
          href="/"
          className="font-heading text-step-1 font-bold tracking-tight text-primary hover:text-primary-active"
        >
          Upahku
        </a>
        <a
          href="/"
          className="text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          {t("home")}
        </a>
        <a
          href="/browse"
          className="text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          {t("browseLink")}
        </a>
      </div>

      <div className="flex items-center gap-4">
        <div ref={ref} className="relative">
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            {locale === "id" ? "ID" : "EN"}
            <svg
              className="size-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </button>
          {open && (
            <div className="absolute right-0 top-full mt-2 w-36 rounded-lg border border-border bg-popover p-1 shadow-md">
              {locales.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => switchLocale(l.code)}
                  className={`flex w-full items-center rounded-md px-3 py-2 text-left text-sm ${
                    locale === l.code
                      ? "bg-surface-soft font-medium text-foreground"
                      : "text-muted-foreground hover:bg-surface-soft hover:text-foreground"
                  }`}
                >
                  <span className="mr-2">{l.label}</span>
                  <span className="text-muted-soft">{l.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {!user && (
          <>
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              {t("login")}
            </Link>
            <Link
              href="/register"
              className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-4 text-sm font-medium text-on-primary hover:bg-primary-active"
            >
              {t("register")}
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
