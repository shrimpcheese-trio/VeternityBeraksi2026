"use client"

import { useTranslations } from "next-intl"
import {
  CheckCircle,
  Clock,
  MessageSquare,
  Star,
  FileText,
  Building2,
  MapPin,
  Calendar,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import type { ProfileData, Listing, ChartData, ActivityGroup } from "@/lib/profile/mock-data"

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
  userRole,
  profile,
  recentAgreements,
}: {
  listings: Listing[]
  chartData: ChartData[]
  activity: ActivityGroup[]
  userRole?: "worker" | "employer"
  profile?: ProfileData
  recentAgreements?: Array<{ job_description: string | null; price: number | null; status: string; created_at: string }>
}) {
  const t = useTranslations("profile.overview")
  const activeListings = listings.filter((l) => l.status === "active")

  if (userRole === "employer") {
    const totalJobs = profile?.activeListings ?? 0
    const completedJobs = profile?.completedJobs ?? 0
    const totalSpending = recentAgreements?.reduce((sum, a) => sum + (a.price ?? 0), 0) ?? 0

    return (
      <div className="space-y-8">
        <section>
          <h3 className="mb-3 text-sm font-semibold">Informasi Perusahaan</h3>
          <div className="rounded-xl border border-border bg-background p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <Building2 className="size-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{profile?.company || profile?.name}</p>
                <p className="text-xs text-muted-foreground">Pemberi Kerja</p>
              </div>
            </div>
            {profile?.location && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="size-4" />
                <span>{profile.location}</span>
              </div>
            )}
            {profile?.memberSince && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="size-4" />
                <span>Bergabung {profile.memberSince}</span>
              </div>
            )}
          </div>
        </section>

        <section>
          <h3 className="mb-3 text-sm font-semibold">Ringkasan Pekerjaan</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-border bg-background p-4 text-center">
              <p className="text-2xl font-semibold">{totalJobs}</p>
              <p className="text-xs text-muted-foreground">Dipasang</p>
            </div>
            <div className="rounded-xl border border-border bg-background p-4 text-center">
              <p className="text-2xl font-semibold">{completedJobs}</p>
              <p className="text-xs text-muted-foreground">Selesai</p>
            </div>
            <div className="rounded-xl border border-border bg-background p-4 text-center">
              <p className="text-2xl font-semibold">Rp {(totalSpending / 1_000_000).toFixed(1)} Jt</p>
              <p className="text-xs text-muted-foreground">Pengeluaran</p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="mb-3 text-sm font-semibold">Pekerjaan Terbaru</h3>
          {recentAgreements && recentAgreements.length > 0 ? (
            <div className="space-y-2">
              {recentAgreements.slice(0, 5).map((a, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl border border-border bg-background p-4">
                  <div>
                    <p className="text-sm font-medium">{a.job_description || "Pekerjaan"}</p>
                    <p className="text-xs text-muted-foreground">
                      {a.price ? `Rp ${a.price.toLocaleString("id-ID")}` : "-"}
                      {" · "}
                      {new Date(a.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <Badge
                    variant={
                      a.status === "completed" ? "default"
                      : a.status === "active" ? "secondary"
                      : a.status === "disputed" ? "destructive"
                      : "outline"
                    }
                    className="text-[11px]"
                  >
                    {a.status === "draft" ? "Penawaran"
                      : a.status === "active" ? "Aktif"
                      : a.status === "completed" ? "Selesai"
                      : a.status === "disputed" ? "Sengketa"
                      : a.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Belum ada pekerjaan.</p>
          )}
        </section>
      </div>
    )
  }

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
