import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getWorkerById } from "@/lib/repositories/worker.repo";
import { AdminWorkerEditForm } from "@/components/admin/worker-edit-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function WorkerDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const supabase = await createClient();
  const worker = await getWorkerById(supabase, id);

  if (!worker) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-medium tracking-tight">
          {worker.full_name}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {worker.job_category} &middot; {worker.city}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Edit Profil</CardTitle>
            </CardHeader>
            <CardContent>
              <AdminWorkerEditForm worker={worker} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ringkasan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Skor Kepercayaan</span>
                <span className="font-medium">{worker.trust_score}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pengalaman</span>
                <span className="font-medium">{worker.years_experience} tahun</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Lokasi Terlihat</span>
                <span className="font-medium">{worker.location_visible ? "Ya" : "Tidak"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bergabung</span>
                <span className="font-medium">
                  {new Date(worker.created_at).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
