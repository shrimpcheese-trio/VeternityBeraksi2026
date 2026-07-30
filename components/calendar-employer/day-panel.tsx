import { XCircle, User } from "lucide-react";
import type { AgreementWithProfiles } from "@/lib/repositories/agreement.repo";
import { StatusBadge } from "@/components/agreements/status-badge";
import Link from "next/link";

export function DayPanel({ day, agreements }: { day: string; agreements: AgreementWithProfiles[] }) {
  const date = new Date(day + "T00:00:00");
  const formatted = date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="rounded-2xl border border-border bg-background p-5">
      <h3 className="mb-4 font-heading text-base font-medium">{formatted}</h3>

      {agreements.length > 0 ? (
        <div className="space-y-3">
          {agreements.map((agreement) => {
            const workerName = agreement.worker_profiles?.full_name ?? "Pekerja";
            return (
              <Link
                key={agreement.agreement_id}
                href={`/employer/agreements/${agreement.agreement_id}`}
                className="flex items-center justify-between rounded-xl border border-border bg-surface-card p-3 transition-colors hover:bg-muted/50"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <User className="size-4 shrink-0 text-muted-foreground" />
                    <p className="truncate text-sm font-medium">{workerName}</p>
                  </div>
                  {agreement.job_description && (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {agreement.job_description}
                    </p>
                  )}
                  <p className="mt-0.5 text-xs font-medium text-foreground">
                    Rp {agreement.price.toLocaleString("id-ID")}
                  </p>
                </div>
                <StatusBadge status={agreement.status} />
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <XCircle className="mb-2 size-8 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">Tidak ada pekerjaan pada hari ini.</p>
        </div>
      )}
    </div>
  );
}
