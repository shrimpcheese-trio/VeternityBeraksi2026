import type { SupabaseClient } from "@supabase/supabase-js";
import type { VerificationInput, VerificationUpdate } from "@/lib/validators/verification";
import type { Database } from "@/types/supabase";

type Client = SupabaseClient<Database>;

function from(client: Client) {
  return client.from("community_verifications");
}

export async function createVerification(client: Client, input: VerificationInput) {
  const { data, error } = await from(client)
    .insert({
      worker_id: input.workerId,
      verifier_name: input.verifierName,
      verifier_role: input.verifierRole,
      statement: input.statement ?? null,
      rating: input.rating ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getVerificationById(client: Client, verificationId: string) {
  const { data, error } = await from(client)
    .select("*")
    .eq("verification_id", verificationId)
    .single();

  if (error) return null;
  return data;
}

export async function updateVerification(client: Client, verificationId: string, input: VerificationUpdate) {
  const { data, error } = await from(client)
    .update({
      ...(input.verifierName !== undefined && { verifier_name: input.verifierName }),
      ...(input.verifierRole !== undefined && { verifier_role: input.verifierRole }),
      ...(input.statement !== undefined && { statement: input.statement }),
      ...(input.rating !== undefined && { rating: input.rating }),
    })
    .eq("verification_id", verificationId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteVerification(client: Client, verificationId: string) {
  const { error } = await from(client)
    .delete()
    .eq("verification_id", verificationId);

  if (error) throw error;
}

export async function listVerifications(client: Client, filters?: Partial<VerificationInput>) {
  let query = from(client).select("*");

  if (filters?.workerId) query = query.eq("worker_id", filters.workerId);
  if (filters?.verifierRole) query = query.eq("verifier_role", filters.verifierRole);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}
