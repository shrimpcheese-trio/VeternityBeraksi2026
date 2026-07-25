import { ForgotPasswordForm } from "@/components/shared/forgot-password-form";
import { getLocale } from "@/lib/i18n";

export default async function ForgotPasswordPage() {
  const locale = await getLocale();
  const messages = (await import(`@/messages/${locale}.json`)).default;
  const t = messages.auth.forgotPassword;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm rounded-2xl border border-border p-8 shadow-lg">
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          {t.heading}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{t.subtext}</p>
        <div className="mt-6">
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
}
