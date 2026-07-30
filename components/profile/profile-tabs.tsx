"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import type { ProfileData, Listing, Contract, Review, Document, ChartData, ActivityGroup } from "@/lib/profile/mock-data"
import { OverviewTab } from "@/components/profile/overview-tab"
import { ListingsTab } from "@/components/profile/listings-tab"
import { ContractsTab } from "@/components/profile/contracts-tab"
import { ReviewsTab } from "@/components/profile/reviews-tab"
import { DocumentsTab } from "@/components/profile/documents-tab"

type TabId = "overview" | "listings" | "contracts" | "reviews" | "documents"

export function ProfileTabs({
  profile,
  listings,
  contracts,
  reviews,
  documents,
  chartData,
  activity,
  isOwn,
  userRole,
  recentAgreements,
}: {
  profile: ProfileData
  listings: Listing[]
  contracts: Contract[]
  reviews: Review[]
  documents: Document[]
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
        { id: "listings", label: t("listings"), count: listings.length },
        { id: "reviews", label: t("reviews"), count: reviews.length },
      ]
    : [
        { id: "overview", label: t("overview") },
        { id: "listings", label: t("listings"), count: listings.length },
        { id: "contracts", label: t("contracts"), count: contracts.length },
        { id: "reviews", label: t("reviews"), count: reviews.length },
        { id: "documents", label: t("documents"), count: documents.length },
      ]

  const visibleTabs = isOwn ? tabs : tabs.filter((tb) => tb.id !== "contracts")

  return (
    <div>
      <div className="mb-6 flex border-b border-border">
        {visibleTabs.map((tb) => (
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
          listings={listings}
          chartData={chartData}
          activity={activity}
          userRole={userRole}
          profile={profile}
          recentAgreements={recentAgreements}
        />
      )}
      {activeTab === "listings" && <ListingsTab listings={listings} />}
      {activeTab === "contracts" && <ContractsTab contracts={contracts} />}
      {activeTab === "reviews" && <ReviewsTab reviews={reviews} />}
      {activeTab === "documents" && <DocumentsTab documents={documents} />}
    </div>
  )
}
