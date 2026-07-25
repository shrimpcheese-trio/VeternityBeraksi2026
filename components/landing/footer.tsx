"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";

const year = new Date().getFullYear();

export function Footer() {
  const t = useTranslations("footer");

  const menus = [
    { label: t("about"), href: "#about" },
    { label: t("whyUs"), href: "#why-us" },
    { label: t("forBusiness"), href: "#for-business" },
  ];

  const legal = [
    { label: t("privacy"), href: "#" },
    { label: t("terms"), href: "#" },
  ];

  return (
    <footer className="mx-auto mb-8 w-[calc(100%-2rem)] max-w-6xl rounded-xl border border-surface-dark-elevated bg-surface-dark shadow-sm">
      <div className="px-6 py-16">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <div className="max-w-xs">
            <Link
              href="/"
              className="font-heading text-step-1 font-bold tracking-tight text-on-dark"
            >
              Upahku
            </Link>
            <p className="mt-2 text-step--1 leading-[1.55] text-on-dark-soft">
              {t("slogan")}
            </p>
          </div>

          <div className="flex gap-14">
            <div>
              <h4 className="mb-4 text-step--1 font-medium uppercase tracking-[1.5px] text-on-dark-soft">
                Menu
              </h4>
              <ul className="space-y-2.5">
                {menus.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="underline-hover text-step--1 text-on-dark-soft hover:text-on-dark"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-step--1 font-medium uppercase tracking-[1.5px] text-on-dark-soft">
                Legal
              </h4>
              <ul className="space-y-2.5">
                {legal.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="underline-hover text-step--1 text-on-dark-soft hover:text-on-dark"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-surface-dark-elevated py-5">
        <p className="text-center text-step--1 text-on-dark-soft/60">
          {t("copyright", { year })}
        </p>
      </div>
    </footer>
  );
}
