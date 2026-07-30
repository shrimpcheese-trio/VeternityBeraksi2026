"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertTriangle } from "lucide-react";

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
      return { error: body.error ?? "Gagal mengubah status" };
    }

    window.location.href = "/worker/agreements";
    return { error: null };
  } catch {
    return { error: "Terjadi kesalahan. Silakan coba lagi." };
  }
}

export function AgreementActions({
  agreementId,
  status,
}: {
  agreementId: string;
  status: string;
}) {
  const [state, formAction, isPending] = useActionState(transitionAgreement, null);

  if (status === "draft") {
    return (
      <div className="space-y-2">
        <form action={formAction}>
          <input type="hidden" name="agreementId" value={agreementId} />
          <input type="hidden" name="newStatus" value="active" />
          <Button
            type="submit"
            disabled={isPending}
            className="w-full gap-2"
          >
            <CheckCircle className="size-4" />
            {isPending ? "Memproses..." : "Terima Penawaran"}
          </Button>
        </form>
        {state?.error && (
          <p className="text-xs text-red-600">{state.error}</p>
        )}
      </div>
    );
  }

  if (status === "active") {
    return (
      <div className="space-y-2">
        <form action={formAction}>
          <input type="hidden" name="agreementId" value={agreementId} />
          <input type="hidden" name="newStatus" value="completed" />
          <Button
            type="submit"
            disabled={isPending}
            variant="default"
            className="w-full gap-2"
          >
            <CheckCircle className="size-4" />
            {isPending ? "Memproses..." : "Tandai Selesai"}
          </Button>
        </form>
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
            {isPending ? "Memproses..." : "Laporkan Masalah"}
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
          ? "Pekerjaan ini sudah selesai."
          : "Pekerjaan ini dalam status sengketa."}
      </div>
    );
  }

  return null;
}
