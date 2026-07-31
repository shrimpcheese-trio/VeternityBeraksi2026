import Link from "next/link";
import { MapPin, User, Calendar } from "lucide-react";
import { StatusBadge } from "@/components/agreements/status-badge";
import { getServerTranslator } from "@/lib/i18n-server";
import { getLocale } from "@/lib/i18n";
import type { AgreementWithProfiles } from "@/lib/repositories/agreement.repo";
import type { NegotiationRowType } from "@/lib/repositories/negotiation.repo";

export async function AgreementCardEmployer({
  agreement,
  latestCounter,
}: {
  agreement: AgreementWithProfiles;
  latestCounter?: NegotiationRowType | null;
}) {
  const t = await getServerTranslator("agreement");
  const locale = await getLocale();
  const workerName = agreement.worker_profiles?.full_name ?? t("detail.workerFallback");

  return (
    <Link
      href={`/employer/agreements/${agreement.agreement_id}`}
      className="flex items-center justify-between rounded-xl border border-border bg-background p-4 transition-colors hover:bg-muted/50"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <User className="size-4 shrink-0 text-muted-foreground" />
          <p className="truncate text-sm font-medium">{workerName}</p>
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
            {new Date(agreement.created_at).toLocaleDateString(locale === "id" ? "id-ID" : "en-US", {
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
      <div className="flex flex-col items-end gap-2">
        {latestCounter?.role === "worker" && (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
            {t("list.counterBadge", { price: `Rp ${latestCounter.price.toLocaleString("id-ID")}` })}
          </span>
        )}
        <StatusBadge status={agreement.status} />
      </div>
    </Link>
  );
}
