import { createAdminClient } from "@/lib/supabase/admin";

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Recomputes a worker's trust score from server-side data.
 *
 * Reads and writes both use the service-role client so the result is identical
 * no matter which user triggered the recomputation (worker, employer, or admin).
 * The score is stored in the trust_score table and mirrored onto
 * worker_profiles.trust_score so listing and profile reads stay in sync.
 *
 * @param workerId - the worker whose score should be recomputed
 * @returns nothing, but may fail silently if the underlying data cannot be read
 */
export async function computeTrustScore(workerId: string): Promise<void> {
  const admin = createAdminClient();

  const [verificationsResult, reviewsResult, proofsResult, workerResult, agreementsResult] =
    await Promise.all([
      admin
        .from("community_verifications")
        .select("rating")
        .eq("worker_id", workerId)
        .not("rating", "is", null),
      admin
        .from("reviews")
        .select("rating")
        .eq("worker_id", workerId),
      admin
        .from("proof_of_work")
        .select("proof_id", { count: "exact", head: true })
        .eq("worker_id", workerId)
        .eq("verified", true),
      admin
        .from("worker_profiles")
        .select("created_at")
        .eq("worker_id", workerId)
        .single(),
      admin
        .from("agreements")
        .select("status")
        .eq("worker_id", workerId),
    ]);

  const readError = [
    verificationsResult.error,
    reviewsResult.error,
    proofsResult.error,
    workerResult.error,
    agreementsResult.error,
  ].find(Boolean);

  // A failed read must not silently zero-out a previously computed score.
  if (readError) {
    console.error(`computeTrustScore read failed for worker ${workerId}:`, readError);
    return;
  }

  const verifiedProofCount = proofsResult.count ?? 0;

  const completedAgreements =
    agreementsResult.data?.filter((a) => a.status === "completed").length ?? 0;
  const disputedAgreements =
    agreementsResult.data?.filter((a) => a.status === "disputed").length ?? 0;
  const activeAgreements =
    agreementsResult.data?.filter((a) => a.status === "active").length ?? 0;
  const completionDenominator = completedAgreements + disputedAgreements + activeAgreements;
  const completionRate = completionDenominator > 0 ? completedAgreements / completionDenominator : 0;

  const ratings = verificationsResult.data?.map((v) => v.rating as number) ?? [];
  const avgRating =
    ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
      : 0;

  const reviewRatings = reviewsResult.data?.map((r) => r.rating as number) ?? [];
  const avgReviewRating =
    reviewRatings.length > 0
      ? reviewRatings.reduce((sum, r) => sum + r, 0) / reviewRatings.length
      : 0;

  const createdAt = workerResult.data?.created_at;
  const monthsSinceJoin = createdAt
    ? (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24 * 30.44)
    : 0;

  // Weights total 100 and no single input can dominate: reviews, proofs, and
  // completion each cap at 25, verifications at 20, tenure at 5. A fake
  // verifier, review ring, or bad-faith confirmation cannot tilt the score.
  const verificationScore = clamp(avgRating * 4, 0, 20);
  const reviewScore = clamp(avgReviewRating * 5, 0, 25);
  const proofScore = clamp(verifiedProofCount * 5, 0, 25);
  const completionScore = clamp(completionRate * 25, 0, 25);
  const tenureScore = clamp(monthsSinceJoin * 0.5, 0, 5);
  const score = Math.round((verificationScore + proofScore + completionScore + reviewScore + tenureScore) * 100) / 100;

  const { error: upsertError } = await admin.from("trust_score").upsert({
    worker_id: workerId,
    score,
    breakdown: {
      verificationScore,
      reviewScore,
      proofScore,
      completionScore,
      tenureScore,
    },
  });
  if (upsertError) {
    console.error(`computeTrustScore upsert failed for worker ${workerId}:`, upsertError);
    return;
  }

  // Mirror onto the profile so the many consumers that read
  // worker_profiles.trust_score (listings, profiles, admin pages) stay in sync.
  const { error: profileError } = await admin
    .from("worker_profiles")
    .update({ trust_score: score })
    .eq("worker_id", workerId);
  if (profileError) {
    console.error(`computeTrustScore profile mirror failed for worker ${workerId}:`, profileError);
  }
}
