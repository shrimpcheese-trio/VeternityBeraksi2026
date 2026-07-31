import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { listProofsByDateRange } from "@/lib/repositories/proof-of-work.repo";
import { listAgreements } from "@/lib/repositories/agreement.repo";
import { MonthGrid } from "@/components/calendar/month-grid";
import { DayPanel } from "@/components/calendar/day-panel";
import { ActivePanel } from "@/components/calendar/active-panel";
import { getServerTranslator } from "@/lib/i18n-server";

export default async function WorkerCalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; day?: string }>;
}) {
  const { month, day } = await searchParams;
  const t = await getServerTranslator("workerCalendar");
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

  const [proofs, activeAgreements] = await Promise.all([
    listProofsByDateRange(supabase, user.id, fromDate, toDate),
    listAgreements(supabase, { workerId: user.id, status: "active" }),
  ]);

  const proofDateSet = new Set(proofs.map((p) => p.job_date));

  const selectedDay = day && day >= fromDate && day <= toDate ? day : null;
  const dayProofs = selectedDay
    ? proofs.filter((p) => p.job_date === selectedDay)
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-medium tracking-tight">
          {t("title")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <MonthGrid
            year={year}
            month={m}
            proofDateSet={proofDateSet}
            selectedDay={selectedDay}
          />

          {selectedDay && (
            <DayPanel day={selectedDay} proofs={dayProofs} />
          )}
        </div>

        <div>
          <ActivePanel agreements={activeAgreements} />
        </div>
      </div>
    </div>
  );
}
