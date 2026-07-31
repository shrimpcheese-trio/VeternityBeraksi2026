import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { notFound, redirect } from "next/navigation";
import { getAgreementById } from "@/lib/repositories/agreement.repo";
import { getProofOfWorkByAgreement } from "@/lib/repositories/proof-of-work.repo";
import { getReviewByAgreement } from "@/lib/repositories/review.repo";
import { listNegotiationsByAgreement } from "@/lib/repositories/negotiation.repo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/agreements/status-badge";
import { ReviewForm } from "@/components/reviews/review-form";
import { NegotiationHistory } from "@/components/agreements/negotiation-history";
import { EmployerActions } from "@/components/agreements/employer-actions";
import { ArrowLeft, User, MapPin, Clock, Calendar, FileText, Star, Camera } from "lucide-react";
import Link from "next/link";
import { getServerTranslator } from "@/lib/i18n-server";
import { getLocale } from "@/lib/i18n";

export default async function EmployerAgreementDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = await getServerTranslator("agreement");
  const locale = await getLocale();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const agreement = await getAgreementById(supabase, id);

  if (!agreement) notFound();
  if (agreement.employer_id !== user.id) notFound();

  const worker = agreement.worker_profiles;
  const workerName = worker?.full_name ?? t("detail.workerFallback");

  const admin = createAdminClient();
  const proof = await getProofOfWorkByAgreement(admin, id);
  const hasProofPhotos = proof?.photo_before_url != null || proof?.photo_after_url != null;

  const existingReview = await getReviewByAgreement(admin, id);
  const showReviewForm = agreement.status === "completed";
  const negotiations = await listNegotiationsByAgreement(admin, id);
  const employerName = agreement.employer_profiles?.company_name ?? t("detail.employerFallback");

  return (
    <div className="space-y-6">
      <Link
        href="/employer/agreements"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        {t("list.backToList")}
      </Link>

      <Card className="rounded-2xl">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="font-heading text-xl font-medium">
                {t("detail.title")}
              </CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("detail.subtitle")}
              </p>
            </div>
            <StatusBadge status={agreement.status} />
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-start gap-3">
            <User className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">{workerName}</p>
              {worker?.job_category && (
                <p className="text-xs text-muted-foreground">{worker.job_category}</p>
              )}
              {worker?.trust_score !== undefined && (
                <p className="mt-0.5 flex items-center gap-1 text-xs text-amber-600">
                  <Star className="size-3" />
                  {t("detail.trustScore", { score: worker.trust_score.toFixed(2) })}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FileText className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Rp {agreement.price.toLocaleString("id-ID")}</p>
              {agreement.job_description && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {agreement.job_description}
                </p>
              )}
            </div>
          </div>

          {agreement.location && (
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-sm">{agreement.location}</p>
              </div>
            </div>
          )}

          {agreement.work_hours && (
            <div className="flex items-start gap-3">
              <Clock className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-sm">{agreement.work_hours}</p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <Calendar className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-sm">
                {t("detail.createdAt")}{" "}
                {new Date(agreement.created_at).toLocaleDateString(locale === "id" ? "id-ID" : "en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <NegotiationHistory
        negotiations={negotiations}
        employerName={employerName}
        viewerRole="employer"
      />

      {agreement.status === "draft" && (
        <EmployerActions
          agreementId={agreement.agreement_id}
          negotiations={negotiations}
        />
      )}

      {hasProofPhotos && (
        <Card className="rounded-2xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Camera className="size-4 text-muted-foreground" />
              <CardTitle className="font-heading text-lg font-medium">
                {t("detail.proofPhotosTitle")}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {proof?.photo_before_url && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    {t("detail.photoBefore")}
                  </p>
                  <div className="aspect-video w-full overflow-hidden rounded-xl bg-bg-alt">
                    <img
                      src={proof.photo_before_url}
                      alt={t("detail.photoBeforeAlt")}
                      className="size-full object-cover"
                    />
                  </div>
                </div>
              )}
              {proof?.photo_after_url && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    {t("detail.photoAfter")}
                  </p>
                  <div className="aspect-video w-full overflow-hidden rounded-xl bg-bg-alt">
                    <img
                      src={proof.photo_after_url}
                      alt={t("detail.photoAfterAlt")}
                      className="size-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {showReviewForm && (
        <Card className="rounded-2xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Star className="size-4 text-amber-400" />
              <CardTitle className="font-heading text-lg font-medium">
                {existingReview ? t("detail.yourReview") : t("detail.rateJob")}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ReviewForm
              agreementId={agreement.agreement_id}
              existingReview={
                existingReview
                  ? {
                      rating: existingReview.rating,
                      comment: existingReview.comment,
                      photoUrls: existingReview.photo_urls,
                    }
                  : null
              }
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
