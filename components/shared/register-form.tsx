"use client";

import { useActionState, useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Mail, Phone, User, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoogleAuthButton } from "@/components/shared/google-auth-button";
import { PasswordInput } from "@/components/shared/password-input";
import { signUpWithEmail, signUpWithPhone, verifyOtp } from "@/lib/actions/auth";
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
  const [tab, setTab] = useState<"email" | "phone">("email");
  const [role, setRole] = useState<"worker" | "employer">("worker");
  const [phoneNumber, setPhoneNumber] = useState("");
  const phoneRef = useRef<HTMLInputElement>(null);

  const mainRef = useRef<HTMLDivElement>(null);
  const otpVerifyRef = useRef<HTMLDivElement>(null);

  const [emailState, emailAction, emailPending] = useActionState(signUpWithEmail, initialState);
  const [phoneState, phoneAction, phonePending] = useActionState(signUpWithPhone, initialState);
  const [verifyOtpState, verifyOtpAction, verifyOtpPending] = useActionState(verifyOtp, initialState);

  useGsapFade(mainRef, [tab]);
  useGsapFade(otpVerifyRef, [verifyOtpState.otpSent]);

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPhoneNumber(e.target.value);
  }

  if (tab === "phone" && phoneState.otpSent) {
    return (
      <div ref={otpVerifyRef}>
        <form action={verifyOtpAction}>
          <div className="space-y-5">
            <p className="text-sm text-muted-foreground">
              Kode OTP telah dikirim ke {phoneNumber}
            </p>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Kode OTP</label>
                <input name="phone" type="hidden" value={phoneNumber} />
                <div className="relative">
                  <KeyRound size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-soft" />
                  <input
                    name="token" type="text" required maxLength={6} placeholder="123456" autoFocus
                    className="block w-full rounded-lg border border-input bg-background py-3 pl-9 pr-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                  />
                </div>
              </div>
            {verifyOtpState.error && <p className="text-sm text-destructive">{verifyOtpState.error}</p>}
            <Button type="submit" className="w-full" disabled={verifyOtpPending}>
              {verifyOtpPending ? "..." : "Verifikasi"}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  const activeAction = tab === "email" ? emailAction : phoneAction;
  const activePending = tab === "email" ? emailPending : phonePending;
  const activeError = tab === "email" ? emailState.error : phoneState.error;

  return (
    <div ref={mainRef}>
      <div className="mb-5 flex rounded-lg border border-border p-1">
        <TabButton active={tab === "email"} onClick={() => setTab("email")}>
          Email
        </TabButton>
        <TabButton active={tab === "phone"} onClick={() => setTab("phone")}>
          Telepon
        </TabButton>
      </div>

      <form action={activeAction}>
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

          {tab === "email" ? (
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
          ) : (
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1.5">
                Nomor Telepon
              </label>
              <div className="relative">
                <Phone size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-soft" />
                <input id="phone" name="phone" type="tel" required placeholder="08123456789" ref={phoneRef}
                  onChange={handlePhoneChange}
                  className="block w-full rounded-lg border border-input bg-background py-3 pl-9 pr-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                />
              </div>
            </div>
          )}

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
              <label className={`flex flex-1 cursor-pointer items-center justify-center rounded-lg border px-3 py-3 text-sm transition-colors ${
                role === "worker" ? "border-primary bg-primary/5 text-primary" : "border-input hover:border-muted-foreground"
              }`}>
                <input type="radio" name="role" value="worker" checked={role === "worker"}
                  onChange={() => setRole("worker")} className="sr-only"
                />
                {t("roleWorker")}
              </label>
              <label className={`flex flex-1 cursor-pointer items-center justify-center rounded-lg border px-3 py-3 text-sm transition-colors ${
                role === "employer" ? "border-primary bg-primary/5 text-primary" : "border-input hover:border-muted-foreground"
              }`}>
                <input type="radio" name="role" value="employer" checked={role === "employer"}
                  onChange={() => setRole("employer")} className="sr-only"
                />
                {t("roleEmployer")}
              </label>
            </div>
          </div>

          {activeError && <p className="text-sm text-destructive">{activeError}</p>}

          <Button type="submit" className="w-full" disabled={activePending}>
            {activePending ? "..." : t("createAccount")}
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

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: string }) {
  return (
    <button type="button" onClick={onClick}
      className={`flex-1 rounded-md px-3 py-3 text-sm font-medium transition-colors ${
        active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
