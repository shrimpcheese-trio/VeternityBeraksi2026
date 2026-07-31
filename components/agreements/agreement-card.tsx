import Link from "next/link";
import { MapPin, Building2, Calendar } from "lucide-react";
import { StatusBadge } from "@/components/agreements/status-badge";
import { getServerTranslator } from "@/lib/i18n-server";
import type { AgreementWithEmployer } from "@/lib/repositories/agreement.repo";

export async function AgreementCard({ agreement }: { agreement: AgreementWithEmployer }) {
  const t = await getServerTranslator("agreement");
  const employerName = agreement.employer_profiles?.company_name ?? t("detail.employerFallback");

  return (
    <Link
      href={`/worker/agreements/${agreement.agreement_id}`}
      className="flex items-center justify-between rounded-xl border border-border bg-background p-4 transition-colors hover:bg-muted/50"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <Building2 className="size-4 shrink-0 text-muted-foreground" />
          <p className="truncate text-sm font-medium">{employerName}</p>
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">
            Rp {agreement.price.toLocaleString("id-ID")}
          </span>
          {agreement.location && (
            <span className="flex items-center gap-1">
              <MapPin className="size-3" />
              {agreement.location}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar className="size-3" />
            {new Date(agreement.created_at).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
        {agreement.job_description && (
          <p className="mt-1.5 line-clamp-1 text-xs text-muted-foreground">
            {agreement.job_description}
          </p>
        )}
      </div>
      <StatusBadge status={agreement.status} />
    </Link>
  );
}
