import { z } from "zod";

export const workerServiceInputSchema = z.object({
  name: z.string().min(1, "Nama layanan wajib diisi").max(200),
  description: z.string().optional().nullable(),
  price: z.coerce.number().positive("Harga harus lebih dari 0"),
  priceUnit: z.enum(["fixed", "hourly", "daily"]).default("fixed"),
  category: z.string().optional().nullable(),
  thumbnailUrl: z.string().optional().nullable(),
  imageUrls: z.array(z.string()).optional().default([]),
});

export const workerServiceUpdateSchema = workerServiceInputSchema.partial().extend({
  isActive: z.boolean().optional(),
});

export type WorkerServiceInput = z.infer<typeof workerServiceInputSchema>;
export type WorkerServiceUpdate = z.infer<typeof workerServiceUpdateSchema>;
