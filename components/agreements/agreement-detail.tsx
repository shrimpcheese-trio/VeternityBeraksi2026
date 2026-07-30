import { Building2, MapPin, Clock, Calendar, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/agreements/status-badge";
import { AgreementActions } from "@/components/agreements/agreement-actions";
import type { AgreementWithEmployer } from "@/lib/repositories/agreement.repo";

export function AgreementDetail({ agreement }: { agreement: AgreementWithEmployer }) {
  const employer = agreement.employer_profiles;

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="font-heading text-xl font-medium">
                Detail Pekerjaan
              </CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Informasi lengkap tentang perjanjian kerja ini.
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
                {employer?.company_name ?? "Pemberi Kerja"}
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
                Dibuat:{" "}
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

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="font-heading text-lg font-medium">Tindakan</CardTitle>
        </CardHeader>
        <CardContent>
          <AgreementActions
            agreementId={agreement.agreement_id}
            status={agreement.status}
          />
        </CardContent>
      </Card>
    </div>
  );
}
