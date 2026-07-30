import { z } from "zod";

export const agreementInputSchema = z.object({
  workerId: z.string().uuid(),
  employerId: z.string().uuid().optional().nullable(),
  price: z.coerce.number().positive(),
  location: z.string().optional().nullable(),
  workHours: z.string().optional().nullable(),
  jobDescription: z.string().optional().nullable(),
  status: z.enum(["draft", "active", "completed", "disputed"]).default("draft"),
});

export const agreementUpdateSchema = agreementInputSchema.partial().omit({ workerId: true });

export const agreementPatchSchema = z.object({
  employerId: z.string().uuid().optional().nullable(),
  price: z.coerce.number().positive().optional(),
  location: z.string().optional().nullable(),
  workHours: z.string().optional().nullable(),
  jobDescription: z.string().optional().nullable(),
}).strict();

export type AgreementInput = z.infer<typeof agreementInputSchema>;
export type AgreementUpdate = z.infer<typeof agreementUpdateSchema>;
export type AgreementPatch = z.infer<typeof agreementPatchSchema>;
