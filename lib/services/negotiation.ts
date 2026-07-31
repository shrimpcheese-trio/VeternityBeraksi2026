import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createAgreement, getAgreementById, updateAgreement } from "@/lib/repositories/agreement.repo";
import { createNegotiation, getLatestNegotiation } from "@/lib/repositories/negotiation.repo";
import type { AgreementInput } from "@/lib/validators/agreement";
import type { NegotiationInput } from "@/lib/validators/negotiation";
import type { Database } from "@/types/supabase";

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export class ForbiddenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ForbiddenError";
  }
}

export class NotNegotiableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotNegotiableError";
  }
}

export class ReasonRequiredError extends Error {
  constructor() {
    super("Alasan wajib diisi");
    this.name = "ReasonRequiredError";
  }
}

export async function createAgreementOffer(
  client: SupabaseClient<Database>,
  input: AgreementInput,
  actorUserId: string,
) {
  const agreement = await createAgreement(client, input);
  if (input.employerId === actorUserId) {
    await createNegotiation(client, {
      agreementId: agreement.agreement_id,
      actorId: actorUserId,
      role: "employer",
      price: input.price,
    });
  }
  return agreement;
}

export async function submitCounter(
  agreementId: string,
  actorUserId: string,
  input: NegotiationInput,
) {
  const supabase = await createClient();
  const agreement = await getAgreementById(supabase, agreementId);
  if (!agreement) {
    throw new NotFoundError("Agreement not found");
  }

  if (
    actorUserId !== agreement.worker_id &&
    actorUserId !== agreement.employer_id
  ) {
    throw new ForbiddenError("Actor is not a party to this agreement");
  }

  if (agreement.status !== "draft") {
    throw new NotNegotiableError("Perjanjian ini tidak terbuka untuk negosiasi");
  }

  const latest = await getLatestNegotiation(supabase, agreementId);
  const admin = createAdminClient();

  if (actorUserId === agreement.worker_id) {
    if (!input.reason?.trim()) {
      throw new ReasonRequiredError();
    }
    await createNegotiation(admin, {
      agreementId,
      actorId: actorUserId,
      role: "worker",
      price: input.price,
      reason: input.reason.trim(),
    });
  } else {
    if (latest?.role !== "worker") {
      throw new NotNegotiableError("Tidak ada tawaran pekerja untuk ditanggapi");
    }
    await updateAgreement(admin, agreementId, { price: input.price });
    await createNegotiation(admin, {
      agreementId,
      actorId: actorUserId,
      role: "employer",
      price: input.price,
    });
  }

  return getAgreementById(supabase, agreementId);
}
