import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

type Client = SupabaseClient<Database>;

type NegotiationRow = Database["public"]["Tables"]["negotiations"]["Row"];

export interface CreateNegotiationInput {
  agreementId: string;
  actorId: string;
  role: "employer" | "worker";
  price: number;
  reason?: string | null;
}

function from(client: Client) {
  return client.from("negotiations");
}

export async function createNegotiation(client: Client, input: CreateNegotiationInput) {
  const { data, error } = await from(client)
    .insert({
      agreement_id: input.agreementId,
      actor_id: input.actorId,
      role: input.role,
      price: input.price,
      reason: input.reason ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function listNegotiationsByAgreement(
  client: Client,
  agreementId: string,
): Promise<NegotiationRow[]> {
  const { data, error } = await from(client)
    .select("*")
    .eq("agreement_id", agreementId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
}

export async function getLatestNegotiation(
  client: Client,
  agreementId: string,
): Promise<NegotiationRow | null> {
  const { data, error } = await from(client)
    .select("*")
    .eq("agreement_id", agreementId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function listLatestNegotiationsByAgreementIds(
  client: Client,
  agreementIds: string[],
): Promise<Record<string, NegotiationRow>> {
  if (agreementIds.length === 0) return {};

  const { data, error } = await from(client)
    .select("*")
    .in("agreement_id", agreementIds)
    .order("created_at", { ascending: false });

  if (error) throw error;

  const latestByAgreement: Record<string, NegotiationRow> = {};
  for (const row of data) {
    if (!latestByAgreement[row.agreement_id]) {
      latestByAgreement[row.agreement_id] = row;
    }
  }
  return latestByAgreement;
}

export type NegotiationRowType = NegotiationRow;
