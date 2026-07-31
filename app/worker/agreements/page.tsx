import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { listAgreements } from "@/lib/repositories/agreement.repo";
import { AgreementCard } from "@/components/agreements/agreement-card";
import { Briefcase, Inbox, CheckCircle, AlertTriangle } from "lucide-react";
import { getServerTranslator } from "@/lib/i18n-server";

const tabs = [
  { key: "all", icon: Briefcase },
  { key: "draft", icon: Inbox },
  { key: "active", icon: CheckCircle },
  { key: "completed", icon: CheckCircle },
  { key: "disputed", icon: AlertTriangle },
] as const;

export default async function WorkerAgreementsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const t = await getServerTranslator("agreement");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) notFound();

  const activeTab = tabs.find((tab) => tab.key === status)?.key ?? "all";

  const tabLabels: Record<string, string> = {
    all: t("list.tabAll"),
    draft: t("list.tabDraft"),
    active: t("list.tabActive"),
    completed: t("list.tabCompleted"),
    disputed: t("list.tabDisputed"),
  };

  const emptyState: Record<string, string> = {
    all: t("list.emptyAll"),
    draft: t("list.emptyDraftWorker"),
    active: t("list.emptyActive"),
    completed: t("list.emptyCompleted"),
    disputed: t("list.emptyDisputed"),
  };

  const agreements = await listAgreements(supabase, {
    workerId: user.id,
    ...(activeTab !== "all" ? { status: activeTab } : {}),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-medium tracking-tight">
          {t("list.title")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("list.workerSubtitle")}
        </p>
      </div>

      <div className="flex items-center gap-1 border-b border-border">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          const href = tab.key === "all" ? "/worker/agreements" : `/worker/agreements?status=${tab.key}`;

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
              {tabLabels[tab.key]}
              {tab.key === "draft" && (
                <span className="flex size-5 items-center justify-center rounded-full bg-amber-500/10 text-[10px] font-bold text-amber-600">
                  {agreements.length}
                </span>
              )}
            </a>
          );
        })}
      </div>

      {agreements.length > 0 ? (
        <div className="space-y-3">
          {agreements.map((agreement) => (
            <AgreementCard key={agreement.agreement_id} agreement={agreement} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Briefcase className="mb-4 size-12 text-muted-foreground/40" />
          <p className="text-sm font-medium text-muted-foreground">
            {emptyState[activeTab]}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {activeTab === "draft"
              ? t("list.emptyDraftHintWorker")
              : t("list.emptyGenericHint")}
          </p>
        </div>
      )}
    </div>
  );
}
