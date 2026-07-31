"use client";

import { useState } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertTriangle, MessageSquare } from "lucide-react";
import { CounterForm } from "@/components/agreements/counter-form";
import type { NegotiationRowType } from "@/lib/repositories/negotiation.repo";

function formatPrice(price: number): string {
  return `Rp ${price.toLocaleString("id-ID")}`;
}

export function AgreementActions({
  agreementId,
  agreementPrice,
  status,
  proofComplete,
  negotiations,
}: {
  agreementId: string;
  agreementPrice: number;
  status: string;
  proofComplete?: boolean;
  negotiations: NegotiationRowType[];
}) {
  const t = useTranslations("agreement.negotiation");
  const router = useRouter();

  async function transitionAgreement(prev: { error: string | null } | null, formData: FormData) {
    const agreementId = formData.get("agreementId") as string;
    const newStatus = formData.get("newStatus") as string;

    try {
      const res = await fetch(`/api/agreement/${agreementId}/transition`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newStatus }),
      });

      if (!res.ok) {
        const body = await res.json();
        return { error: body.error ?? t("transitionFailed") };
      }

      window.location.href = "/worker/agreements";
      return { error: null };
    } catch {
      return { error: t("genericError") };
    }
  }

  const [state, formAction, isPending] = useActionState(transitionAgreement, null);
  const [showCounter, setShowCounter] = useState(false);

  if (status === "draft") {
    const latest = negotiations[negotiations.length - 1];
    const workerTurn = latest?.role !== "worker";
    const basePrice = latest?.role === "employer" ? latest.price : agreementPrice;

    return (
      <div className="space-y-3">
        {!workerTurn && latest && (
          <div className="rounded-lg bg-muted/60 p-3">
            <p className="text-sm font-medium">
              {t("counterSummary", { price: formatPrice(latest.price) })}
            </p>
            {latest.reason && (
              <p className="mt-1 flex items-start gap-1.5 text-xs text-muted-foreground">
                <MessageSquare className="mt-0.5 size-3.5 shrink-0" />
                {latest.reason}
              </p>
            )}
            <p className="mt-2 text-xs text-muted-foreground">{t("pendingNote")}</p>
          </div>
        )}

        {showCounter ? (
          <div className="space-y-3">
            <CounterForm
              agreementId={agreementId}
              mode="counter"
              initialPrice={basePrice}
              initialReason={latest?.role === "worker" ? latest.reason ?? "" : ""}
              onSubmitted={() => {
                setShowCounter(false);
                router.refresh();
              }}
            />
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setShowCounter(false)}
            >
              {t("cancel")}
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {workerTurn && (
              <form action={formAction}>
                <input type="hidden" name="agreementId" value={agreementId} />
                <input type="hidden" name="newStatus" value="active" />
                <Button type="submit" disabled={isPending} className="w-full gap-2">
                  <CheckCircle className="size-4" />
                  {isPending ? t("processing") : t("accept")}
                </Button>
              </form>
            )}
            <Button
              type="button"
              variant="outline"
              className="w-full gap-2"
              onClick={() => setShowCounter(true)}
            >
              <MessageSquare className="size-4" />
              {latest?.role === "worker" ? t("updateCounter") : t("placeCounter")}
            </Button>
            {state?.error && <p className="text-xs text-red-600">{state.error}</p>}
          </div>
        )}
      </div>
    );
  }

  if (status === "active") {
    const canComplete = proofComplete ?? true;
    return (
      <div className="space-y-2">
        <form action={formAction}>
          <input type="hidden" name="agreementId" value={agreementId} />
          <input type="hidden" name="newStatus" value="completed" />
          <Button
            type="submit"
            disabled={isPending || !canComplete}
            variant="default"
            className="w-full gap-2"
          >
            <CheckCircle className="size-4" />
            {isPending ? t("processing") : t("markComplete")}
          </Button>
        </form>
        {!canComplete && (
          <p className="text-xs text-muted-foreground">
            {t("completeHint")}
          </p>
        )}
        <form action={formAction}>
          <input type="hidden" name="agreementId" value={agreementId} />
          <input type="hidden" name="newStatus" value="disputed" />
          <Button
            type="submit"
            disabled={isPending}
            variant="outline"
            className="w-full gap-2 text-red-600"
          >
            <AlertTriangle className="size-4" />
            {isPending ? t("processing") : t("reportIssue")}
          </Button>
        </form>
        {state?.error && (
          <p className="text-xs text-red-600">{state.error}</p>
        )}
      </div>
    );
  }

  if (status === "completed" || status === "disputed") {
    return (
      <div className="rounded-lg bg-muted p-4 text-center text-sm text-muted-foreground">
        {status === "completed"
          ? t("alreadyCompleted")
          : t("inDispute")}
      </div>
    );
  }

  return null;
}
