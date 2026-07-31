"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { setCookie } from "@/lib/cookie";
import { Menu, X } from "lucide-react";

const locales = [
  { code: "id", label: "ID", name: "Indonesia" },
  { code: "en", label: "EN", name: "English" },
];

export function SiteNav({ user }: { user: boolean }) {
  const locale = useLocale();
  const t = useTranslations("browse");
  const [localeOpen, setLocaleOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setLocaleOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function switchLocale(next: string) {
    setCookie("locale", next, 365);
    window.location.reload();
  }

  const navLinks = [
    { label: t("home"), href: "/" },
    { label: t("browseLink"), href: "/browse" },
  ];

  return (
    <>
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="font-heading text-xl font-bold tracking-tight text-navy hover:text-sky-active md:text-2xl"
        >
          Upahku
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-text-body transition-all hover:-translate-y-0.5 hover:text-navy"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <div ref={ref} className="relative">
            <button
              type="button"
              onClick={() => setLocaleOpen(!localeOpen)}
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
            {localeOpen && (
              <div className="absolute right-0 top-full mt-2 w-36 rounded-lg border border-border bg-popover p-1 shadow-md">
                {locales.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => switchLocale(l.code)}
                    className={`flex w-full items-center rounded-md px-3 py-2 text-left text-sm ${
                      locale === l.code
                        ? "bg-bg-alt font-medium text-foreground"
                        : "text-muted-foreground hover:bg-bg-alt hover:text-foreground"
                    }`}
                  >
                    <span className="mr-2">{l.label}</span>
                    <span className="text-muted-foreground">{l.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {!user && (
            <>
              <Link
                href="/login"
                className="text-sm font-semibold text-text-body hover:text-navy"
              >
                {t("login")}
              </Link>
              <Link
                href="/register"
                className="inline-flex h-9 items-center gap-1.5 rounded-full bg-sky px-6 text-sm font-semibold text-white shadow-md hover:bg-sky-active"
              >
                {t("register")}
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="mt-4 border-t border-border pt-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="mt-4 border-t border-border pt-4">
            <div className="mb-4 flex gap-2">
              {locales.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => switchLocale(l.code)}
                  className={`flex-1 rounded-md px-3 py-2 text-center text-sm font-medium ${
                    locale === l.code
                      ? "bg-bg-alt text-foreground"
                      : "text-muted-foreground hover:bg-bg-alt hover:text-foreground"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>

            {!user && (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full rounded-md border border-border px-4 py-3 text-center text-sm font-medium text-foreground"
                >
                  {t("login")}
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 block w-full rounded-full bg-sky px-4 py-3 text-center text-sm font-semibold text-white"
                >
                  {t("register")}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
