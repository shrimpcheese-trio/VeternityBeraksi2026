import { z } from "zod";

// Enforces "HH:MM - HH:MM" in 24-hour format with the end time after the start time.
const workHoursPattern = /^([01]\d|2[0-3]):[0-5]\d\s*-\s*([01]\d|2[0-3]):[0-5]\d$/;
export const workHoursSchema = z
  .string()
  .regex(workHoursPattern, "Format jam kerja harus HH:MM - HH:MM, contoh: 08:00 - 17:00")
  .refine((value) => {
    if (!workHoursPattern.test(value)) return true;
    const [start, end] = value.split("-").map((part) => part.trim());
    const toMinutes = (time: string) => {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    };
    return toMinutes(end) > toMinutes(start);
  }, "Jam selesai harus setelah jam mulai")
  .nullable()
  .optional();

export const agreementInputSchema = z.object({
  workerId: z.string().uuid(),
  employerId: z.string().uuid().optional().nullable(),
  price: z.coerce.number().int("Harga harus berupa angka bulat").positive("Harga harus lebih dari 0"),
  location: z.string().optional().nullable(),
  workHours: workHoursSchema,
  jobDescription: z.string().optional().nullable(),
  status: z.enum(["draft", "active", "completed", "disputed"]).default("draft"),
});

export const agreementUpdateSchema = agreementInputSchema.partial().omit({ workerId: true });

export const agreementPatchSchema = z.object({
  employerId: z.string().uuid().optional().nullable(),
  price: z.coerce.number().int("Harga harus berupa angka bulat").positive("Harga harus lebih dari 0").optional(),
  location: z.string().optional().nullable(),
  workHours: workHoursSchema,
  jobDescription: z.string().optional().nullable(),
}).strict();

export type AgreementInput = z.infer<typeof agreementInputSchema>;
export type AgreementUpdate = z.infer<typeof agreementUpdateSchema>;
export type AgreementPatch = z.infer<typeof agreementPatchSchema>;
