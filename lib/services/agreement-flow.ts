import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAgreementById, updateAgreement } from "@/lib/repositories/agreement.repo";
import { getProofOfWorkByAgreement } from "@/lib/repositories/proof-of-work.repo";
import { computeTrustScore } from "@/lib/services/trust-engine";

export const VALID_TRANSITIONS: Record<string, string[]> = {
  draft: ["active"],
  active: ["completed", "disputed"],
  disputed: ["completed"],
  completed: [],
};

export async function transitionAgreement(
  agreementId: string,
  newStatus: string,
  actorUserId: string,
) {
  const supabase = await createClient();
  const agreement = await getAgreementById(supabase, agreementId);
  if (!agreement) {
    throw new NotFoundError("Agreement not found");
  }

  const allowed = VALID_TRANSITIONS[agreement.status];
  if (!allowed || !allowed.includes(newStatus)) {
    throw new Error(
      `Invalid transition from ${agreement.status} to ${newStatus}`,
    );
  }

  if (
    actorUserId !== agreement.worker_id &&
    actorUserId !== agreement.employer_id
  ) {
    throw new ForbiddenError("Actor is not a party to this agreement");
  }

  const admin = createAdminClient();

  if (newStatus === "completed") {
    const proof = await getProofOfWorkByAgreement(admin, agreementId);
    if (!proof || !proof.photo_before_url || !proof.photo_after_url) {
      throw new ProofOfWorkRequiredError();
    }
  }

  await updateAgreement(admin, agreementId, { status: newStatus as "draft" | "active" | "completed" | "disputed" });

  if (newStatus === "completed" || newStatus === "disputed") {
    await computeTrustScore(agreement.worker_id);
  }

  return { ...agreement, status: newStatus };
}

export class ProofOfWorkRequiredError extends Error {
  constructor() {
    super("Proof of work with before and after photos is required to complete this agreement");
    this.name = "ProofOfWorkRequiredError";
  }
}

class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

class ForbiddenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ForbiddenError";
  }
}
