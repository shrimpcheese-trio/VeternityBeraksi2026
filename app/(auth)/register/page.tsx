import { AuthSplitLayout } from "@/components/shared/auth-split-layout";
import { RegisterForm } from "@/components/shared/register-form";
import { getLocale } from "@/lib/i18n";

export default async function RegisterPage() {
  const locale = await getLocale();
  const messages = (await import(`@/messages/${locale}.json`)).default;
  const t = messages.auth.register;

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
      bottomText={t.hasAccount}
      bottomLinkText={t.signIn}
      bottomLinkHref="/login"
    >
      <RegisterForm />
    </AuthSplitLayout>
  );
}
