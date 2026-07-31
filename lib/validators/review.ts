import { z } from "zod";

export const reviewInputSchema = z.object({
  agreementId: z.string().uuid(),
  rating: z.coerce
    .number()
    .int("Rating harus berupa angka bulat")
    .min(0, "Rating minimal 0")
    .max(5, "Rating maksimal 5"),
  comment: z.string().max(1000, "Ulasan maksimal 1000 karakter").optional().nullable(),
  photoUrls: z.array(z.string().url("URL foto tidak valid")).max(3, "Maksimal 3 foto").default([]),
});

export const reviewPatchSchema = z.object({
  rating: z.coerce.number().int().min(0).max(5),
  comment: z.string().max(1000).optional().nullable(),
  photoUrls: z.array(z.string().url()).max(3).default([]),
}).strict();

export type ReviewInput = z.infer<typeof reviewInputSchema>;
export type ReviewPatch = z.infer<typeof reviewPatchSchema>;
