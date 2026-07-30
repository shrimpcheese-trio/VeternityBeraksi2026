import { z } from "zod";

export const proofOfWorkInputSchema = z.object({
  workerId: z.string().uuid(),
  jobType: z.string().min(3),
  jobValue: z.coerce.number().positive().optional().nullable(),
  photoBeforeUrl: z.string().url().optional().nullable(),
  photoAfterUrl: z.string().url().optional().nullable(),
  locationLat: z.coerce.number().min(-90).max(90).optional().nullable(),
  locationLng: z.coerce.number().min(-180).max(180).optional().nullable(),
  customerConfirmed: z.boolean().default(false),
  verified: z.boolean().default(false),
  jobDate: z.string(),
});

export const proofOfWorkUpdateSchema = proofOfWorkInputSchema.partial().omit({ workerId: true });

export type ProofOfWorkInput = z.infer<typeof proofOfWorkInputSchema>;
export type ProofOfWorkUpdate = z.infer<typeof proofOfWorkUpdateSchema>;
