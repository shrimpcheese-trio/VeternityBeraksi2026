import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { getAgreementById } from "@/lib/repositories/agreement.repo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/agreements/status-badge";
import { ArrowLeft, User, MapPin, Clock, Calendar, FileText, Star } from "lucide-react";
import Link from "next/link";

export default async function EmployerAgreementDetailPage({
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
  if (agreement.employer_id !== user.id) notFound();

  const worker = agreement.worker_profiles;
  const workerName = worker?.full_name ?? "Pekerja";

  return (
    <div className="space-y-6">
      <Link
        href="/employer/agreements"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Kembali ke daftar
      </Link>

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
            <User className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">{workerName}</p>
              {worker?.job_category && (
                <p className="text-xs text-muted-foreground">{worker.job_category}</p>
              )}
              {worker?.trust_score !== undefined && (
                <p className="mt-0.5 flex items-center gap-1 text-xs text-amber-600">
                  <Star className="size-3" />
                  Skor Kepercayaan: {worker.trust_score.toFixed(2)}
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
    </div>
  );
}
