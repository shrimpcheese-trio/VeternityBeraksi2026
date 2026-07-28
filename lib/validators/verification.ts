import { z } from "zod";

export const verificationInputSchema = z.object({
  workerId: z.string().uuid(),
  verifierName: z.string().min(2),
  verifierRole: z.string().min(2),
  statement: z.string().optional().nullable(),
  rating: z.coerce.number().min(0).max(10).optional().nullable(),
});

export const verificationUpdateSchema = verificationInputSchema.partial().omit({ workerId: true });

export type VerificationInput = z.infer<typeof verificationInputSchema>;
export type VerificationUpdate = z.infer<typeof verificationUpdateSchema>;
