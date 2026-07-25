import { AuthSplitLayout } from "@/components/shared/auth-split-layout";
import { LoginForm } from "@/components/shared/login-form";
import { getLocale } from "@/lib/i18n";

export default async function LoginPage() {
  const locale = await getLocale();
  const messages = (await import(`@/messages/${locale}.json`)).default;
  const t = messages.auth.login;

  return (
    <AuthSplitLayout
      backHref="/"
      imagePlaceholder="IMAGE_PLACEHOLDER"
      quoteLabel={t.quoteLabel}
      quoteHeading={t.quoteHeading}
      quoteParagraph={t.quoteParagraph}
      brandName="Upahku"
      heading={t.heading}
      subtext={t.subtext}
      bottomText={t.noAccount}
      bottomLinkText={t.signUp}
      bottomLinkHref="/register"
    >
      <LoginForm />
    </AuthSplitLayout>
  );
}
