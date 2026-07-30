import { z } from "zod";

export const workerInputSchema = z.object({
  workerId: z.string().uuid(),
  fullName: z.string().min(2),
  city: z.string().min(3),
  jobCategory: z.string().min(3),
  yearsExperience: z.coerce.number().int().min(0).default(0),
  bio: z.string().optional(),
  locationVisible: z.boolean().optional(),
});

export const workerUpdateSchema = workerInputSchema.partial().omit({ workerId: true });

export type WorkerInput = z.infer<typeof workerInputSchema>;
export type WorkerUpdate = z.infer<typeof workerUpdateSchema>;
