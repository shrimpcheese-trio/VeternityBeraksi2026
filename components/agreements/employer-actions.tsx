"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, MessageSquare } from "lucide-react";
import { CounterForm } from "@/components/agreements/counter-form";
import type { NegotiationRowType } from "@/lib/repositories/negotiation.repo";

function formatPrice(price: number): string {
  return `Rp ${price.toLocaleString("id-ID")}`;
}

export function EmployerActions({
  agreementId,
  negotiations,
}: {
  agreementId: string;
  negotiations: NegotiationRowType[];
}) {
  const t = useTranslations("agreement.negotiation");
  const router = useRouter();
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState("");
  const [showRevise, setShowRevise] = useState(false);

  const latest = negotiations[negotiations.length - 1];
  const hasCounter = latest?.role === "worker";

  async function acceptCounter() {
    setAccepting(true);
    setError("");
    const res = await fetch(`/api/agreement/${agreementId}/transition`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newStatus: "active" }),
    });

    if (res.ok) {
      window.location.href = "/employer/agreements";
      return;
    }

    const body = await res.json();
    setError(body.error ?? t("submitError"));
    setAccepting(false);
  }

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="font-heading text-lg font-medium">
          {t("actionsTitle")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {!hasCounter ? (
          <div className="rounded-lg bg-muted/60 p-3 text-sm text-muted-foreground">
            {t("waitingNote")}
          </div>
        ) : (
          <>
            <div className="rounded-lg bg-muted/60 p-3">
              <p className="text-sm font-medium">
                {t("workerCounterPending", { price: formatPrice(latest.price) })}
              </p>
              {latest.reason && (
                <p className="mt-1 flex items-start gap-1.5 text-xs text-muted-foreground">
                  <MessageSquare className="mt-0.5 size-3.5 shrink-0" />
                  {latest.reason}
                </p>
              )}
            </div>

            {showRevise ? (
              <div className="space-y-3">
                <CounterForm
                  agreementId={agreementId}
                  mode="revise"
                  initialPrice={latest.price}
                  onSubmitted={() => {
                    setShowRevise(false);
                    router.refresh();
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowRevise(false)}
                >
                  {t("cancel")}
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Button
                  type="button"
                  onClick={acceptCounter}
                  disabled={accepting}
                  className="w-full gap-2"
                >
                  <CheckCircle className="size-4" />
                  {accepting ? t("processing") : t("acceptCounter")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => setShowRevise(true)}
                >
                  <MessageSquare className="size-4" />
                  {t("reviseOffer")}
                </Button>
              </div>
            )}

            {error && <p className="text-xs text-red-600">{error}</p>}
          </>
        )}
      </CardContent>
    </Card>
  );
}
