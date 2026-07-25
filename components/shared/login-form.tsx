"use client";

import { useActionState, useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Mail, Phone, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoogleAuthButton } from "@/components/shared/google-auth-button";
import { PasswordInput } from "@/components/shared/password-input";
import { signInWithEmail, signInWithPhone, sendOtp, verifyOtp } from "@/lib/actions/auth";
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
  const [tab, setTab] = useState<"email" | "phone">("email");
  const [phoneMode, setPhoneMode] = useState<"password" | "otp">("password");
  const [phoneNumber, setPhoneNumber] = useState("");
  const phoneRef = useRef<HTMLInputElement>(null);

  const mainRef = useRef<HTMLDivElement>(null);
  const otpSendRef = useRef<HTMLDivElement>(null);
  const otpVerifyRef = useRef<HTMLDivElement>(null);

  const [emailState, emailAction, emailPending] = useActionState(signInWithEmail, initialState);
  const [phoneState, phoneAction, phonePending] = useActionState(signInWithPhone, initialState);
  const [sendOtpState, sendOtpAction, sendOtpPending] = useActionState(sendOtp, initialState);
  const [verifyOtpState, verifyOtpAction, verifyOtpPending] = useActionState(verifyOtp, initialState);

  useGsapFade(mainRef, [tab, phoneMode]);
  useGsapFade(otpSendRef, [sendOtpState.otpSent]);
  useGsapFade(otpVerifyRef, [verifyOtpState.otpSent]);

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPhoneNumber(e.target.value);
  }

  const isPhoneOtp = tab === "phone" && phoneMode === "otp";

  if (isPhoneOtp) {
    if (sendOtpState.otpSent) {
      return (
        <div ref={otpVerifyRef}>
          <div className="mb-5 flex rounded-lg border border-border p-1">
            <TabButton active={false} onClick={() => { setTab("email"); setPhoneMode("password"); }}>
              Email
            </TabButton>
            <TabButton active={true} onClick={() => setTab("phone")}>
              Telepon
            </TabButton>
          </div>

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
                      className="block w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
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

    return (
      <div ref={otpSendRef}>
        <div className="mb-5 flex rounded-lg border border-border p-1">
          <TabButton active={false} onClick={() => { setTab("email"); setPhoneMode("password"); }}>
            Email
          </TabButton>
          <TabButton active={true} onClick={() => setTab("phone")}>
            Telepon
          </TabButton>
        </div>

        <form action={sendOtpAction}>
          <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Nomor Telepon</label>
                <div className="relative">
                  <Phone size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-soft" />
                  <input
                    name="phone" type="tel" required placeholder="08123456789" ref={phoneRef}
                    onChange={handlePhoneChange}
                    className="block w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                  />
                </div>
              </div>
            {sendOtpState.error && <p className="text-sm text-destructive">{sendOtpState.error}</p>}
            <Button type="submit" className="w-full" disabled={sendOtpPending}>
              {sendOtpPending ? "..." : "Kirim OTP"}
            </Button>
          </div>
        </form>

        <p className="mt-4 text-center">
          <button type="button" onClick={() => setPhoneMode("password")}
            className="text-sm text-primary hover:underline"
          >
            Login dengan password
          </button>
        </p>
      </div>
    );
  }

  return (
    <div ref={mainRef}>
      <div className="mb-5 flex rounded-lg border border-border p-1">
        <TabButton active={tab === "email"} onClick={() => { setTab("email"); setPhoneMode("password"); }}>
          Email
        </TabButton>
        <TabButton active={tab === "phone"} onClick={() => setTab("phone")}>
          Telepon
        </TabButton>
      </div>

      <form action={tab === "email" ? emailAction : phoneAction}>
        <div className="space-y-5">
          {tab === "email" ? (
            <>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                  {t("emailLabel")}
                </label>
                <div className="relative">
                  <Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-soft" />
                  <input id="email" name="email" type="email" required placeholder={t("emailPlaceholder")}
                    className="block w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
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
            </>
          ) : (
            <>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1.5">
                  Nomor Telepon
                </label>
                <div className="relative">
                  <Phone size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-soft" />
                  <input id="phone" name="phone" type="tel" required placeholder="08123456789" ref={phoneRef}
                    onChange={handlePhoneChange}
                    className="block w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
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
            </>
          )}

          {(tab === "email" ? emailState.error : phoneState.error) && (
            <p className="text-sm text-destructive">
              {tab === "email" ? emailState.error : phoneState.error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={tab === "email" ? emailPending : phonePending}>
            {(tab === "email" ? emailPending : phonePending) ? "..." : t("signIn")}
          </Button>
        </div>
      </form>

      {tab === "phone" && (
        <p className="mt-4 text-center">
          <button type="button" onClick={() => setPhoneMode("otp")}
            className="text-sm text-primary hover:underline"
          >
            Login dengan OTP
          </button>
        </p>
      )}

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
      className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
        active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
