"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { workerUpdateSchema } from "@/lib/validators/worker";
import { updateWorker, deleteWorker } from "@/lib/repositories/worker.repo";
import { revalidatePath } from "next/cache";

export async function updateWorkerProfile(workerId: string, formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.user_metadata?.role !== "admin") {
      return { error: "Unauthorized", code: "UNAUTHORIZED" };
    }

    const raw = {
      fullName: formData.get("fullName"),
      city: formData.get("city"),
      jobCategory: formData.get("jobCategory"),
      yearsExperience: formData.get("yearsExperience"),
      bio: formData.get("bio"),
      locationVisible: formData.get("locationVisible") === "true",
    };

    const parsed = workerUpdateSchema.safeParse(raw);
    if (!parsed.success) {
      return {
        error: parsed.error.issues[0]?.message ?? "Data tidak valid",
        code: "VALIDATION_ERROR",
      };
    }

    const admin = createAdminClient();
    await updateWorker(admin, workerId, parsed.data);
    revalidatePath(`/workers/${workerId}`);
    revalidatePath("/workers");

    return { ok: true };
  } catch (error) {
    console.error(error);
    return { error: "Terjadi kesalahan. Silakan coba lagi.", code: "INTERNAL_ERROR" };
  }
}

export async function deleteWorkerProfile(workerId: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.user_metadata?.role !== "admin") {
      return { error: "Unauthorized", code: "UNAUTHORIZED" };
    }

    const admin = createAdminClient();
    await deleteWorker(admin, workerId);

    try {
      await admin.auth.admin.deleteUser(workerId);
    } catch {
    }

    revalidatePath("/workers");

    return { ok: true };
  } catch (error) {
    console.error(error);
    return { error: "Terjadi kesalahan. Silakan coba lagi.", code: "INTERNAL_ERROR" };
  }
}
