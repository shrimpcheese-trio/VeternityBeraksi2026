"use client";

import { useActionState, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { GoogleAuthButton } from "@/components/shared/google-auth-button";
import { signInWithEmail, signInWithPhone, sendOtp, verifyOtp } from "@/lib/actions/auth";
import type { AuthState } from "@/types/auth";

const initialState: AuthState = { error: null, success: false };

export function LoginForm() {
  const [tab, setTab] = useState<"email" | "phone">("email");
  const [phoneMode, setPhoneMode] = useState<"password" | "otp">("password");
  const [phoneNumber, setPhoneNumber] = useState("");
  const phoneRef = useRef<HTMLInputElement>(null);

  const [emailState, emailAction, emailPending] = useActionState(signInWithEmail, initialState);
  const [phoneState, phoneAction, phonePending] = useActionState(signInWithPhone, initialState);
  const [sendOtpState, sendOtpAction, sendOtpPending] = useActionState(sendOtp, initialState);
  const [verifyOtpState, verifyOtpAction, verifyOtpPending] = useActionState(verifyOtp, initialState);

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPhoneNumber(e.target.value);
  }

  if (tab === "phone" && phoneMode === "otp") {
    if (sendOtpState.otpSent) {
      return (
        <div>
          <div className="mb-6 flex rounded-lg border border-border p-1">
            <button type="button" onClick={() => { setTab("email"); setPhoneMode("password"); }}
              className="flex-1 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >Email</button>
            <button type="button" onClick={() => setTab("phone")}
              className="flex-1 rounded-md px-3 py-2 text-sm font-medium bg-primary text-primary-foreground transition-colors"
            >Telepon</button>
          </div>

          <form action={verifyOtpAction}>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Kode OTP telah dikirim ke {phoneNumber}
              </p>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Kode OTP</label>
                <input name="phone" type="hidden" value={phoneNumber} />
                <input
                  name="token" type="text" required maxLength={6} placeholder="123456" autoFocus
                  className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                />
              </div>
              {verifyOtpState.error && <p className="text-sm text-destructive">{verifyOtpState.error}</p>}
              <Button type="submit" className="w-full" disabled={verifyOtpPending}>
                {verifyOtpPending ? "Memverifikasi..." : "Verifikasi"}
              </Button>
            </div>
          </form>
        </div>
      );
    }

    return (
      <div>
        <div className="mb-6 flex rounded-lg border border-border p-1">
          <button type="button" onClick={() => { setTab("email"); setPhoneMode("password"); }}
            className="flex-1 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >Email</button>
          <button type="button" onClick={() => setTab("phone")}
            className="flex-1 rounded-md px-3 py-2 text-sm font-medium bg-primary text-primary-foreground transition-colors"
          >Telepon</button>
        </div>

        <form action={sendOtpAction}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Nomor Telepon</label>
              <input
                name="phone" type="tel" required placeholder="08123456789" ref={phoneRef}
                onChange={handlePhoneChange}
                className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
              />
            </div>
            {sendOtpState.error && <p className="text-sm text-destructive">{sendOtpState.error}</p>}
            <Button type="submit" className="w-full" disabled={sendOtpPending}>
              {sendOtpPending ? "Mengirim..." : "Kirim OTP"}
            </Button>
          </div>
        </form>

        <p className="mt-4 text-center">
          <button type="button" onClick={() => setPhoneMode("password")}
            className="text-sm text-primary hover:underline"
          >Login dengan password</button>
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex rounded-lg border border-border p-1">
        <button type="button" onClick={() => { setTab("email"); setPhoneMode("password"); }}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            tab === "email" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >Email</button>
        <button type="button" onClick={() => setTab("phone")}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            tab === "phone" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >Telepon</button>
      </div>

      <form action={tab === "email" ? emailAction : phoneAction}>
        <div className="space-y-4">
          {tab === "email" ? (
            <>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                <input id="email" name="email" type="email" required placeholder="nama@email.com"
                  className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">Password</label>
                <input id="password" name="password" type="password" required placeholder="Masukkan password"
                  className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1.5">Nomor Telepon</label>
                <input id="phone" name="phone" type="tel" required placeholder="08123456789" ref={phoneRef}
                  onChange={handlePhoneChange}
                  className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">Password</label>
                <input id="password" name="password" type="password" required placeholder="Masukkan password"
                  className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                />
              </div>
            </>
          )}

          {(tab === "email" ? emailState.error : phoneState.error) && (
            <p className="text-sm text-destructive">{tab === "email" ? emailState.error : phoneState.error}</p>
          )}

          <Button type="submit" className="w-full" disabled={tab === "email" ? emailPending : phonePending}>
            {tab === "email" ? (emailPending ? "Memproses..." : "Masuk") : (phonePending ? "Memproses..." : "Masuk")}
          </Button>
        </div>
      </form>

      {tab === "phone" && (
        <p className="mt-4 text-center">
          <button type="button" onClick={() => setPhoneMode("otp")}
            className="text-sm text-primary hover:underline"
          >Login dengan OTP</button>
        </p>
      )}

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-card px-2 text-muted-foreground">atau</span>
        </div>
      </div>

      <GoogleAuthButton />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Belum punya akun?{" "}
        <a href="/register" className="text-primary hover:underline">Daftar</a>
      </p>
    </div>
  );
}


