"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { formatPriceInput, parsePriceInput } from "@/lib/utils/currency";

export function CounterForm({
  agreementId,
  mode,
  initialPrice,
  initialReason,
  onSubmitted,
}: {
  agreementId: string;
  mode: "counter" | "revise";
  initialPrice: number;
  initialReason?: string;
  onSubmitted: () => void;
}) {
  const t = useTranslations("agreement.negotiation");
  const [price, setPrice] = useState(formatPriceInput(String(initialPrice)));
  const [reason, setReason] = useState(initialReason ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [reasonError, setReasonError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsedPrice = parsePriceInput(price);

    if (parsedPrice === null || parsedPrice <= 0) {
      setPriceError(t("priceError"));
      return;
    }
    setPriceError("");

    if (mode === "counter" && !reason.trim()) {
      setReasonError(t("reasonRequired"));
      return;
    }
    setReasonError("");

    setSubmitting(true);
    setError("");

    const res = await fetch(`/api/agreement/${agreementId}/counter`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        price: parsedPrice,
        reason: mode === "counter" ? reason.trim() : null,
      }),
    });

    if (res.ok) {
      onSubmitted();
    } else {
      const body = await res.json();
      setError(body.error ?? "Gagal mengirim penawaran.");
    }

    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="mb-1 block text-xs font-medium text-muted-foreground">
          {mode === "counter" ? t("yourPrice") : t("revisePrice")}
        </label>
        <input
          type="text"
          inputMode="numeric"
          value={price}
          onChange={(e) => {
            setPrice(formatPriceInput(e.target.value));
            setPriceError("");
          }}
          placeholder="Rp 150.000"
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary"
        />
        {priceError && <p className="mt-1 text-xs text-red-600">{priceError}</p>}
      </div>

      {mode === "counter" && (
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            {t("reason")}
          </label>
          <textarea
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setReasonError("");
            }}
            rows={3}
            placeholder={t("reasonPlaceholder")}
            className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary"
          />
          {reasonError && (
            <p className="mt-1 text-xs text-red-600">{reasonError}</p>
          )}
        </div>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        {submitting
          ? t("submitting")
          : mode === "counter"
            ? t("submitCounter")
            : t("submitRevise")}
      </button>
    </form>
  );
}
