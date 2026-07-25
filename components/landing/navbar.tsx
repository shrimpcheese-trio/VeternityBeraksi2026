"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { setCookie } from "@/lib/cookie";

import { ArrowUpRightIcon, Menu, X } from "lucide-react";
import { ContactModal } from "@/components/landing/contact-modal";

export function Navbar() {
  const t = useTranslations("navbar");
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
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
    { label: t("browse"), href: "/browse" },
    { label: t("plans"), href: "#plans" },
    { label: t("about"), href: "#about" },
    { label: t("contact"), href: "#contact", isContact: true },
  ];

  if (pathname !== "/") return null;

  return (
    <>
      <header className="fixed left-1/2 top-4 z-50 w-[calc(100%-2rem)] max-w-6xl -translate-x-1/2 rounded-xl border border-border bg-background/80 shadow-sm backdrop-blur-md">
        <div className="grid h-16 grid-cols-2 lg:grid-cols-3 content-center lg:items-center px-6">
          <Link
            href="/"
            className="justify-self-start font-heading text-step-1 font-bold tracking-tight text-primary"
          >
            Upahku
          </Link>

          <nav className="hidden justify-center gap-8 md:flex">
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

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="justify-self-end md:hidden"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <div className="hidden items-center justify-self-end gap-5 md:flex">
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

        {mobileOpen && (
          <div className="border-t border-border px-6 py-4 md:hidden">
            <nav className="flex flex-col gap-3">
              {links.map((link) =>
                link.isContact ? (
                  <button
                    key={link.href}
                    type="button"
                    onClick={() => {
                      setContactOpen(true);
                      setMobileOpen(false);
                    }}
                    className="py-2 text-sm font-medium text-muted-foreground hover:text-foreground text-start"
                  >
                    {link.label}
                  </button>
                ) : (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                  >
                    {link.label}
                  </a>
                ),
              )}
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
                        ? "bg-surface-soft text-foreground"
                        : "text-muted-foreground hover:bg-surface-soft hover:text-foreground"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>

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
                className="mt-2 block w-full rounded-md bg-primary px-4 py-3 text-center text-sm font-medium text-on-primary"
              >
                {t("joinUs")}
              </Link>
            </div>
          </div>
        )}
      </header>
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}
