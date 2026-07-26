"use client";

import { useActionState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoogleAuthButton } from "@/components/shared/google-auth-button";
import { PasswordInput } from "@/components/shared/password-input";
import { signInWithEmail } from "@/lib/actions/auth";
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

export function LoginForm() {
  const t = useTranslations("auth.login");
  const ref = useRef<HTMLDivElement>(null);

  const [state, action, pending] = useActionState(signInWithEmail, initialState);

  useGsapFade(ref, []);

  return (
    <div ref={ref}>
      <form action={action}>
        <div className="space-y-5">
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

          <div className="flex items-center justify-between">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" name="remember"
                className="size-4 rounded border-border text-primary focus:ring-primary/30"
              />
              {t("rememberMe")}
            </label>
            <a href="/forgot-password" className="text-sm font-medium text-primary hover:underline">
              {t("forgotPassword")}
            </a>
          </div>

          {state.error && <p className="text-sm text-destructive">{state.error}</p>}

          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "..." : t("signIn")}
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
