import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, List } from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { ChartWidget } from "@/components/dashboard/chart-widget";
import { ReminderCard } from "@/components/dashboard/reminder-card";
import { getServerTranslator } from "@/lib/i18n-server";
import { getLocale } from "@/lib/i18n";

type DashboardTranslator = Awaited<ReturnType<typeof getServerTranslator<"employerDashboard">>>;

function buildMonthlyChart(
  agreements: { status: string; created_at: string }[],
  monthNames: string[],
) {
  const now = new Date();
  const months: { label: string; value: number }[] = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const next = new Date(d.getFullYear(), d.getMonth() + 1, 1);
    const count = agreements.filter((a) => {
      const c = new Date(a.created_at);
      return c >= d && c < next;
    }).length;
    months.push({ label: monthNames[d.getMonth()], value: count });
  }

  return months;
}

function computeTrend(current: number, previous: number, t: DashboardTranslator): { direction: "up" | "down"; text: string } {
  if (previous === 0 && current === 0) return { direction: "up", text: t("trends.noData") };
  if (previous === 0) return { direction: "up", text: t("trends.newData") };
  const pct = Math.round(((current - previous) / previous) * 100);
  if (pct >= 0) return { direction: "up", text: t("trends.up", { pct }) };
  return { direction: "down", text: t("trends.down", { pct }) };
}

export default async function EmployerDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const t = await getServerTranslator("employerDashboard");
  const common = await getServerTranslator("common");
  const locale = await getLocale();
  const monthNames = common.raw("monthsShort") as string[];
  const fullName = user?.user_metadata?.full_name ?? t("fallbackName");

  const { data: agreementsData } = await supabase
    .from("agreements")
    .select("status, price, created_at, job_description")
    .eq("employer_id", user?.id ?? "")
    .order("created_at", { ascending: false });

  const agreements = agreementsData ?? [];
  const totalJobs = agreements.length;
  const completed = agreements.filter((a) => a.status === "completed");
  const totalCompleted = completed.length;
  const totalSpend = completed.reduce((sum, a) => sum + (a.price ?? 0), 0);

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  const recentTotal = agreements.filter((a) => new Date(a.created_at) >= thirtyDaysAgo).length;
  const priorTotal = agreements.filter(
    (a) => new Date(a.created_at) >= sixtyDaysAgo && new Date(a.created_at) < thirtyDaysAgo,
  ).length;

  const recentCompleted = completed.filter((a) => new Date(a.created_at) >= thirtyDaysAgo).length;
  const priorCompleted = completed.filter(
    (a) => new Date(a.created_at) >= sixtyDaysAgo && new Date(a.created_at) < thirtyDaysAgo,
  ).length;

  const recentSpend = completed
    .filter((a) => new Date(a.created_at) >= thirtyDaysAgo)
    .reduce((s, a) => s + (a.price ?? 0), 0);
  const priorSpend = completed
    .filter((a) => new Date(a.created_at) >= sixtyDaysAgo && new Date(a.created_at) < thirtyDaysAgo)
    .reduce((s, a) => s + (a.price ?? 0), 0);

  const chartData = buildMonthlyChart(agreements, monthNames);

  const reminders = agreements.slice(0, 3).map((a) => ({
    title: a.job_description ?? t("reminders.jobFallback"),
    subtitle: t("reminders.dateSubtitle", {
      status: statusLabel(a.status, t),
      date: new Date(a.created_at).toLocaleDateString(locale === "id" ? "id-ID" : "en-US", { day: "numeric", month: "long" }),
    }),
  }));

  if (agreements.filter((a) => a.status === "draft").length > 0) {
    reminders.unshift({
      title: t("reminders.newOfferTitle"),
      subtitle: t("reminders.newOfferSubtitle", {
        count: agreements.filter((a) => a.status === "draft").length,
      }),
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-heading text-2xl font-medium tracking-tight">
            {t("greeting", { firstName: fullName.split(" ")[0] })}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" asChild>
            <Link href="/employer/agreements">
              <List className="size-4" />
              {t("viewAll")}
            </Link>
          </Button>
          <Button size="sm" className="gap-1.5" asChild>
            <Link href="/browse">
              <Plus className="size-4" />
              {t("findWorker")}
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard
          label={t("kpis.jobsPosted")}
          value={String(totalJobs)}
          trendDirection={computeTrend(recentTotal, priorTotal, t).direction}
          trendText={computeTrend(recentTotal, priorTotal, t).text}
          variant="highlighted"
        />
        <KpiCard
          label={t("kpis.jobsCompleted")}
          value={String(totalCompleted)}
          trendDirection={computeTrend(recentCompleted, priorCompleted, t).direction}
          trendText={computeTrend(recentCompleted, priorCompleted, t).text}
        />
        <KpiCard
          label={t("kpis.totalSpend")}
          value={t("kpis.totalSpendValue", { million: (totalSpend / 1_000_000).toFixed(1) })}
          trendDirection={computeTrend(recentSpend, priorSpend, t).direction}
          trendText={computeTrend(recentSpend, priorSpend, t).text}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartWidget title={t("chartTitle")} data={chartData} />
        </div>
        <ReminderCard
          title={t("reminders.title")}
          items={reminders.slice(0, 3)}
          actionLabel={t("reminders.actionLabel")}
        />
      </div>
    </div>
  );
}

function statusLabel(status: string, t: DashboardTranslator) {
  const labels: Record<string, string> = {
    draft: t("status.draft"),
    active: t("status.active"),
    completed: t("status.completed"),
    disputed: t("status.disputed"),
  };
  return labels[status] ?? status;
}
