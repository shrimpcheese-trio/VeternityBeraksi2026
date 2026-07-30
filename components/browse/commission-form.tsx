"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

interface CommissionFormProps {
  workerId: string;
  price: number;
  userId: string | null;
  userRole: string | null;
}

export function CommissionForm({ workerId, price, userId, userRole }: CommissionFormProps) {
  const t = useTranslations("browse");
  const [jobDescription, setJobDescription] = useState("");
  const [offerPrice, setOfferPrice] = useState(String(price));
  const [location, setLocation] = useState("");
  const [workHours, setWorkHours] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!userId || userRole !== "employer") return;
    setSubmitting(true);
    setError("");

    const res = await fetch("/api/agreement", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workerId,
        employerId: userId,
        price: Number(offerPrice),
        location: location || null,
        workHours: workHours || null,
        jobDescription: jobDescription || null,
      }),
    });

    if (res.ok) {
      setSuccess(true);
    } else {
      const body = await res.json();
      setError(body.error ?? "Gagal mengirim pesanan.");
    }

    setSubmitting(false);
  }

  if (success) {
    return (
      <div className="rounded-xl border border-border bg-surface-card p-6 text-center">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-green-100">
          <span className="text-2xl text-green-600">&#10003;</span>
        </div>
        <h3 className="text-lg font-semibold">{t("commissionModal.success")}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{t("commissionModal.successDescription")}</p>
      </div>
    );
  }

  if (!userId || userRole !== "employer") {
    return (
      <div className="rounded-xl border border-border bg-surface-card p-6 text-center">
        <p className="text-sm text-muted-foreground">{t("commissionModal.loginPrompt")}</p>
        <a
          href={`/login?redirect=/browse/${workerId}`}
          className="mt-4 inline-block rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          {t("commissionModal.loginLink")}
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-xs font-medium text-muted-foreground">
          {t("commissionModal.jobDescription")}
        </label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows={3}
          placeholder={t("commissionModal.jobDescriptionPlaceholder")}
          className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-muted-foreground">
          {t("commissionModal.offerPrice")}
        </label>
        <input
          type="number"
          value={offerPrice}
          onChange={(e) => setOfferPrice(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-muted-foreground">
          {t("commissionModal.location")}
        </label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder={t("commissionModal.locationPlaceholder")}
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-muted-foreground">
          {t("commissionModal.workHours")}
        </label>
        <input
          type="text"
          value={workHours}
          onChange={(e) => setWorkHours(e.target.value)}
          placeholder={t("commissionModal.workHoursPlaceholder")}
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        {submitting ? t("commissionModal.submitting") : t("commissionModal.submit")}
      </button>
    </form>
  );
}
