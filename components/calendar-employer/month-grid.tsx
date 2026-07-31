import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getServerTranslator } from "@/lib/i18n-server";
import { getLocale } from "@/lib/i18n";

function buildWeeks(year: number, month: number): (number | null)[][] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDow = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const weeks: (number | null)[][] = [];
  let week: (number | null)[] = [];

  for (let i = 0; i < startDow; i++) week.push(null);

  for (let d = 1; d <= daysInMonth; d++) {
    week.push(d);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }

  while (week.length < 7) week.push(null);
  weeks.push(week);

  return weeks;
}

function formatMonth(year: number, month: number, locale: string): string {
  const date = new Date(year, month);
  return date.toLocaleDateString(locale === "id" ? "id-ID" : "en-US", {
    month: "long",
    year: "numeric",
  });
}

export async function MonthGrid({
  year,
  month,
  agreementDateSet,
  selectedDay,
}: {
  year: number;
  month: number;
  agreementDateSet: Set<string>;
  selectedDay: string | null;
}) {
  const t = await getServerTranslator("calendarEmployer");
  const locale = await getLocale();
  const weeks = buildWeeks(year, month);
  const todayStr = new Date().toISOString().slice(0, 10);

  const thisMonth = `${year}-${String(month + 1).padStart(2, "0")}`;
  const prevMonth = month === 0 ? `${year - 1}-12` : `${year}-${String(month).padStart(2, "0")}`;
  const nextMonth = month === 11 ? `${year + 1}-01` : `${year}-${String(month + 2).padStart(2, "0")}`;

  const dayNames = t.raw("monthGrid.dayNames") as string[];

  return (
    <div className="rounded-2xl border border-border bg-background p-5">
      <div className="mb-4 flex items-center justify-between">
        <a
          href={`/employer/calendar?month=${prevMonth}`}
          aria-label={t("monthGrid.prevMonthAria")}
          className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
        </a>
        <h2 className="font-heading text-base font-medium">
          {formatMonth(year, month, locale)}
        </h2>
        <a
          href={`/employer/calendar?month=${nextMonth}`}
          aria-label={t("monthGrid.nextMonthAria")}
          className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <ChevronRight className="size-4" />
        </a>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {dayNames.map((name) => (
          <div
            key={name}
            className="py-2 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
          >
            {name}
          </div>
        ))}

        {weeks.map((week, wi) =>
          week.map((day, di) => {
            if (day === null) return <div key={`${wi}-${di}`} />;

            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const isToday = dateStr === todayStr;
            const isSelected = dateStr === selectedDay;
            const hasAgreement = agreementDateSet.has(dateStr);

            return (
              <a
                key={dateStr}
                href={`/employer/calendar?month=${thisMonth}&day=${dateStr}`}
                className={cn(
                  "relative flex items-center justify-center rounded-xl py-3 text-sm transition-colors",
                  isSelected
                    ? "bg-primary text-primary-foreground font-semibold"
                    : isToday
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-foreground hover:bg-muted",
                )}
              >
                {day}
                {hasAgreement && (
                  <span
                    className={cn(
                      "absolute bottom-1.5 size-1.5 rounded-full",
                      isSelected
                        ? "bg-primary-foreground"
                        : "bg-primary",
                    )}
                  />
                )}
              </a>
            );
          }),
        )}
      </div>
    </div>
  );
}
