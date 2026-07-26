import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Plus, List } from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { ChartWidget } from "@/components/dashboard/chart-widget";
import { ReminderCard } from "@/components/dashboard/reminder-card";

const monthlyJobs = [
  { label: "Jan", value: 3 },
  { label: "Feb", value: 5 },
  { label: "Mar", value: 4 },
  { label: "Apr", value: 7 },
  { label: "Mei", value: 6 },
  { label: "Jun", value: 8 },
];

const reminders = [
  { title: "Renovasi Rumah - 2 pelamar", subtitle: "Dibutuhkan segera - Jl. Sudirman" },
  { title: "Servis AC Kantor", subtitle: "3 pelamar - ajukan penawaran" },
  { title: "Perjanjian Baru", subtitle: "Menunggu tanda tangan - Fotografer" },
];

export default async function EmployerDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const fullName = user?.user_metadata?.full_name ?? "Pemberi Kerja";

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
          <Button variant="outline" size="sm" className="gap-1.5">
            <List className="size-4" />
            Lihat Semua
          </Button>
          <Button size="sm" className="gap-1.5">
            <Plus className="size-4" />
            Pasang Pekerjaan Baru
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard
          label="Pelamar Baru"
          value="18"
          trendDirection="up"
          trendText="+4 dari bulan lalu"
          variant="highlighted"
        />
        <KpiCard
          label="Pekerjaan Dipasang"
          value="12"
          trendDirection="up"
          trendText="+8% dari bulan lalu"
        />
        <KpiCard
          label="Total Pengeluaran"
          value="Rp 32,2 Jt"
          trendDirection="up"
          trendText="+15% dari bulan lalu"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartWidget title="Pekerjaan per Bulan" data={monthlyJobs} />
        </div>
        <ReminderCard
          title="Perlu Ditindaklanjuti"
          items={reminders}
          actionLabel="Lihat Semua"
        />
      </div>
    </div>
  );
}
