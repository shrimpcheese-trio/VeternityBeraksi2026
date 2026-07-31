"use client";

import { useTranslations } from "next-intl";
import { Building2, User, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { NegotiationRowType } from "@/lib/repositories/negotiation.repo";

function formatPrice(price: number): string {
  return `Rp ${price.toLocaleString("id-ID")}`;
}

export function NegotiationHistory({
  negotiations,
  employerName,
  viewerRole,
}: {
  negotiations: NegotiationRowType[];
  employerName: string;
  viewerRole: "worker" | "employer";
}) {
  const t = useTranslations("agreement.negotiation");

  if (negotiations.length === 0) return null;

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="font-heading text-lg font-medium">
          {t("historyTitle")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {negotiations.map((negotiation) => {
          const isEmployerRound = negotiation.role === "employer";
          const Icon = isEmployerRound ? Building2 : User;
          const label = isEmployerRound
            ? t("employerOffer", {
                name: employerName,
                price: formatPrice(negotiation.price),
              })
            : viewerRole === "worker"
              ? t("youCounter", { price: formatPrice(negotiation.price) })
              : t("workerCounter", { price: formatPrice(negotiation.price) });

          return (
            <div key={negotiation.negotiation_id} className="flex gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                <Icon className="size-4 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <p className="text-sm font-medium">{label}</p>
                  <time className="text-xs text-muted-foreground">
                    {new Date(negotiation.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </time>
                </div>
                {negotiation.reason && (
                  <div className="mt-1.5 flex items-start gap-1.5 rounded-lg bg-muted/60 p-2.5">
                    <MessageSquare className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">
                      {negotiation.reason}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
