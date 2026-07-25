import { cookies, headers } from "next/headers";

export const locales = ["en", "id"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "id";

export function detectLocale(acceptLanguage?: string | null, cookieLocale?: string | null): Locale {
  if (cookieLocale && locales.includes(cookieLocale as Locale)) {
    return cookieLocale as Locale;
  }

  if (acceptLanguage) {
    const preferred = acceptLanguage.split(",")[0]?.split("-")[0]?.trim().toLowerCase();
    if (preferred && locales.includes(preferred as Locale)) {
      return preferred as Locale;
    }
  }

  return defaultLocale;
}

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("locale")?.value ?? null;
  const headersList = await headers();
  const acceptLanguage = headersList.get("accept-language");
  return detectLocale(acceptLanguage, cookieLocale);
}

export type Messages = typeof import("@/messages/id.json");
