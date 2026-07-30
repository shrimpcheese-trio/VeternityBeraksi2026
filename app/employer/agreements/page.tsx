import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { listAgreements } from "@/lib/repositories/agreement.repo";
import { AgreementCardEmployer } from "@/components/agreements/agreement-card-employer";
import { Briefcase, CheckCircle, AlertTriangle } from "lucide-react";

const tabs = [
  { key: "all", label: "Semua", icon: Briefcase },
  { key: "active", label: "Aktif", icon: CheckCircle },
  { key: "completed", label: "Selesai", icon: CheckCircle },
  { key: "disputed", label: "Sengketa", icon: AlertTriangle },
] as const;

export default async function EmployerAgreementsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) notFound();

  const activeTab = tabs.find((t) => t.key === status)?.key ?? "all";

  const agreements = await listAgreements(supabase, {
    employerId: user.id,
    ...(activeTab !== "all" ? { status: activeTab } : {}),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-medium tracking-tight">
          Pekerjaan Saya
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Daftar pekerjaan yang Anda pasang.
        </p>
      </div>

      <div className="flex items-center gap-1 border-b border-border">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          const href = tab.key === "all" ? "/employer/agreements" : `/employer/agreements?status=${tab.key}`;

          return (
            <a
              key={tab.key}
              href={href}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="size-4" />
              {tab.label}
            </a>
          );
        })}
      </div>

      {agreements.length > 0 ? (
        <div className="space-y-3">
          {agreements.map((agreement) => (
            <AgreementCardEmployer key={agreement.agreement_id} agreement={agreement} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Briefcase className="mb-4 size-12 text-muted-foreground/40" />
          <p className="text-sm font-medium text-muted-foreground">
            {activeTab === "all" && "Belum ada pekerjaan."}
            {activeTab === "active" && "Tidak ada pekerjaan aktif."}
            {activeTab === "completed" && "Belum ada pekerjaan selesai."}
            {activeTab === "disputed" && "Tidak ada sengketa."}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Perubahan status akan muncul secara otomatis.
          </p>
        </div>
      )}
    </div>
  );
}
