import { z } from "zod";

export const signUpEmailSchema = z.object({
  fullName: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

export const signInEmailSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(1, "Password harus diisi"),
});

export const profileSetupSchema = z.discriminatedUnion("role", [
  z.object({
    role: z.literal("worker"),
    fullName: z.string().min(2, "Nama minimal 2 karakter"),
    city: z.string().min(3, "Kota harus diisi"),
    jobCategory: z.string().min(3, "Kategori pekerjaan harus diisi"),
    yearsExperience: z.coerce.number().min(0, "Tahun pengalaman tidak valid"),
  }),
  z.object({
    role: z.literal("employer"),
    fullName: z.string().min(2, "Nama minimal 2 karakter"),
    city: z.string().min(3, "Kota harus diisi"),
    companyName: z
      .string()
      .min(2, "Nama perusahaan minimal 2 karakter")
      .or(z.literal(""))
      .optional(),
    phone: z.string().optional(),
  }),
]);
