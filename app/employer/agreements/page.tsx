import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import { listAgreements } from "@/lib/repositories/agreement.repo";
import { listLatestNegotiationsByAgreementIds } from "@/lib/repositories/negotiation.repo";
import { AgreementCardEmployer } from "@/components/agreements/agreement-card-employer";
import { Briefcase, CheckCircle, AlertTriangle, MessageSquare } from "lucide-react";
import { getServerTranslator } from "@/lib/i18n-server";

const tabs = [
  { key: "all", icon: Briefcase },
  { key: "draft", icon: MessageSquare },
  { key: "active", icon: CheckCircle },
  { key: "completed", icon: CheckCircle },
  { key: "disputed", icon: AlertTriangle },
] as const;

export default async function EmployerAgreementsPage({
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
    draft: t("list.emptyDraftEmployer"),
    active: t("list.emptyActive"),
    completed: t("list.emptyCompleted"),
    disputed: t("list.emptyDisputed"),
  };

  const allAgreements = await listAgreements(supabase, { employerId: user.id });
  const agreements =
    activeTab === "all"
      ? allAgreements
      : allAgreements.filter((agreement) => agreement.status === activeTab);
  const draftCount = allAgreements.filter(
    (agreement) => agreement.status === "draft",
  ).length;

  const admin = createAdminClient();
  const draftAgreementIds = allAgreements
    .filter((agreement) => agreement.status === "draft")
    .map((agreement) => agreement.agreement_id);
  const latestNegotiations =
    await listLatestNegotiationsByAgreementIds(admin, draftAgreementIds);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-medium tracking-tight">
          {t("list.title")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("list.employerSubtitle")}
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
              {tabLabels[tab.key]}
              {tab.key === "draft" && draftCount > 0 && (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                  {draftCount}
                </span>
              )}
            </a>
          );
        })}
      </div>

      {agreements.length > 0 ? (
        <div className="space-y-3">
          {agreements.map((agreement) => (
            <AgreementCardEmployer
              key={agreement.agreement_id}
              agreement={agreement}
              latestCounter={latestNegotiations[agreement.agreement_id]}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Briefcase className="mb-4 size-12 text-muted-foreground/40" />
          <p className="text-sm font-medium text-muted-foreground">
            {emptyState[activeTab]}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {t("list.emptyGenericHint")}
          </p>
        </div>
      )}
    </div>
  );
}
