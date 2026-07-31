"use client"

import { useTranslations } from "next-intl"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Review } from "@/lib/profile/mock-data"

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function RatingBar({ stars, count, total }: { stars: number; count: number; total: number }) {
  const pct = total > 0 ? (count / total) * 100 : 0
  return (
    <div className="flex items-center gap-2">
      <span className="w-8 text-right text-xs text-muted-foreground">{stars}</span>
      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
        <div className="h-full rounded-full bg-amber-400" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-6 text-xs text-muted-foreground">{count}</span>
    </div>
  )
}

function RatingBreakdown({ reviews }: { reviews: Review[] }) {
  const total = reviews.length
  const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  for (const r of reviews) counts[r.rating] = (counts[r.rating] ?? 0) + 1

  return (
    <div className="space-y-1">
      {[5, 4, 3, 2, 1].map((s) => (
        <RatingBar key={s} stars={s} count={counts[s] ?? 0} total={total} />
      ))}
    </div>
  )
}

export function ReviewsTab({
  reviews,
  direction = "received",
}: {
  reviews: Review[]
  direction?: "received" | "given"
}) {
  const t = useTranslations("profile.reviews")

  const avg =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0

  return (
    <div className="space-y-6">
      {direction === "received" ? (
        <div className="flex items-start gap-8 rounded-xl border border-border bg-background p-5">
          <div className="text-center">
            <p className="text-3xl font-bold">{avg.toFixed(1)}</p>
            <div className="mt-1 flex items-center justify-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "size-4",
                    i < Math.round(avg)
                      ? "fill-amber-400 text-amber-400"
                      : "text-muted-soft"
                  )}
                />
              ))}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {reviews.length} {t("totalReviews")}
            </p>
          </div>
          <div className="flex-1">
            <RatingBreakdown reviews={reviews} />
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-muted-foreground">
            {t("givenTitle")}
          </p>
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1.5 text-[11px] text-muted-foreground">
            {reviews.length}
          </span>
        </div>
      )}

      {reviews.length > 0 ? (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="rounded-xl border border-border bg-background p-4"
            >
              <div className="flex items-start gap-3">
                {r.reviewerAvatar ? (
                  <img
                    src={r.reviewerAvatar}
                    alt={r.reviewerName}
                    className="size-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {getInitials(r.reviewerName)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{r.reviewerName}</p>
                    <span className="text-xs text-muted-foreground">
                      {r.date}
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "size-3",
                          i < r.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-soft"
                        )}
                      />
                    ))}
                  </div>
                  {r.service && (
                    <span className="mt-1.5 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                      {r.service}
                    </span>
                  )}
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    {r.comment}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">{t("noReviews")}</p>
      )}
    </div>
  )
}
