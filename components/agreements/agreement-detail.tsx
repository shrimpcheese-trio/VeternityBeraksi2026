import { Building2, MapPin, Clock, Calendar, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/agreements/status-badge";
import { AgreementActions } from "@/components/agreements/agreement-actions";
import { ProofUpload } from "@/components/agreements/proof-upload";
import { NegotiationHistory } from "@/components/agreements/negotiation-history";
import { getServerTranslator } from "@/lib/i18n-server";
import type { AgreementWithEmployer } from "@/lib/repositories/agreement.repo";
import type { NegotiationRowType } from "@/lib/repositories/negotiation.repo";

export async function AgreementDetail({
  agreement,
  proofComplete,
  showProofUpload,
  negotiations,
}: {
  agreement: AgreementWithEmployer;
  proofComplete?: boolean;
  showProofUpload?: boolean;
  negotiations?: NegotiationRowType[];
}) {
  const t = await getServerTranslator("agreement");
  const employer = agreement.employer_profiles;

  return (
    <div className="space-y-6">
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
            <Building2 className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">
                {employer?.company_name ?? t("detail.employerFallback")}
              </p>
              {employer?.city && (
                <p className="text-xs text-muted-foreground">{employer.city}</p>
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
                {new Date(agreement.created_at).toLocaleDateString("id-ID", {
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
        negotiations={negotiations ?? []}
        employerName={employer?.company_name ?? t("detail.employerFallback")}
        viewerRole="worker"
      />

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="font-heading text-lg font-medium">{t("detail.actionsTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {showProofUpload && (
            <ProofUpload agreementId={agreement.agreement_id} initialProof={null} />
          )}
          <AgreementActions
            agreementId={agreement.agreement_id}
            agreementPrice={agreement.price}
            status={agreement.status}
            proofComplete={proofComplete}
            negotiations={negotiations ?? []}
          />
        </CardContent>
      </Card>
    </div>
  );
}
