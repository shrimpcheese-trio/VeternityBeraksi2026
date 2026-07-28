import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export async function computeTrustScore(workerId: string): Promise<void> {
  const supabase = await createClient();

  const [verificationsResult, proofsResult, workerResult] = await Promise.all([
    supabase
      .from("community_verifications")
      .select("rating")
      .eq("worker_id", workerId)
      .not("rating", "is", null),
    supabase
      .from("proof_of_work")
      .select("proof_id", { count: "exact", head: true })
      .eq("worker_id", workerId)
      .eq("verified", true),
    supabase
      .from("worker_profiles")
      .select("created_at")
      .eq("worker_id", workerId)
      .single(),
  ]);

  const agreementsResult = await supabase
    .from("agreements")
    .select("status")
    .eq("worker_id", workerId);

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

  const createdAt = workerResult.data?.created_at;
  const monthsSinceJoin = createdAt
    ? (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24 * 30.44)
    : 0;

  const verificationScore = clamp(avgRating * 8, 0, 40);
  const proofScore = clamp(verifiedProofCount * 5, 0, 25);
  const completionScore = clamp(completionRate * 25, 0, 25);
  const tenureScore = clamp(monthsSinceJoin * 1, 0, 10);
  const score = Math.round((verificationScore + proofScore + completionScore + tenureScore) * 100) / 100;

  const admin = createAdminClient();
  await admin.from("trust_score").upsert({
    worker_id: workerId,
    score,
    breakdown: {
      verificationScore,
      proofScore,
      completionScore,
      tenureScore,
    },
  });
}
