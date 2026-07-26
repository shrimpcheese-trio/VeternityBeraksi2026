"use client";

import { useActionState, useState } from "react";
import { User, MapPin, Briefcase, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthSplitLayout } from "@/components/shared/auth-split-layout";
import { completeProfileSetup } from "@/lib/actions/auth";
import type { AuthState } from "@/types/auth";

const initialState: AuthState = { error: null, success: false };

export default function ProfileSetupPage() {
  const [role, setRole] = useState<"worker" | "employer">("worker");
  const [state, action, pending] = useActionState(completeProfileSetup, initialState);

  return (
    <AuthSplitLayout
      brandName="Upahku"
      heading="Lengkapi Profil"
      subtext="Isi data diri Anda untuk melanjutkan"
      bottomText=""
      bottomLinkText="Kembali ke Beranda"
      bottomLinkHref="/"
    >
      <form action={action}>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Nama Lengkap</label>
            <div className="relative">
              <User size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-soft" />
              <input
                name="fullName" type="text" required placeholder="Budi Santoso"
                className="block w-full rounded-lg border border-input bg-background py-3 pl-9 pr-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Kota</label>
            <div className="relative">
              <MapPin size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-soft" />
              <input
                name="city" type="text" required placeholder="Jakarta Selatan"
                className="block w-full rounded-lg border border-input bg-background py-3 pl-9 pr-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Kategori Pekerjaan</label>
            <div className="relative">
              <Briefcase size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-soft" />
              <input
                name="jobCategory" type="text" required placeholder="Tukang, Montir, Fotografer, dll"
                className="block w-full rounded-lg border border-input bg-background py-3 pl-9 pr-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Pengalaman (tahun)</label>
            <div className="relative">
              <Clock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-soft" />
              <input
                name="yearsExperience" type="number" min="0" required placeholder="0"
                className="block w-full rounded-lg border border-input bg-background py-3 pl-9 pr-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
              />
            </div>
          </div>

          <div>
            <p className="block text-sm font-medium text-foreground mb-2">Saya adalah</p>
            <div className="flex gap-3">
              <label className={`flex flex-1 cursor-pointer items-center justify-center rounded-lg border px-3 py-3 text-sm transition-colors ${
                role === "worker" ? "border-primary bg-primary/5 text-primary" : "border-input hover:border-muted-foreground"
              }`}>
                <input type="radio" name="role" value="worker" checked={role === "worker"}
                  onChange={() => setRole("worker")} className="sr-only"
                />
                Pekerja
              </label>
              <label className={`flex flex-1 cursor-pointer items-center justify-center rounded-lg border px-3 py-3 text-sm transition-colors ${
                role === "employer" ? "border-primary bg-primary/5 text-primary" : "border-input hover:border-muted-foreground"
              }`}>
                <input type="radio" name="role" value="employer" checked={role === "employer"}
                  onChange={() => setRole("employer")} className="sr-only"
                />
                Pemberi Kerja
              </label>
            </div>
          </div>

          {state.error && <p className="text-sm text-destructive">{state.error}</p>}

          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Menyimpan..." : "Simpan & Lanjutkan"}
          </Button>
        </div>
      </form>
    </AuthSplitLayout>
  );
}
