import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Plus, List } from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { ChartWidget } from "@/components/dashboard/chart-widget";
import { ReminderCard } from "@/components/dashboard/reminder-card";

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
];

function buildMonthlyChart(agreements: { status: string; created_at: string }[]) {
  const now = new Date();
  const months: { label: string; value: number }[] = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const next = new Date(d.getFullYear(), d.getMonth() + 1, 1);
    const count = agreements.filter((a) => {
      const c = new Date(a.created_at);
      return c >= d && c < next;
    }).length;
    months.push({ label: MONTH_NAMES[d.getMonth()], value: count });
  }

  return months;
}

function computeTrend(current: number, previous: number): { direction: "up" | "down"; text: string } {
  if (previous === 0 && current === 0) return { direction: "up", text: "Belum ada data" };
  if (previous === 0) return { direction: "up", text: "Data baru tersedia" };
  const pct = Math.round(((current - previous) / previous) * 100);
  if (pct >= 0) return { direction: "up", text: `+${pct}% dari periode lalu` };
  return { direction: "down", text: `${pct}% dari periode lalu` };
}

export default async function WorkerDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const fullName = user?.user_metadata?.full_name ?? "Pekerja";

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
  const scoreDisplay = score !== null ? `${score.toFixed(1)}/5.0` : "--/5.0";

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  const recentCompleted = completed.filter((a) => new Date(a.created_at) >= thirtyDaysAgo).length;
  const priorCompleted = completed.filter(
    (a) => new Date(a.created_at) >= sixtyDaysAgo && new Date(a.created_at) < thirtyDaysAgo,
  ).length;

  const recentRevenue = completed
    .filter((a) => new Date(a.created_at) >= thirtyDaysAgo)
    .reduce((s, a) => s + (a.price ?? 0), 0);
  const priorRevenue = completed
    .filter((a) => new Date(a.created_at) >= sixtyDaysAgo && new Date(a.created_at) < thirtyDaysAgo)
    .reduce((s, a) => s + (a.price ?? 0), 0);

  const chartData = buildMonthlyChart(agreements);

  const reminders = (proofsResult.data ?? []).map((p) => ({
    title: p.job_type,
    subtitle: new Date(p.job_date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  }));

  if (agreements.filter((a) => a.status === "draft").length > 0) {
    reminders.unshift({
      title: "Penawaran Pekerjaan Baru",
      subtitle: `${agreements.filter((a) => a.status === "draft").length} penawaran menunggu`,
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-heading text-2xl font-medium tracking-tight">
            Selamat datang, {fullName.split(" ")[0]}!
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Ringkasan aktivitas dan performa pekerjaan Anda.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <List className="size-4" />
            Lihat Semua
          </Button>
          <Button size="sm" className="gap-1.5">
            <Plus className="size-4" />
            Buat Pekerjaan Baru
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard
          label="Skor Kepercayaan"
          value={scoreDisplay}
          trendDirection={computeTrend(0, 0).direction as "up" | "down"}
          trendText={score !== null ? `${score.toFixed(1)} dari 5.0` : "Belum dihitung"}
          variant="highlighted"
        />
        <KpiCard
          label="Proyek Selesai"
          value={String(totalCompleted)}
          trendDirection={computeTrend(recentCompleted, priorCompleted).direction}
          trendText={computeTrend(recentCompleted, priorCompleted).text}
        />
        <KpiCard
          label="Total Pendapatan"
          value={`Rp ${(revenue / 1_000_000).toFixed(1)} Jt`}
          trendDirection={computeTrend(recentRevenue, priorRevenue).direction}
          trendText={computeTrend(recentRevenue, priorRevenue).text}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartWidget title="Pekerjaan per Bulan" data={chartData} />
        </div>
        <ReminderCard
          title="Aktivitas Terbaru"
          items={reminders.slice(0, 3)}
          actionLabel="Lihat Semua"
        />
      </div>
    </div>
  );
}
