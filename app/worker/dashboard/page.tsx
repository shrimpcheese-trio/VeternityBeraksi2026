import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Plus, List } from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { ChartWidget } from "@/components/dashboard/chart-widget";
import { ReminderCard } from "@/components/dashboard/reminder-card";
import { getServerTranslator } from "@/lib/i18n-server";
import { getLocale } from "@/lib/i18n";

type DashboardTranslator = Awaited<
  ReturnType<typeof getServerTranslator<"workerDashboard">>
>;

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

function computeTrend(
  current: number,
  previous: number,
  t: DashboardTranslator,
): { direction: "up" | "down"; text: string } {
  if (previous === 0 && current === 0)
    return { direction: "up", text: t("trendNoData") };
  if (previous === 0) return { direction: "up", text: t("trendNewData") };
  const pct = Math.round(((current - previous) / previous) * 100);
  if (pct >= 0) return { direction: "up", text: t("trendUp", { pct }) };
  return { direction: "down", text: t("trendDown", { pct }) };
}

export default async function WorkerDashboard() {
  const locale = await getLocale();
  const t = await getServerTranslator("workerDashboard");
  const monthNames = (await getServerTranslator("common")).raw(
    "monthsShort",
  ) as string[];

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const fullName = user?.user_metadata?.full_name ?? t("fallbackName");

  const [trustResult, agreementsResult, proofsResult] = await Promise.all([
    supabase
      .from("trust_score")
      .select("score")
      .eq("worker_id", user?.id ?? "")
      .maybeSingle(),
    supabase
      .from("agreements")
      .select("status, price, created_at")
      .eq("worker_id", user?.id ?? ""),
    supabase
      .from("proof_of_work")
      .select("job_type, job_date")
      .eq("worker_id", user?.id ?? "")
      .order("created_at", { ascending: false })
      .limit(3),
  ]);

  const agreements = agreementsResult.data ?? [];
  const completed = agreements.filter((a) => a.status === "completed");
  const totalCompleted = completed.length;
  const revenue = completed.reduce((sum, a) => sum + (a.price ?? 0), 0);

  const score = trustResult.data?.score ?? null;
  const scoreDisplay = score !== null ? `${score.toFixed(1)}/100` : "--/100";

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  const recentCompleted = completed.filter(
    (a) => new Date(a.created_at) >= thirtyDaysAgo,
  ).length;
  const priorCompleted = completed.filter(
    (a) =>
      new Date(a.created_at) >= sixtyDaysAgo &&
      new Date(a.created_at) < thirtyDaysAgo,
  ).length;

  const recentRevenue = completed
    .filter((a) => new Date(a.created_at) >= thirtyDaysAgo)
    .reduce((s, a) => s + (a.price ?? 0), 0);
  const priorRevenue = completed
    .filter(
      (a) =>
        new Date(a.created_at) >= sixtyDaysAgo &&
        new Date(a.created_at) < thirtyDaysAgo,
    )
    .reduce((s, a) => s + (a.price ?? 0), 0);

  const chartData = buildMonthlyChart(agreements, monthNames);

  const reminders = (proofsResult.data ?? []).map((p) => ({
    title: p.job_type,
    subtitle: new Date(p.job_date).toLocaleDateString(
      locale === "id" ? "id-ID" : "en-US",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      },
    ),
  }));

  const draftCount = agreements.filter((a) => a.status === "draft").length;
  if (draftCount > 0) {
    reminders.unshift({
      title: t("newOfferReminder"),
      subtitle: t("newOfferCount", { count: draftCount }),
    });
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-navy">
            Selamat datang, {fullName.split(" ")[0]}!
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            Ringkasan aktivitas dan performa pekerjaan Anda.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 rounded-full border-slate-200 text-navy hover:bg-slate-50 font-semibold px-4"
          >
            <List className="size-4" />
            {t("seeAll")}
          </Button>
          <Button
            size="sm"
            className="gap-1.5 rounded-full bg-navy text-white hover:bg-navy/90 hover:shadow-[0_8px_15px_-5px_rgba(10,37,64,0.3)] font-semibold px-4 transition-all"
          >
            <Plus className="size-4" />
            {t("newJob")}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <KpiCard
          label={t("kpiTrustScore")}
          value={scoreDisplay}
          trendDirection={computeTrend(0, 0, t).direction as "up" | "down"}
          trendText={
            score !== null
              ? t("trustScoreValue", { score: score.toFixed(1) })
              : t("trustScoreNotComputed")
          }
          variant="highlighted"
        />
        <KpiCard
          label={t("kpiCompleted")}
          value={String(totalCompleted)}
          trendDirection={
            computeTrend(recentCompleted, priorCompleted, t).direction
          }
          trendText={computeTrend(recentCompleted, priorCompleted, t).text}
        />
        <KpiCard
          label={t("kpiRevenue")}
          value={t("revenueValue", {
            million: (revenue / 1_000_000).toFixed(1),
          })}
          trendDirection={
            computeTrend(recentRevenue, priorRevenue, t).direction
          }
          trendText={computeTrend(recentRevenue, priorRevenue, t).text}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartWidget title={t("chartTitle")} data={chartData} />
        </div>
        <ReminderCard
          title={t("recentActivity")}
          items={reminders.slice(0, 3)}
          actionLabel={t("seeAll")}
        />
      </div>
    </div>
  );
}
