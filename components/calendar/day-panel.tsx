import { CheckCircle, Clock, XCircle } from "lucide-react";
import type { Database } from "@/types/supabase";

type ProofRow = Database["public"]["Tables"]["proof_of_work"]["Row"];

export function DayPanel({ day, proofs }: { day: string; proofs: ProofRow[] }) {
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

      {proofs.length > 0 ? (
        <div className="space-y-3">
          {proofs.map((proof) => (
            <div
              key={proof.proof_id}
              className="flex items-center justify-between rounded-xl border border-border bg-surface-card p-3"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{proof.job_type}</p>
                {proof.job_value && (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Rp {proof.job_value.toLocaleString("id-ID")}
                  </p>
                )}
              </div>
              {proof.verified ? (
                <span className="flex items-center gap-1 text-xs text-green-600">
                  <CheckCircle className="size-3.5" />
                  Terverifikasi
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="size-3.5" />
                  Menunggu
                </span>
              )}
            </div>
          ))}
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
