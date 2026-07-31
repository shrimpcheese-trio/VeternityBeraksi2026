import { z } from "zod";

export const negotiationInputSchema = z.object({
  price: z.coerce.number().int("Harga harus berupa angka bulat").positive("Harga harus lebih dari 0"),
  reason: z.string().trim().max(500, "Alasan maksimal 500 karakter").optional().nullable(),
});

export type NegotiationInput = z.infer<typeof negotiationInputSchema>;
