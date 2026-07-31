import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface WageEstimateCardProps {
  city?: string;
  jobType?: string;
  experience?: string;
  minWage?: number;
  maxWage?: number;
  hasData?: boolean;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function WageEstimateCard({
  city,
  jobType,
  experience,
  minWage,
  maxWage,
  hasData = true,
}: WageEstimateCardProps) {
  return (
    <Card variant="card" className="h-full flex flex-col justify-center text-center">
      <CardContent className="p-6 md:p-8 flex flex-col items-center gap-4">
        {hasData ? (
          <>
            <p className="text-caption text-text-muted">
              {jobType} · {city} · {experience}
            </p>
            <p className="text-[24px] leading-[1.2] font-semibold font-heading text-navy tabular-nums">
              {minWage && maxWage ? `${formatCurrency(minWage)} – ${formatCurrency(maxWage)}` : "-"}
            </p>
            <p className="text-xs text-text-muted mt-2">per pekerjaan</p>
          </>
        ) : (
          <p className="italic text-text-muted text-body text-center max-w-sm">
            "Belum ada cukup data upah untuk kombinasi ini di kotamu."
          </p>
        )}
      </CardContent>
    </Card>
  );
}
