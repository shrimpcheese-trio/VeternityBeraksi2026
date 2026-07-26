"use client"

import { useTranslations } from "next-intl"
import {
  CheckCircle,
  Clock,
  MessageSquare,
  Star,
  FileText,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import type { Listing, ChartData, ActivityGroup } from "@/lib/profile/mock-data"

const activityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  CheckCircle,
  MessageSquare,
  Star,
  FileText,
}

function ListingCard({ listing }: { listing: Listing }) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <div className="mb-2 flex items-start justify-between gap-2">
        <p className="font-medium text-sm">{listing.name}</p>
        <Badge
          variant={
            listing.status === "active"
              ? "default"
              : listing.status === "paused"
                ? "secondary"
                : "outline"
          }
          className="shrink-0 text-[11px]"
        >
          {listing.status}
        </Badge>
      </div>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <span
            className={cn(
              "size-1.5 rounded-full",
              listing.type === "Renovasi" && "bg-blue-500",
              listing.type === "Pemasangan" && "bg-green-500",
              listing.type === "Perbaikan" && "bg-orange-500",
              listing.type === "Servis" && "bg-purple-500",
              listing.type === "Fotografi" && "bg-pink-500"
            )}
          />
          {listing.type}
        </span>
        <span className="flex items-center gap-1">
          Rp {listing.price.toLocaleString("id-ID")}
        </span>
        {listing.quantity > 1 && (
          <span className="flex items-center gap-1">x{listing.quantity}</span>
        )}
      </div>
    </div>
  )
}

function BarChart({ data }: { data: ChartData[] }) {
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <div className="flex items-end gap-2">
      {data.map((d) => (
        <div key={d.month} className="flex flex-1 flex-col items-center gap-1">
          <span className="text-[11px] text-muted-foreground">{d.value}</span>
          <div
            className="w-full rounded-md bg-primary/20"
            style={{ height: `${(d.value / max) * 120}px` }}
          >
            <div
              className="w-full rounded-md bg-primary transition-all"
              style={{ height: `${(d.value / max) * 100}%` }}
            />
          </div>
          <span className="text-[11px] text-muted-foreground">{d.month}</span>
        </div>
      ))}
    </div>
  )
}

export function OverviewTab({
  listings,
  chartData,
  activity,
}: {
  listings: Listing[]
  chartData: ChartData[]
  activity: ActivityGroup[]
}) {
  const t = useTranslations("profile.overview")
  const activeListings = listings.filter((l) => l.status === "active")

  return (
    <div className="space-y-8">
      <section>
        <h3 className="mb-3 text-sm font-semibold">{t("pinnedListings")}</h3>
        {activeListings.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {activeListings.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{t("noListings")}</p>
        )}
      </section>

      <section>
        <h3 className="mb-3 text-sm font-semibold">{t("activityChart")}</h3>
        <div className="rounded-xl border border-border bg-background p-5">
          <BarChart data={chartData} />
          <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-sm bg-primary" /> Tinggi
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-sm bg-primary/60" /> Sedang
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-sm bg-primary/20" /> Rendah
            </span>
          </div>
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-sm font-semibold">{t("recentActivity")}</h3>
        {activity.length > 0 ? (
          <div className="space-y-5">
            {activity.map((group) => (
              <div key={group.label}>
                <p className="mb-2 text-xs font-medium text-muted-foreground">
                  {group.label}
                </p>
                <div className="space-y-2">
                  {group.entries.map((entry, i) => {
                    const Icon = activityIcons[entry.icon] || FileText
                    return (
                      <div
                        key={i}
                        className="flex items-start gap-3 rounded-xl bg-background p-3"
                      >
                        <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                          <Icon className="size-4 text-muted-foreground" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm">{entry.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {entry.timestamp}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{t("noActivity")}</p>
        )}
      </section>
    </div>
  )
}
