"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import type { ProfileData, Review, ChartData, ActivityGroup } from "@/lib/profile/mock-data"
import type { WorkerServiceRow } from "@/lib/services/profile"
import { OverviewTab } from "@/components/profile/overview-tab"
import { ServicesTab } from "@/components/profile/services-tab"
import { ReviewsTab } from "@/components/profile/reviews-tab"

type TabId = "overview" | "services" | "reviews"

export function ProfileTabs({
  profile,
  services,
  reviews,
  chartData,
  activity,
  isOwn,
  userRole,
  recentAgreements,
}: {
  profile: ProfileData
  services: WorkerServiceRow[]
  reviews: Review[]
  chartData: ChartData[]
  activity: ActivityGroup[]
  isOwn: boolean
  userRole?: "worker" | "employer"
  recentAgreements?: Array<{ job_description: string | null; price: number | null; status: string; created_at: string }>
}) {
  const t = useTranslations("profile.tabs")
  const [activeTab, setActiveTab] = useState<TabId>("overview")

  const isEmployer = userRole === "employer"

  const tabs: { id: TabId; label: string; count?: number }[] = isEmployer
    ? [
        { id: "overview", label: t("overview") },
        { id: "reviews", label: t("reviews"), count: reviews.length },
      ]
    : [
        { id: "overview", label: t("overview") },
        { id: "services", label: t("services"), count: services.length },
        { id: "reviews", label: t("reviews"), count: reviews.length },
      ]

  return (
    <div>
      <div className="mb-6 flex border-b border-border">
        {tabs.map((tb) => (
          <button
            key={tb.id}
            type="button"
            onClick={() => setActiveTab(tb.id)}
            className={cn(
              "relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors",
              activeTab === tb.id
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tb.label}
            {tb.count !== undefined && (
              <span
                className={cn(
                  "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px]",
                  activeTab === tb.id
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {tb.count}
              </span>
            )}
            {activeTab === tb.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <OverviewTab
          chartData={chartData}
          activity={activity}
          userRole={userRole}
          profile={profile}
          recentAgreements={recentAgreements}
        />
      )}
      {activeTab === "services" && <ServicesTab services={services} isOwn={isOwn} />}
      {activeTab === "reviews" && (
        <ReviewsTab
          reviews={reviews}
          direction={userRole === "employer" ? "given" : "received"}
        />
      )}
    </div>
  )
}
