"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

type ExistingReview = {
  rating: number;
  comment: string | null;
  photoUrls: string[];
} | null;

export function ReviewForm({
  agreementId,
  existingReview,
}: {
  agreementId: string;
  existingReview: ExistingReview;
}) {
  const router = useRouter();
  const t = useTranslations("reviews.form");
  const [rating, setRating] = useState(existingReview?.rating ?? 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState(existingReview?.comment ?? "");
  const [photoUrls, setPhotoUrls] = useState<string[]>(
    existingReview?.photoUrls ?? [],
  );
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeRating = hoverRating || rating;

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (photoUrls.length >= 3) {
      setError(t("maxPhotos"));
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`/api/review/${agreementId}/photo`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const body = await res.json();
        setError(body.error ?? t("uploadFailed"));
        return;
      }

      const body = await res.json();
      setPhotoUrls((current) => [...current, body.url]);
    } catch {
      setError(t("genericError"));
    } finally {
      setUploading(false);
    }
  }

  function removePhoto(url: string) {
    setPhotoUrls((current) => current.filter((photoUrl) => photoUrl !== url));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agreementId,
          rating,
          comment: comment.trim() || null,
          photoUrls,
        }),
      });

      if (!res.ok) {
        const body = await res.json();
        setError(body.error ?? t("submitFailed"));
        return;
      }

      setSuccess(existingReview ? t("updated") : t("submitted"));
      router.refresh();
    } catch {
      setError(t("genericError"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <p className="text-sm font-medium">
          {existingReview ? t("editTitle") : t("newTitle")}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {t("helper")}
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">{t("rating")}</p>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              aria-label={t("starAria", { star })}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(rating === star ? 0 : star)}
              className="transition-transform hover:scale-110"
            >
              <Star
                className={cn(
                  "size-7",
                  star <= activeRating
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted-foreground",
                )}
              />
            </button>
          ))}
          <span className="ml-2 text-sm text-muted-foreground">
            {rating > 0 ? t("score", { rating }) : t("notRated")}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="review-comment" className="block text-xs font-medium text-muted-foreground">
          {t("commentLabel")}
        </label>
        <textarea
          id="review-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={1000}
          rows={4}
          placeholder={t("commentPlaceholder")}
          className="w-full resize-none rounded-xl border border-border bg-bg-alt px-3 py-2 text-sm outline-none placeholder:text-muted-foreground/60 focus:border-primary"
        />
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">
          {t("photoLabel")}
        </p>

        {photoUrls.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {photoUrls.map((photoUrl) => (
              <div
                key={photoUrl}
                className="relative aspect-video overflow-hidden rounded-xl bg-bg-alt"
              >
                <img
                  src={photoUrl}
                  alt={t("photoAlt")}
                  className="size-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(photoUrl)}
                  className="absolute right-1.5 top-1.5 rounded-full bg-black/60 p-1 text-white"
                  aria-label={t("removePhoto")}
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {photoUrls.length < 3 && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={handleUpload}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex aspect-video w-full max-w-[10rem] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-bg-alt text-muted-foreground hover:border-primary hover:text-primary disabled:opacity-50"
            >
              {uploading ? (
                <span className="text-xs">{t("uploading")}</span>
              ) : (
                <>
                  <Upload className="size-5" />
                  <span className="text-xs">{t("addPhoto")}</span>
                </>
              )}
            </button>
          </>
        )}
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
          <X className="mt-0.5 size-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <p className="text-xs font-medium text-green-600">{success}</p>
      )}

      <Button type="submit" disabled={submitting} className="w-full gap-2">
        {submitting
          ? t("submitting")
          : existingReview
            ? t("updateButton")
            : t("submitButton")}
      </Button>
    </form>
  );
}
