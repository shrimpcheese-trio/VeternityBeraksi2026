"use client";

import { useActionState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoogleAuthButton } from "@/components/shared/google-auth-button";
import { PasswordInput } from "@/components/shared/password-input";
import { signUpWithEmail } from "@/lib/actions/auth";
import type { AuthState } from "@/types/auth";

const initialState: AuthState = { error: null, success: false };

function useGsapFade(ref: React.RefObject<HTMLElement | null>, deps: unknown[] = []) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let active = true;
    let ctx: gsap.Context | undefined;
    (async () => {
      const gsap = (await import("gsap")).default;
      if (!active) return;
      ctx = gsap.context(() => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.3)" },
        );
      });
    })();
    return () => { active = false; ctx?.revert(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export function RegisterForm() {
  const t = useTranslations("auth.register");
  const ref = useRef<HTMLDivElement>(null);

  const [state, action, pending] = useActionState(signUpWithEmail, initialState);

  useGsapFade(ref, []);

  return (
    <div ref={ref}>
      <form action={action}>
        <div className="space-y-5">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-1.5">
              {t("nameLabel")}
            </label>
            <div className="relative">
              <User size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-soft" />
              <input id="fullName" name="fullName" type="text" required placeholder={t("namePlaceholder")}
                className="block w-full rounded-lg border border-input bg-background py-3 pl-9 pr-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
              {t("emailLabel")}
            </label>
            <div className="relative">
              <Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-soft" />
              <input id="email" name="email" type="email" required placeholder={t("emailPlaceholder")}
                className="block w-full rounded-lg border border-input bg-background py-3 pl-9 pr-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
              />
            </div>
          </div>

          <div>
            <PasswordInput
              name="password"
              label={t("passwordLabel")}
              placeholder={t("passwordPlaceholder")}
              required
            />
          </div>

          <div>
            <p className="block text-sm font-medium text-foreground mb-2">
              {t("roleLabel")}
            </p>
            <div className="flex gap-3">
              <label className="flex flex-1 cursor-pointer items-center justify-center rounded-lg border border-primary bg-primary/5 px-3 py-3 text-sm text-primary transition-colors">
                <input type="radio" name="role" value="worker" defaultChecked
                  className="sr-only"
                />
                {t("roleWorker")}
              </label>
              <label className="flex flex-1 cursor-pointer items-center justify-center rounded-lg border border-input px-3 py-3 text-sm transition-colors hover:border-muted-foreground">
                <input type="radio" name="role" value="employer"
                  className="sr-only"
                />
                {t("roleEmployer")}
              </label>
            </div>
          </div>

          {state.error && <p className="text-sm text-destructive">{state.error}</p>}

          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "..." : t("createAccount")}
          </Button>
        </div>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-card px-2 text-muted-foreground">{t("dividerText")}</span>
        </div>
      </div>

      <div><GoogleAuthButton /></div>
    </div>
  );
}
