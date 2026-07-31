import Link from "next/link";
import { User, ArrowRight } from "lucide-react";
import type { AgreementWithProfiles } from "@/lib/repositories/agreement.repo";
import { getServerTranslator } from "@/lib/i18n-server";

export async function ActivePanel({ agreements }: { agreements: AgreementWithProfiles[] }) {
  const t = await getServerTranslator("calendarEmployer");
  return (
    <div className="rounded-2xl border border-border bg-background p-5">
      <h3 className="mb-4 font-heading text-base font-medium">{t("activePanel.title")}</h3>

      {agreements.length > 0 ? (
        <div className="space-y-3">
          {agreements.map((agreement) => {
            const workerName = agreement.worker_profiles?.full_name ?? t("activePanel.fallbackWorkerName");
            return (
              <Link
                key={agreement.agreement_id}
                href={`/employer/agreements/${agreement.agreement_id}`}
                className="flex items-start gap-3 rounded-xl border border-border bg-bg-card p-3 transition-colors hover:bg-muted/50"
              >
                <User className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{workerName}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Rp {agreement.price.toLocaleString("id-ID")}
                  </p>
                  {agreement.location && (
                    <p className="truncate text-xs text-muted-foreground">
                      {agreement.location}
                    </p>
                  )}
                </div>
                <ArrowRight className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              </Link>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">{t("activePanel.emptyState")}</p>
      )}
    </div>
  );
}
