"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoogleAuthButton } from "@/components/shared/google-auth-button";
import { PasswordInput } from "@/components/shared/password-input";
import { signInWithEmail } from "@/lib/actions/auth";
import type { AuthState } from "@/types/auth";

const initialState: AuthState = { error: null, success: false };

export function LoginForm() {
  const t = useTranslations("auth.login");
  const [state, action, pending] = useActionState(
    signInWithEmail,
    initialState,
  );

  return (
    <div>
      <form action={action}>
        <div className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-navy mb-2"
            >
              {t("emailLabel")}
            </label>
            <div className="relative">
              <Mail
                size={18}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder={t("emailPlaceholder")}
                className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3.5 pl-11 pr-4 text-sm text-navy outline-none transition-all focus:border-sky focus:bg-white focus:ring-4 focus:ring-sky/10"
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

          <div className="flex items-center justify-between pt-1">
            <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-slate-500 hover:text-navy transition-colors">
              <input
                type="checkbox"
                name="remember"
                className="size-4.5 rounded-[6px] border-slate-300 text-sky focus:ring-sky/30 transition-colors"
              />
              {t("rememberMe")}
            </label>
            <a
              href="/forgot-password"
              className="text-sm font-bold text-sky hover:text-navy transition-colors"
            >
              {t("forgotPassword")}
            </a>
          </div>

          {state.error && (
            <p className="text-sm text-red-500 font-medium bg-red-50 p-3 rounded-lg border border-red-100">
              {state.error}
            </p>
          )}

          <Button
            type="submit"
            className="w-full rounded-full py-6 text-base font-semibold bg-navy hover:bg-navy/90 hover:shadow-[0_8px_20px_-6px_rgba(10,37,64,0.3)] transition-all duration-300"
            disabled={pending}
          >
            {pending ? "..." : t("signIn")}
          </Button>
        </div>
      </form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-4 font-medium uppercase tracking-wider text-slate-400">
            {t("dividerText")}
          </span>
        </div>
      </div>

      <div>
        <GoogleAuthButton />
      </div>
    </div>
  );
}
