import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { listAgreements } from "@/lib/repositories/agreement.repo";
import { MonthGrid } from "@/components/calendar-employer/month-grid";
import { DayPanel } from "@/components/calendar-employer/day-panel";
import { ActivePanel } from "@/components/calendar-employer/active-panel";

export default async function EmployerCalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; day?: string }>;
}) {
  const { month, day } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) notFound();

  const today = new Date();
  let year = today.getFullYear();
  let m = today.getMonth();

  if (month) {
    const parts = month.split("-");
    year = parseInt(parts[0], 10);
    m = parseInt(parts[1], 10) - 1;
  }

  const fromDate = `${year}-${String(m + 1).padStart(2, "0")}-01`;
  const lastDay = new Date(year, m + 1, 0).getDate();
  const toDate = `${year}-${String(m + 1).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

  const allAgreements = await listAgreements(supabase, { employerId: user.id });

  const monthAgreements = allAgreements.filter((a) => {
    const d = a.created_at.slice(0, 10);
    return d >= fromDate && d <= toDate;
  });

  const activeAgreements = allAgreements.filter((a) => a.status === "active");

  const agreementDateSet = new Set(monthAgreements.map((a) => a.created_at.slice(0, 10)));

  const selectedDay = day && day >= fromDate && day <= toDate ? day : null;
  const dayAgreements = selectedDay
    ? monthAgreements.filter((a) => a.created_at.slice(0, 10) === selectedDay)
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-medium tracking-tight">
          Kalender
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Riwayat pekerjaan yang Anda pasang.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <MonthGrid
            year={year}
            month={m}
            agreementDateSet={agreementDateSet}
            selectedDay={selectedDay}
          />

          {selectedDay && (
            <DayPanel day={selectedDay} agreements={dayAgreements} />
          )}
        </div>

        <div>
          <ActivePanel agreements={activeAgreements} />
        </div>
      </div>
    </div>
  );
}
