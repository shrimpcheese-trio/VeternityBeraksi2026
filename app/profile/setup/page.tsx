"use client";

import { useActionState, useRef, useState, startTransition } from "react";
import {
  User,
  MapPin,
  Briefcase,
  Clock,
  Phone,
  Building2,
  Wrench,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { completeProfileSetup } from "@/lib/actions/auth";
import type { AuthState } from "@/types/auth";

const initialState: AuthState = { error: null, success: false };

const CATEGORY_EXAMPLES = [
  "Tukang Bangunan",
  "Montir Mobil",
  "Fotografer",
  "Teknisi AC",
  "Guru Les",
];

function ProgressDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`size-2 rounded-full transition-colors ${
            i <= current ? "bg-primary" : "bg-muted"
          }`}
        />
      ))}
    </div>
  );
}

export default function ProfileSetupPage() {
  const [step, setStep] = useState(0);
  const [role, setRole] = useState<"worker" | "employer">("worker");
  const [state, action, pending] = useActionState(
    completeProfileSetup,
    initialState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = () => {
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    startTransition(() => {
      action(formData);
    });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 size-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 size-96 rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md px-4">
        <div className="mb-8 text-center">
          <div className="mx-auto flex size-10 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white">
            U
          </div>
        </div>

        <form ref={formRef} onSubmit={(e) => e.preventDefault()}>
          <div className="rounded-2xl border border-border bg-background p-8 shadow-lg">
            <div className={step !== 0 ? "hidden" : undefined}>
              <div>
                <h2 className="text-xl font-bold">Siapa nama Anda?</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Nama sesuai KTP atau identitas resmi
                </p>

                <div className="mt-6 space-y-4">
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-foreground">
                      <User className="size-4 text-muted-foreground" />
                      Nama Lengkap
                    </label>
                    <Input
                      name="fullName"
                      type="text"
                      required={step === 0}
                      placeholder="Budi Santoso"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-foreground">
                      <MapPin className="size-4 text-muted-foreground" />
                      Kota
                    </label>
                    <Input
                      name="city"
                      type="text"
                      required={step === 0}
                      placeholder="Jakarta Selatan"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      Kota tempat Anda bekerja atau berdomisili
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className={step !== 1 ? "hidden" : undefined}>
              <div>
                <h2 className="text-xl font-bold">
                  Anda ingin mendaftar sebagai?
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Pilih peran yang sesuai
                </p>

                <div className="mt-6 space-y-3">
                  <button
                    type="button"
                    onClick={() => setRole("worker")}
                    className={`flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-all ${
                      role === "worker"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-muted-foreground/40"
                    }`}
                  >
                    <div
                      className={`flex size-10 shrink-0 items-center justify-center rounded-full transition-colors ${
                        role === "worker"
                          ? "bg-primary text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Wrench className="size-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">Pekerja</p>
                      <p className="text-sm text-muted-foreground">
                        Saya mencari proyek dan ingin membangun reputasi
                      </p>
                    </div>
                    {role === "worker" && (
                      <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary">
                        <Check className="size-3.5 text-white" />
                      </div>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole("employer")}
                    className={`flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-all ${
                      role === "employer"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-muted-foreground/40"
                    }`}
                  >
                    <div
                      className={`flex size-10 shrink-0 items-center justify-center rounded-full transition-colors ${
                        role === "employer"
                          ? "bg-primary text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Building2 className="size-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">Pemberi Kerja</p>
                      <p className="text-sm text-muted-foreground">
                        Saya mencari pekerja terpercaya untuk proyek saya
                      </p>
                    </div>
                    {role === "employer" && (
                      <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary">
                        <Check className="size-3.5 text-white" />
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className={step !== 2 ? "hidden" : undefined}>
              <div className={role !== "worker" ? "hidden" : undefined}>
                <h2 className="text-xl font-bold">Apa bidang keahlian Anda?</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Pilih kategori yang sesuai dengan keahlian Anda
                </p>

                <div className="mt-6 space-y-4">
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-foreground">
                      <Briefcase className="size-4 text-muted-foreground" />
                      Kategori Pekerjaan
                    </label>
                    <Input
                      name="jobCategory"
                      type="text"
                      required={role === "worker"}
                      placeholder={CATEGORY_EXAMPLES[0]}
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      Contoh: {CATEGORY_EXAMPLES.join(", ")}
                    </p>
                  </div>

                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-foreground">
                      <Clock className="size-4 text-muted-foreground" />
                      Pengalaman
                    </label>
                    <Input
                      name="yearsExperience"
                      type="number"
                      required={role === "worker"}
                      placeholder="5"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      Lama pengalaman dalam tahun
                    </p>
                  </div>
                </div>
              </div>

              <div className={role !== "employer" ? "hidden" : undefined}>
                <h2 className="text-xl font-bold">
                  Informasi perusahaan Anda?
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Data ini akan ditampilkan di profil Anda
                </p>

                <div className="mt-6 space-y-4">
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-foreground">
                      <Building2 className="size-4 text-muted-foreground" />
                      Nama Perusahaan
                    </label>
                    <Input
                      name="companyName"
                      type="text"
                      placeholder="CV. Karya Mandiri"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      Nama bisnis atau perusahaan Anda (opsional)
                    </p>
                  </div>

                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-foreground">
                      <Phone className="size-4 text-muted-foreground" />
                      No Telepon
                    </label>
                    <Input
                      name="phone"
                      type="tel"
                      placeholder="+62 812-3456-7890"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      Nomor yang bisa dihubungi pelanggan (opsional)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <input type="hidden" name="role" value={role} />

            {state.error && (
              <p className="mt-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {state.error}
              </p>
            )}

            <div className="mt-8 flex items-center justify-between">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  Kembali
                </button>
              ) : (
                <div />
              )}
              {step < 2 ? (
                <Button type="button" onClick={() => setStep(step + 1)}>
                  Lanjutkan
                </Button>
              ) : (
                <Button type="button" onClick={handleSubmit} disabled={pending}>
                  {pending ? "Menyimpan..." : "Simpan"}
                </Button>
              )}
            </div>
          </div>

          <div className="mt-6">
            <ProgressDots total={3} current={step} />
          </div>
        </form>
      </div>
    </div>
  );
}
