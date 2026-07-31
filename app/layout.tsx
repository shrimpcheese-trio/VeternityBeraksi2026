import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { I18nProvider } from "@/lib/i18n-provider";
import { getLocale } from "@/lib/i18n";
import { NavigationLoader } from "@/components/shared/navigation-loader";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-heading",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
        bricolage.variable,
        inter.variable,
        "font-sans",
      )}
    >
      <body className="min-h-full flex flex-col bg-bg text-text-body">
        <I18nProvider locale={locale} messages={messages}>
          <NavigationLoader />
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
