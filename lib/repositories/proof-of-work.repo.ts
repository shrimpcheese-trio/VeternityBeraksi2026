import type { SupabaseClient } from "@supabase/supabase-js";
import type { ProofOfWorkInput, ProofOfWorkUpdate } from "@/lib/validators/proof-of-work";
import type { Database } from "@/types/supabase";

type Client = SupabaseClient<Database>;

function from(client: Client) {
  return client.from("proof_of_work");
}

export async function createProofOfWork(client: Client, input: ProofOfWorkInput) {
  const { data, error } = await from(client)
    .insert({
      worker_id: input.workerId,
      agreement_id: input.agreementId ?? null,
      job_type: input.jobType,
      job_value: input.jobValue ?? null,
      photo_before_url: input.photoBeforeUrl ?? null,
      photo_after_url: input.photoAfterUrl ?? null,
      location_lat: input.locationLat ?? null,
      location_lng: input.locationLng ?? null,
      customer_confirmed: input.customerConfirmed,
      verified: input.verified,
      job_date: input.jobDate,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getProofOfWorkById(client: Client, proofId: string) {
  const { data, error } = await from(client)
    .select("*")
    .eq("proof_id", proofId)
    .single();

  if (error) return null;
  return data;
}

export async function getProofOfWorkByAgreement(client: Client, agreementId: string) {
  const { data, error } = await from(client)
    .select("*")
    .eq("agreement_id", agreementId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function updateProofOfWork(client: Client, proofId: string, input: ProofOfWorkUpdate) {
  const { data, error } = await from(client)
    .update({
      ...(input.jobType !== undefined && { job_type: input.jobType }),
      ...(input.jobValue !== undefined && { job_value: input.jobValue }),
      ...(input.photoBeforeUrl !== undefined && { photo_before_url: input.photoBeforeUrl }),
      ...(input.photoAfterUrl !== undefined && { photo_after_url: input.photoAfterUrl }),
      ...(input.locationLat !== undefined && { location_lat: input.locationLat }),
      ...(input.locationLng !== undefined && { location_lng: input.locationLng }),
      ...(input.customerConfirmed !== undefined && { customer_confirmed: input.customerConfirmed }),
      ...(input.verified !== undefined && { verified: input.verified }),
      ...(input.jobDate !== undefined && { job_date: input.jobDate }),
    })
    .eq("proof_id", proofId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProofOfWork(client: Client, proofId: string) {
  const { error } = await from(client)
    .delete()
    .eq("proof_id", proofId);

  if (error) throw error;
}

export async function listProofsOfWork(client: Client, filters?: Partial<ProofOfWorkInput>) {
  let query = from(client).select("*");

  if (filters?.workerId) query = query.eq("worker_id", filters.workerId);
  if (filters?.jobType) query = query.eq("job_type", filters.jobType);
  if (filters?.verified !== undefined) query = query.eq("verified", filters.verified);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function listProofsByDateRange(
  client: Client,
  workerId: string,
  fromDate: string,
  toDate: string,
) {
  const { data, error } = await from(client)
    .select("*")
    .eq("worker_id", workerId)
    .gte("job_date", fromDate)
    .lte("job_date", toDate)
    .order("job_date", { ascending: true });

  if (error) throw error;
  return data;
}
