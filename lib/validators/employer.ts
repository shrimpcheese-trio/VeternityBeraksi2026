import { z } from "zod";

export const employerInputSchema = z.object({
  employerId: z.string().uuid(),
  companyName: z.string().min(2),
  city: z.string().min(3),
  phone: z.string().optional().nullable(),
});

export const employerUpdateSchema = employerInputSchema.partial().omit({ employerId: true });

export type EmployerInput = z.infer<typeof employerInputSchema>;
export type EmployerUpdate = z.infer<typeof employerUpdateSchema>;
