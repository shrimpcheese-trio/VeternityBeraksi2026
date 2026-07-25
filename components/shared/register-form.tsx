"use client";

import { useActionState, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { GoogleAuthButton } from "@/components/shared/google-auth-button";
import { signUpWithEmail, signUpWithPhone, verifyOtp } from "@/lib/actions/auth";
import type { AuthState } from "@/types/auth";

const initialState: AuthState = { error: null, success: false };

export function RegisterForm() {
  const [tab, setTab] = useState<"email" | "phone">("email");
  const [role, setRole] = useState<"worker" | "employer">("worker");
  const [phoneNumber, setPhoneNumber] = useState("");
  const phoneRef = useRef<HTMLInputElement>(null);

  const [emailState, emailAction, emailPending] = useActionState(signUpWithEmail, initialState);
  const [phoneState, phoneAction, phonePending] = useActionState(signUpWithPhone, initialState);
  const [verifyOtpState, verifyOtpAction, verifyOtpPending] = useActionState(verifyOtp, initialState);

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPhoneNumber(e.target.value);
  }

  if (tab === "phone" && phoneState.otpSent) {
    return (
      <div>
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
        <button type="button" onClick={() => setTab("email")}
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
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Nama Lengkap</label>
            <input name="fullName" type="text" required placeholder="Budi Santoso"
              className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
            />
          </div>

          {tab === "email" ? (
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
              <input name="email" type="email" required placeholder="nama@email.com"
                className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Nomor Telepon</label>
              <input name="phone" type="tel" required placeholder="08123456789" ref={phoneRef}
                onChange={handlePhoneChange}
                className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
            <input name="password" type="password" required placeholder="Minimal 8 karakter"
              className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Daftar sebagai</label>
            <div className="flex gap-3">
              <label className={`flex flex-1 cursor-pointer items-center justify-center rounded-lg border px-3 py-2 text-sm transition-colors ${
                role === "worker" ? "border-primary bg-primary/5 text-primary" : "border-input hover:border-muted-foreground"
              }`}>
                <input type="radio" name="role" value="worker" checked={role === "worker"}
                  onChange={() => setRole("worker")} className="sr-only"
                />
                Pekerja
              </label>
              <label className={`flex flex-1 cursor-pointer items-center justify-center rounded-lg border px-3 py-2 text-sm transition-colors ${
                role === "employer" ? "border-primary bg-primary/5 text-primary" : "border-input hover:border-muted-foreground"
              }`}>
                <input type="radio" name="role" value="employer" checked={role === "employer"}
                  onChange={() => setRole("employer")} className="sr-only"
                />
                Pemberi Kerja
              </label>
            </div>
          </div>

          {(tab === "email" ? emailState.error : phoneState.error) && (
            <p className="text-sm text-destructive">{tab === "email" ? emailState.error : phoneState.error}</p>
          )}

          <Button type="submit" className="w-full" disabled={tab === "email" ? emailPending : phonePending}>
            {tab === "email" ? (emailPending ? "Memproses..." : "Daftar") : (phonePending ? "Memproses..." : "Daftar")}
          </Button>
        </div>
      </form>

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
        Sudah punya akun?{" "}
        <a href="/login" className="text-primary hover:underline">Masuk</a>
      </p>
    </div>
  );
}
