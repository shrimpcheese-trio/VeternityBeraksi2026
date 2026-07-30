import type { SupabaseClient } from "@supabase/supabase-js";
import type { WorkerInput, WorkerUpdate } from "@/lib/validators/worker";
import type { Database } from "@/types/supabase";

type Client = SupabaseClient<Database>;

function from(client: Client) {
  return client.from("worker_profiles");
}

export async function createWorker(client: Client, input: WorkerInput) {
  const { data, error } = await from(client)
    .insert({
      worker_id: input.workerId,
      full_name: input.fullName,
      city: input.city,
      job_category: input.jobCategory,
      years_experience: input.yearsExperience,
      ...(input.bio !== undefined && { bio: input.bio }),
      ...(input.locationVisible !== undefined && { location_visible: input.locationVisible }),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getWorkerById(client: Client, workerId: string) {
  const { data, error } = await from(client)
    .select("*")
    .eq("worker_id", workerId)
    .single();

  if (error) return null;
  return data;
}

export async function updateWorker(client: Client, workerId: string, input: WorkerUpdate) {
  const { data, error } = await from(client)
    .update({
      ...(input.fullName !== undefined && { full_name: input.fullName }),
      ...(input.city !== undefined && { city: input.city }),
      ...(input.jobCategory !== undefined && { job_category: input.jobCategory }),
      ...(input.yearsExperience !== undefined && { years_experience: input.yearsExperience }),
      ...(input.bio !== undefined && { bio: input.bio }),
      ...(input.locationVisible !== undefined && { location_visible: input.locationVisible }),
    })
    .eq("worker_id", workerId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteWorker(client: Client, workerId: string) {
  const { error } = await from(client)
    .delete()
    .eq("worker_id", workerId);

  if (error) throw error;
}

export async function listWorkers(client: Client, filters?: Partial<WorkerInput>) {
  let query = from(client).select("*");

  if (filters?.city) query = query.eq("city", filters.city);
  if (filters?.jobCategory) query = query.eq("job_category", filters.jobCategory);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}
