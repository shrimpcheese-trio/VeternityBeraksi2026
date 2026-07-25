"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { setCookie } from "@/lib/cookie";

import { ArrowUpRightIcon } from "lucide-react";
import { ContactModal } from "@/components/landing/contact-modal";

export function Navbar() {
  const t = useTranslations("navbar");
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function switchLocale(next: string) {
    setCookie("locale", next, 365);
    window.location.reload();
  }

  const locales = [
    { code: "id", label: "ID", name: "Indonesia" },
    { code: "en", label: "EN", name: "English" },
  ];

  const links = [
    { label: t("services"), href: "#services" },
    { label: t("plans"), href: "#plans" },
    { label: t("about"), href: "#about" },
    { label: t("faq"), href: "#faq" },
    { label: t("contact"), href: "#contact", isContact: true },
  ];

  if (pathname !== "/") return null;

  return (
    <>
    <header className="fixed left-1/2 top-4 z-50 w-[calc(100%-2rem)] max-w-6xl -translate-x-1/2 rounded-xl border border-border bg-background/80 shadow-sm backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-6">
        <Link
          href="/"
          className="font-heading text-step-1 font-bold tracking-tight"
        >
          Upahku
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) =>
            link.isContact ? (
              <button
                key={link.href}
                type="button"
                onClick={() => setContactOpen(true)}
                className="underline-hover py-1 text-step--1 font-medium text-muted-foreground"
              >
                {link.label}
              </button>
            ) : (
              <a
                key={link.href}
                href={link.href}
                className="underline-hover py-1 text-step--1 font-medium text-muted-foreground"
              >
                {link.label}
              </a>
            ),
          )}
        </nav>

        <div className="flex items-center gap-5">
          <div ref={ref} className="relative">
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="flex items-center gap-1 text-step--1 font-medium text-muted-foreground hover:text-foreground"
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
                    className={`flex w-full items-center rounded-md px-3 py-2 text-left text-step--1 ${
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

          <Link
            href="/login"
            className="text-step--1 font-medium text-primary hover:text-primary-active"
          >
            {t("login")}
          </Link>

          <Link
            href="/register"
            className="inline-flex h-10 gap-1.5 items-center rounded-md bg-primary px-5 text-step--1 font-medium text-on-primary hover:bg-primary-active"
          >
            {t("joinUs")}
            <ArrowUpRightIcon size={16} />
          </Link>
        </div>
      </div>

    </header>
    <ContactModal
      open={contactOpen}
      onClose={() => setContactOpen(false)}
    />
  </>
  );
}
