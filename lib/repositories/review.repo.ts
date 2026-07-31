import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

type Client = SupabaseClient<Database>;

type ReviewRow = Database["public"]["Tables"]["reviews"]["Row"];
type EmployerRow = Database["public"]["Tables"]["employer_profiles"]["Row"];
type WorkerRow = Database["public"]["Tables"]["worker_profiles"]["Row"];
type AgreementRow = Database["public"]["Tables"]["agreements"]["Row"];

type AgreementRef = Pick<AgreementRow, "agreement_id" | "job_description">;

export type ReviewWithEmployer = ReviewRow & {
  employer_profiles: EmployerRow | null;
  agreements: AgreementRef | null;
};

export type ReviewWithWorker = ReviewRow & {
  worker_profiles: Pick<WorkerRow, "worker_id" | "full_name"> | null;
  agreements: AgreementRef | null;
};

export type ReviewUpsertInput = {
  agreementId: string;
  employerId: string;
  workerId: string;
  rating: number;
  comment: string | null;
  photoUrls: string[];
};

function from(client: Client) {
  return client.from("reviews");
}

async function attachAgreements(
  client: Client,
  reviews: ReviewRow[],
): Promise<Map<string, AgreementRef>> {
  const agreementIds = [
    ...new Set(reviews.map((r) => r.agreement_id).filter(Boolean)),
  ] as string[];

  if (agreementIds.length === 0) return new Map();

  const { data } = await client
    .from("agreements")
    .select("agreement_id, job_description")
    .in("agreement_id", agreementIds);

  const agreementMap = new Map<string, AgreementRef>();
  for (const a of data ?? []) {
    agreementMap.set(a.agreement_id, a);
  }
  return agreementMap;
}

export async function getReviewByAgreement(
  client: Client,
  agreementId: string,
): Promise<ReviewRow | null> {
  const { data, error } = await from(client)
    .select("*")
    .eq("agreement_id", agreementId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function listReviewsByWorker(
  client: Client,
  workerId: string,
): Promise<ReviewWithEmployer[]> {
  const { data, error } = await from(client)
    .select("*")
    .eq("worker_id", workerId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  const employerIds = [
    ...new Set(data.map((r) => r.employer_id).filter(Boolean)),
  ] as string[];

  let employers: EmployerRow[] = [];
  if (employerIds.length > 0) {
    const { data: emp } = await client
      .from("employer_profiles")
      .select("*")
      .in("employer_id", employerIds);
    employers = emp ?? [];
  }

  const employerMap = new Map(employers.map((e) => [e.employer_id, e]));
  const agreementMap = await attachAgreements(client, data);

  return data.map((review) => ({
    ...review,
    employer_profiles: employerMap.get(review.employer_id) ?? null,
    agreements: agreementMap.get(review.agreement_id) ?? null,
  }));
}

export async function listReviewsByEmployer(
  client: Client,
  employerId: string,
): Promise<ReviewWithWorker[]> {
  const { data, error } = await from(client)
    .select("*")
    .eq("employer_id", employerId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  const workerIds = [
    ...new Set(data.map((r) => r.worker_id).filter(Boolean)),
  ] as string[];

  let workers: Pick<WorkerRow, "worker_id" | "full_name">[] = [];
  if (workerIds.length > 0) {
    const { data: wrk } = await client
      .from("worker_profiles")
      .select("worker_id, full_name")
      .in("worker_id", workerIds);
    workers = wrk ?? [];
  }

  const workerMap = new Map(
    workers.map((w) => [w.worker_id, w] as const),
  );
  const agreementMap = await attachAgreements(client, data);

  return data.map((review) => ({
    ...review,
    worker_profiles: workerMap.get(review.worker_id) ?? null,
    agreements: agreementMap.get(review.agreement_id) ?? null,
  }));
}

export async function upsertReview(client: Client, input: ReviewUpsertInput) {
  const { data, error } = await from(client)
    .upsert(
      {
        agreement_id: input.agreementId,
        employer_id: input.employerId,
        worker_id: input.workerId,
        rating: input.rating,
        comment: input.comment,
        photo_urls: input.photoUrls,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "agreement_id" },
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}
