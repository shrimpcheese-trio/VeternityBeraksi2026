"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  signUpEmailSchema,
  signInEmailSchema,
  profileSetupSchema,
} from "@/lib/schemas/auth";
import { redirect } from "next/navigation";
import type { AuthState } from "@/types/auth";

export async function signUpWithEmail(
  prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = signUpEmailSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Data tidak valid";
    return { error: firstError, success: false };
  }

  const { fullName, email, password, role } = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, role },
    },
  });

  if (error) {
    return { error: error.message, success: false };
  }

  const { data: { user } } = await supabase.auth.getUser();

  if (user?.identities?.length === 0) {
    return { error: "Email ini sudah terdaftar", success: false };
  }

  const emailConfirmed = user?.email_confirmed_at || user?.confirmed_at;

  redirect(emailConfirmed ? "/profile/setup" : "/auth/confirm?email=" + encodeURIComponent(email));
}

export async function signInWithEmail(
  prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = signInEmailSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Data tidak valid";
    return { error: firstError, success: false };
  }

  const { email, password } = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message, success: false };
  }

  const { data: { user } } = await supabase.auth.getUser();
  const role = user?.user_metadata?.role;

  if (role === "worker") return redirect("/worker/dashboard");
  if (role === "employer") return redirect("/employer/dashboard");
  if (role === "admin") return redirect("/admin/dashboard");
  return redirect("/profile/setup");
}

export async function signInWithGoogle(): Promise<never> {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect(data.url);
}

export async function sendPasswordResetEmail(
  prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = formData.get("email")?.toString();
  if (!email) return { error: "Email tidak valid", success: false };

  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/auth/update-password`,
  });

  if (error) return { error: error.message, success: false };

  return { error: null, success: true };
}

export async function completeProfileSetup(
  prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
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

  const { fullName, city, jobCategory, yearsExperience, role } = parsed.data;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sesi tidak ditemukan", success: false };
  }

  await supabase.auth.updateUser({
    data: { full_name: fullName, role },
  });

  if (role === "worker") {
    const admin = createAdminClient();
    const { error } = await admin.from("worker_profiles").insert({
      worker_id: user.id,
      full_name: fullName,
      city,
      job_category: jobCategory,
      years_experience: yearsExperience,
    });

    if (error) return { error: error.message, success: false };
  }

  if (role === "worker") redirect("/worker/dashboard");
  if (role === "employer") redirect("/employer/dashboard");
  return { error: null, success: true };
}

export async function signOut(): Promise<never> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
