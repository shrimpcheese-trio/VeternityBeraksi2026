import type { SupabaseClient } from "@supabase/supabase-js";
import type { AgreementInput, AgreementUpdate } from "@/lib/validators/agreement";
import type { Database } from "@/types/supabase";

type Client = SupabaseClient<Database>;

function from(client: Client) {
  return client.from("agreements");
}

export async function createAgreement(client: Client, input: AgreementInput) {
  const { data, error } = await from(client)
    .insert({
      worker_id: input.workerId,
      employer_id: input.employerId ?? null,
      price: input.price,
      location: input.location ?? null,
      work_hours: input.workHours ?? null,
      job_description: input.jobDescription ?? null,
      status: input.status,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getAgreementById(client: Client, agreementId: string) {
  const { data, error } = await from(client)
    .select("*")
    .eq("agreement_id", agreementId)
    .single();

  if (error) return null;
  return data;
}

export async function updateAgreement(client: Client, agreementId: string, input: AgreementUpdate) {
  const { data, error } = await from(client)
    .update({
      ...(input.employerId !== undefined && { employer_id: input.employerId }),
      ...(input.price !== undefined && { price: input.price }),
      ...(input.location !== undefined && { location: input.location }),
      ...(input.workHours !== undefined && { work_hours: input.workHours }),
      ...(input.jobDescription !== undefined && { job_description: input.jobDescription }),
      ...(input.status !== undefined && { status: input.status }),
    })
    .eq("agreement_id", agreementId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteAgreement(client: Client, agreementId: string) {
  const { error } = await from(client)
    .delete()
    .eq("agreement_id", agreementId);

  if (error) throw error;
}

export async function listAgreements(client: Client, filters?: Partial<AgreementInput>) {
  let query = from(client).select("*");

  if (filters?.workerId) query = query.eq("worker_id", filters.workerId);
  if (filters?.employerId) query = query.eq("employer_id", filters.employerId);
  if (filters?.status) query = query.eq("status", filters.status);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}
