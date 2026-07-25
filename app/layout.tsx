import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { I18nProvider } from "@/lib/i18n-provider";
import { getLocale } from "@/lib/i18n";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Upahku",
  description:
    "Platform reputasi profesional untuk pekerja informal Indonesia. Bangun kepercayaan, dapatkan upah adil.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = (await import(`@/messages/${locale}.json`)).default;

  return (
    <html
      lang={locale}
      className={cn(
        "h-full antialiased",
        spaceGrotesk.variable,
        inter.variable,
        jetbrainsMono.variable,
        "font-sans",
      )}
    >
      <body className="min-h-full flex flex-col">
        <I18nProvider locale={locale} messages={messages}>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
