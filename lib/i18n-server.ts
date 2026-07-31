import { createTranslator } from "next-intl";
import type { Messages } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n";

export async function getServerTranslator<N extends keyof Messages>(namespace: N) {
  const locale = await getLocale();
  const messages = (await import(`@/messages/${locale}.json`)).default as Messages;
  return createTranslator({ locale, messages, namespace });
}
