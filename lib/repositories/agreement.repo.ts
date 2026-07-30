import type { SupabaseClient } from "@supabase/supabase-js";
import type { AgreementInput, AgreementUpdate } from "@/lib/validators/agreement";
import type { Database } from "@/types/supabase";

type Client = SupabaseClient<Database>;

type AgreementRow = Database["public"]["Tables"]["agreements"]["Row"];
type EmployerRow = Database["public"]["Tables"]["employer_profiles"]["Row"];
type WorkerRow = Database["public"]["Tables"]["worker_profiles"]["Row"];

export type AgreementWithProfiles = AgreementRow & {
  employer_profiles: EmployerRow | null;
  worker_profiles: WorkerRow | null;
};

export type AgreementWithEmployer = AgreementWithProfiles;

function from(client: Client) {
  return client.from("agreements");
}

function attachProfiles<T extends AgreementRow>(
  agreements: T[],
  employers: EmployerRow[],
  workers: WorkerRow[],
): AgreementWithProfiles[] {
  const employerMap = new Map(employers.map((e) => [e.employer_id, e]));
  const workerMap = new Map(workers.map((w) => [w.worker_id, w]));
  return agreements.map((a) => ({
    ...a,
    employer_profiles: a.employer_id ? employerMap.get(a.employer_id) ?? null : null,
    worker_profiles: a.worker_id ? workerMap.get(a.worker_id) ?? null : null,
  }));
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

export async function getAgreementById(client: Client, agreementId: string): Promise<AgreementWithProfiles | null> {
  const { data, error } = await from(client)
    .select("*")
    .eq("agreement_id", agreementId)
    .single();

  if (error) return null;

  let employer: EmployerRow | null = null;
  if (data.employer_id) {
    const { data: emp } = await client
      .from("employer_profiles")
      .select("*")
      .eq("employer_id", data.employer_id)
      .single();
    employer = emp;
  }

  let worker: WorkerRow | null = null;
  if (data.worker_id) {
    const { data: wrk } = await client
      .from("worker_profiles")
      .select("*")
      .eq("worker_id", data.worker_id)
      .single();
    worker = wrk;
  }

  return { ...data, employer_profiles: employer, worker_profiles: worker };
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

export async function listAgreements(client: Client, filters?: { workerId?: string; employerId?: string; status?: string }) {
  let query = from(client).select("*").order("created_at", { ascending: false });

  if (filters?.workerId) query = query.eq("worker_id", filters.workerId);
  if (filters?.employerId) query = query.eq("employer_id", filters.employerId);
  if (filters?.status) query = query.eq("status", filters.status);

  const { data, error } = await query;
  if (error) throw error;

  const employerIds = [...new Set(data.map((a) => a.employer_id).filter(Boolean))] as string[];
  const workerIds = [...new Set(data.map((a) => a.worker_id).filter(Boolean))] as string[];

  let employers: EmployerRow[] = [];
  if (employerIds.length > 0) {
    const { data: emp } = await client
      .from("employer_profiles")
      .select("*")
      .in("employer_id", employerIds);
    employers = emp ?? [];
  }

  let workers: WorkerRow[] = [];
  if (workerIds.length > 0) {
    const { data: wrk } = await client
      .from("worker_profiles")
      .select("*")
      .in("worker_id", workerIds);
    workers = wrk ?? [];
  }

  return attachProfiles(data, employers, workers);
}
