"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, X } from "lucide-react";
import { useTranslations } from "next-intl";

type ProofState = {
  photoBeforeUrl: string | null;
  photoAfterUrl: string | null;
};

export function ProofUpload({
  agreementId,
  initialProof,
}: {
  agreementId: string;
  initialProof: ProofState | null;
}) {
  const router = useRouter();
  const t = useTranslations("agreement.proof");
  const [proof, setProof] = useState<ProofState>(
    initialProof ?? { photoBeforeUrl: null, photoAfterUrl: null },
  );
  const [uploading, setUploading] = useState<"before" | "after" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const beforeInputRef = useRef<HTMLInputElement>(null);
  const afterInputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(
    fileType: "before" | "after",
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(fileType);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileType", fileType);

    try {
      const res = await fetch(`/api/agreement/${agreementId}/proof`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const body = await res.json();
        setError(body.error ?? t("uploadFailed"));
        return;
      }

      const body = await res.json();
      setProof({
        photoBeforeUrl: body.proof?.photo_before_url ?? null,
        photoAfterUrl: body.proof?.photo_after_url ?? null,
      });
      router.refresh();
    } catch {
      setError(t("genericError"));
    } finally {
      setUploading(null);
    }
  }

  function renderSlot(
    fileType: "before" | "after",
    photoUrl: string | null,
    label: string,
    inputRef: React.RefObject<HTMLInputElement | null>,
  ) {
    const input = (
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(e) => handleUpload(fileType, e)}
      />
    );

    if (photoUrl) {
      return (
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-bg-alt">
          <img src={photoUrl} alt={label} className="size-full object-cover" />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute bottom-2 right-2 rounded-lg bg-white/80 px-3 py-1.5 text-xs font-medium hover:bg-white"
          >
            {t("replace")}
          </button>
          {input}
        </div>
      );
    }

    return (
      <>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading !== null}
          className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-bg-alt text-muted-foreground hover:border-primary hover:text-primary disabled:opacity-50"
        >
          {uploading === fileType ? (
            <span className="text-xs">{t("uploading")}</span>
          ) : (
            <>
              <Upload className="size-6" />
              <span className="text-xs">{label}</span>
            </>
          )}
        </button>
        {input}
      </>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-medium">{t("heading")}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {t("helper")}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-xs font-medium text-muted-foreground">
            {t("beforeLabel")}
          </label>
          {renderSlot(
            "before",
            proof.photoBeforeUrl,
            t("beforeUpload"),
            beforeInputRef,
          )}
        </div>
        <div className="space-y-2">
          <label className="block text-xs font-medium text-muted-foreground">
            {t("afterLabel")}
          </label>
          {renderSlot(
            "after",
            proof.photoAfterUrl,
            t("afterUpload"),
            afterInputRef,
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
          <X className="mt-0.5 size-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {proof.photoBeforeUrl && proof.photoAfterUrl && (
        <p className="text-xs font-medium text-sky-active">
          {t("complete")}
        </p>
      )}
    </div>
  );
}
