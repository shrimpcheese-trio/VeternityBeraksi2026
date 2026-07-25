"use server";

import { createClient } from "@/lib/supabase/server";
import {
  signUpEmailSchema,
  signUpPhoneSchema,
  signInEmailSchema,
  signInPhoneSchema,
  otpSchema,
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

export async function signUpWithPhone(
  prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = signUpPhoneSchema.safeParse({
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
    password: formData.get("password"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Data tidak valid";
    return { error: firstError, success: false };
  }

  const { fullName, phone, password, role } = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    phone,
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
    return { error: "Nomor ini sudah terdaftar", success: false };
  }

  return { error: null, success: true, otpSent: true };
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

export async function signInWithPhone(
  prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = signInPhoneSchema.safeParse({
    phone: formData.get("phone"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Data tidak valid";
    return { error: firstError, success: false };
  }

  const { phone, password } = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    phone,
    password,
  });

  if (error) {
    return { error: error.message, success: false };
  }

  const { data: { user } } = await supabase.auth.getUser();
  const role = user?.user_metadata?.role;

  if (role === "worker") redirect("/worker/dashboard");
  else if (role === "employer") redirect("/employer/dashboard");
  else if (role === "admin") redirect("/admin/dashboard");
  else redirect("/profile/setup");
}

export async function sendOtp(
  prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const phone = formData.get("phone")?.toString();
  if (!phone || phone.length < 10) {
    return { error: "Nomor telepon tidak valid", success: false };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithOtp({
    phone,
  });

  if (error) {
    return { error: error.message, success: false };
  }

  return { error: null, success: true, otpSent: true };
}

export async function verifyOtp(
  prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = otpSchema.safeParse({
    phone: formData.get("phone"),
    token: formData.get("token"),
  });

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Kode tidak valid";
    return { error: firstError, success: false };
  }

  const { phone, token } = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: "sms",
  });

  if (error) {
    return { error: error.message, success: false };
  }

  const { data: { user } } = await supabase.auth.getUser();
  const role = user?.user_metadata?.role;

  if (role === "worker") redirect("/worker/dashboard");
  else if (role === "employer") redirect("/employer/dashboard");
  else if (role === "admin") redirect("/admin/dashboard");
  else redirect("/profile/setup");
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

export async function signOut(): Promise<never> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
