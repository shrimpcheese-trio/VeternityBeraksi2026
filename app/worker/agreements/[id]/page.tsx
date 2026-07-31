import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { notFound, redirect } from "next/navigation";
import { getAgreementById } from "@/lib/repositories/agreement.repo";
import { getProofOfWorkByAgreement } from "@/lib/repositories/proof-of-work.repo";
import { getReviewByAgreement } from "@/lib/repositories/review.repo";
import { AgreementDetail } from "@/components/agreements/agreement-detail";
import { ReceivedReview } from "@/components/reviews/received-review";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function WorkerAgreementDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const agreement = await getAgreementById(supabase, id);

  if (!agreement) notFound();
  if (agreement.worker_id !== user.id) notFound();

  const admin = createAdminClient();
  const proof = await getProofOfWorkByAgreement(admin, id);
  const proofComplete =
    proof?.photo_before_url != null && proof?.photo_after_url != null;
  const showProofUpload = agreement.status === "active";

  const review = await getReviewByAgreement(admin, id);

  return (
    <div className="space-y-6">
      <Link
        href="/worker/agreements"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Kembali ke daftar
      </Link>

      <AgreementDetail
        agreement={agreement}
        proofComplete={proofComplete}
        showProofUpload={showProofUpload}
      />

      {review && (
        <ReceivedReview
          rating={review.rating}
          comment={review.comment}
          photoUrls={review.photo_urls}
          employerName={agreement.employer_profiles?.company_name ?? "Pemberi Kerja"}
          createdAt={review.created_at}
        />
      )}
    </div>
  );
}
