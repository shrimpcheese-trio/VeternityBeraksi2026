import { z } from "zod";

export const signUpEmailSchema = z.object({
  fullName: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
  role: z.enum(["worker", "employer"]),
});

export const signInEmailSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(1, "Password harus diisi"),
});

export const profileSetupSchema = z.object({
  fullName: z.string().min(2, "Nama minimal 2 karakter"),
  city: z.string().min(3, "Kota harus diisi"),
  jobCategory: z.string().min(3, "Kategori pekerjaan harus diisi"),
  yearsExperience: z.coerce.number().min(0, "Tahun pengalaman tidak valid"),
  role: z.enum(["worker", "employer"]),
});
