"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { workerUpdateSchema } from "@/lib/validators/worker";
import { updateWorker, deleteWorker } from "@/lib/repositories/worker.repo";
import { revalidatePath } from "next/cache";

type SettingsResult = { error: string | null; success: boolean };

const employerSettingsSchema = z.object({
  name: z.string().min(1, "Nama tidak boleh kosong"),
  city: z.string().optional().default(""),
  phone: z.string().optional().default(""),
});

export async function updateAccount(_prevState: SettingsResult, formData: FormData): Promise<SettingsResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Sesi tidak ditemukan", success: false };

  try {
    const name = formData.get("name")?.toString().trim();
    const phone = formData.get("phone")?.toString().trim();
    const city = formData.get("city")?.toString().trim();
    const bio = formData.get("bio")?.toString().trim();
    const locationVisible = formData.get("locationVisible") === "true";

    const role = user.user_metadata?.role as string | undefined;

    if (role === "employer") {
      const parsed = employerSettingsSchema.safeParse({ name, city: city ?? "", phone: phone ?? "" });
      if (!parsed.success) {
        return { error: parsed.error.issues[0]?.message ?? "Data tidak valid", success: false };
      }
      const empUpdate: Record<string, string | null> = { company_name: parsed.data.name };
      if (parsed.data.city) empUpdate.city = parsed.data.city;
      if (parsed.data.phone) empUpdate.phone = parsed.data.phone;
      const { error: updateUserError } = await supabase.auth.updateUser({ data: { full_name: parsed.data.name } });
      if (updateUserError) return { error: updateUserError.message, success: false };
      const admin = createAdminClient();
      const { error: empError } = await admin.from("employer_profiles").update(empUpdate).eq("employer_id", user.id);
      if (empError) return { error: empError.message, success: false };
    } else {
      const parsed = workerUpdateSchema.safeParse({
        fullName: name,
        city: city ?? undefined,
        bio: bio ?? undefined,
        locationVisible,
      });
      if (!parsed.success) {
        return { error: parsed.error.issues[0]?.message ?? "Data tidak valid", success: false };
      }
      const { error: updateUserError } = await supabase.auth.updateUser({ data: { full_name: parsed.data.fullName } });
      if (updateUserError) return { error: updateUserError.message, success: false };
      await updateWorker(supabase, user.id, parsed.data);
    }

    revalidatePath("/settings");
    return { error: null, success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Terjadi kesalahan. Silakan coba lagi.", success: false };
  }
}

export async function deleteAccount(): Promise<SettingsResult> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Sesi tidak ditemukan", success: false };

    try {
      await deleteWorker(supabase, user.id);
    } catch {
      // profile row may not exist; continue with auth deletion
    }

    const admin = createAdminClient();
    const { error } = await admin.auth.admin.deleteUser(user.id);
    if (error) return { error: error.message, success: false };

    return { error: null, success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Terjadi kesalahan. Silakan coba lagi.", success: false };
  }
}

export async function updatePassword(_prevState: SettingsResult, formData: FormData): Promise<SettingsResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Sesi tidak ditemukan", success: false };

  const current = formData.get("current")?.toString();
  const newPw = formData.get("new")?.toString();
  const confirm = formData.get("confirm")?.toString();

  if (!current || !newPw || !confirm) return { error: "Semua field harus diisi", success: false };
  if (newPw.length < 6) return { error: "Kata sandi baru minimal 6 karakter", success: false };
  if (newPw !== confirm) return { error: "Konfirmasi kata sandi tidak cocok", success: false };

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password: current,
  });
  if (signInError) return { error: "Kata sandi saat ini salah", success: false };

  const { error } = await supabase.auth.updateUser({ password: newPw });
  if (error) return { error: error.message, success: false };

  return { error: null, success: true };
}
