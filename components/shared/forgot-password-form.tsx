"use client";

import { useRef, useEffect, useActionState } from "react";
import { useTranslations } from "next-intl";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sendPasswordResetEmail } from "@/lib/actions/auth";
import type { AuthState } from "@/types/auth";

const initialState: AuthState = { error: null, success: false };

export function ForgotPasswordForm() {
  const t = useTranslations("auth.forgotPassword");
  const [state, action, pending] = useActionState(
    sendPasswordResetEmail,
    initialState,
  );
  const successRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const container = successRef.current;
    if (!container) return;
    let active = true;
    let ctx: gsap.Context | undefined;
    (async () => {
      const gsap = (await import("gsap")).default;
      if (!active) return;
      ctx = gsap.context(() => {
        gsap.fromTo(
          container.querySelectorAll<HTMLElement>("[data-gsap]"),
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, stagger: 0.08, duration: 0.4, ease: "back.out(1.3)" },
        );
      });
    })();
    return () => { active = false; ctx?.revert(); };
  }, [state.success]);

  useEffect(() => {
    const container = formRef.current;
    if (!container) return;
    let active = true;
    let ctx: gsap.Context | undefined;
    (async () => {
      const gsap = (await import("gsap")).default;
      if (!active) return;
      ctx = gsap.context(() => {
        gsap.fromTo(
          container.querySelectorAll<HTMLElement>("[data-gsap]"),
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, stagger: 0.08, duration: 0.4, ease: "back.out(1.3)" },
        );
      });
    })();
    return () => { active = false; ctx?.revert(); };
  }, []);

  if (state.success) {
    return (
      <div ref={successRef} className="text-center">
        <h3 data-gsap className="font-heading text-xl font-bold">
          {t("sentHeading")}
        </h3>
        <p data-gsap className="mt-2 text-sm text-muted-foreground">
          {t("sentText")}
        </p>
        <a data-gsap
          href="/login"
          className="mt-6 inline-block text-sm font-medium text-primary hover:underline"
        >
          {t("backToLogin")}
        </a>
      </div>
    );
  }

  return (
    <form ref={formRef} action={action}>
      <div className="space-y-5">
        <div data-gsap>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            {t("emailLabel")}
          </label>
          <div className="relative">
            <Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-soft" />
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder={t("emailPlaceholder")}
              className="block w-full rounded-lg border border-input bg-background py-3 pl-9 pr-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
            />
          </div>
        </div>

        {state.error && (
          <p data-gsap className="text-sm text-destructive">{state.error}</p>
        )}

        <Button data-gsap type="submit" className="w-full" disabled={pending}>
          {pending ? t("sending") : t("sendLink")}
        </Button>
      </div>

      <p data-gsap className="mt-6 text-center">
        <a
          href="/login"
          className="text-sm font-medium text-primary hover:underline"
        >
          {t("backToLogin")}
        </a>
      </p>
    </form>
  );
}
