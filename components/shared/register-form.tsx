"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoogleAuthButton } from "@/components/shared/google-auth-button";
import { PasswordInput } from "@/components/shared/password-input";
import { signUpWithEmail } from "@/lib/actions/auth";
import type { AuthState } from "@/types/auth";

const initialState: AuthState = { error: null, success: false };

export function RegisterForm() {
  const t = useTranslations("auth.register");
  const [state, action, pending] = useActionState(
    signUpWithEmail,
    initialState,
  );

  return (
    <div>
      <form action={action}>
        <div className="space-y-5">
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-semibold text-navy mb-2"
            >
              {t("nameLabel")}
            </label>
            <div className="relative">
              <User
                size={18}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                placeholder={t("namePlaceholder")}
                className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3.5 pl-11 pr-4 text-sm text-navy outline-none transition-all focus:border-sky focus:bg-white focus:ring-4 focus:ring-sky/10"
              />
            </div>
          </div>

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

          {state.error && (
            <p className="text-sm text-red-500 font-medium bg-red-50 p-3 rounded-lg border border-red-100">
              {state.error}
            </p>
          )}

          <Button
            type="submit"
            className="w-full rounded-full py-6 text-base font-semibold bg-navy hover:bg-navy/90 hover:shadow-[0_8px_20px_-6px_rgba(10,37,64,0.3)] transition-all duration-300 mt-2"
            disabled={pending}
          >
            {pending ? "..." : t("createAccount")}
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
