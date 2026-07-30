import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
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

export default async function EmployerDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const fullName = user?.user_metadata?.full_name ?? "Pemberi Kerja";

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

  const chartData = buildMonthlyChart(agreements);

  const reminders = agreements.slice(0, 3).map((a) => ({
    title: a.job_description ?? "Pekerjaan",
    subtitle: `${statusLabel(a.status)} - ${new Date(a.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long" })}`,
  }));

  if (agreements.filter((a) => a.status === "draft").length > 0) {
    reminders.unshift({
      title: "Ada penawaran baru untuk ditinjau",
      subtitle: `${agreements.filter((a) => a.status === "draft").length} pekerjaan menunggu dikonfirmasi`,
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
            Ringkasan aktivitas dan daftar pekerjaan Anda.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" asChild>
            <Link href="/employer/agreements">
              <List className="size-4" />
              Lihat Semua
            </Link>
          </Button>
          <Button size="sm" className="gap-1.5" asChild>
            <Link href="/browse">
              <Plus className="size-4" />
              Cari Pekerja
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard
          label="Pekerjaan Dipasang"
          value={String(totalJobs)}
          trendDirection={computeTrend(recentTotal, priorTotal).direction}
          trendText={computeTrend(recentTotal, priorTotal).text}
          variant="highlighted"
        />
        <KpiCard
          label="Pekerjaan Selesai"
          value={String(totalCompleted)}
          trendDirection={computeTrend(recentCompleted, priorCompleted).direction}
          trendText={computeTrend(recentCompleted, priorCompleted).text}
        />
        <KpiCard
          label="Total Pengeluaran"
          value={`Rp ${(totalSpend / 1_000_000).toFixed(1)} Jt`}
          trendDirection={computeTrend(recentSpend, priorSpend).direction}
          trendText={computeTrend(recentSpend, priorSpend).text}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartWidget title="Pekerjaan per Bulan" data={chartData} />
        </div>
        <ReminderCard
          title="Perlu Ditindaklanjuti"
          items={reminders.slice(0, 3)}
          actionLabel="Lihat Semua"
        />
      </div>
    </div>
  );
}

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    draft: "Penawaran",
    active: "Aktif",
    completed: "Selesai",
    disputed: "Sengketa",
  };
  return labels[status] ?? status;
}
