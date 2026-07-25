"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { profileSetupSchema } from "@/lib/schemas/auth";
import { AuthLayout } from "@/components/shared/auth-layout";

interface ProfileSetupState {
  error: string | null;
  success: boolean;
}

const initialState: ProfileSetupState = { error: null, success: false };

export default function ProfileSetupPage() {
  const [role, setRole] = useState<"worker" | "employer">("worker");
  const [state, submitAction, isPending] = useActionState(handleSubmit, initialState);
  const router = useRouter();

  async function handleSubmit(prevState: ProfileSetupState, formData: FormData): Promise<ProfileSetupState> {
    const parsed = profileSetupSchema.safeParse({
      fullName: formData.get("fullName"),
      city: formData.get("city"),
      jobCategory: formData.get("jobCategory"),
      yearsExperience: formData.get("yearsExperience"),
      role: formData.get("role"),
    });

    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? "Data tidak valid", success: false };
    }

    const { fullName, city, jobCategory, yearsExperience } = parsed.data;

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Sesi tidak ditemukan", success: false };
    }

    await supabase.auth.updateUser({
      data: { full_name: fullName, role },
    });

    if (role === "worker") {
      const { error } = await supabase.from("worker_profiles").insert({
        worker_id: user.id,
        full_name: fullName,
        city,
        job_category: jobCategory,
        years_experience: yearsExperience,
      });

      if (error) return { error: error.message, success: false };
    }

    router.push(`/${role}/dashboard`);
    return { error: null, success: true };
  }

  return (
    <AuthLayout title="Lengkapi Profil" description="Isi data diri Anda untuk melanjutkan">
      <form action={submitAction}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Nama Lengkap</label>
            <input
              name="fullName" type="text" required placeholder="Budi Santoso"
              className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Kota</label>
            <input
              name="city" type="text" required placeholder="Jakarta Selatan"
              className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Kategori Pekerjaan</label>
            <input
              name="jobCategory" type="text" required placeholder="Tukang, Montir, Fotografer, dll"
              className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Pengalaman (tahun)</label>
            <input
              name="yearsExperience" type="number" min="0" required placeholder="0"
              className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Saya adalah</label>
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

          {state.error && <p className="text-sm text-destructive">{state.error}</p>}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Menyimpan..." : "Simpan & Lanjutkan"}
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}
