"use client";

import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import type { Messages } from "@/lib/i18n";

export function I18nProvider({
  locale,
  messages,
  children,
}: {
  locale: string;
  messages: Messages;
  children: ReactNode;
}) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
