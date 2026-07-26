"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Search, ChevronDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Listing } from "@/lib/profile/mock-data"

export function ListingsTab({ listings }: { listings: Listing[] }) {
  const t = useTranslations("profile.listings")
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filtered = listings.filter((l) => {
    if (statusFilter !== "all" && l.status !== statusFilter) return false
    if (search && !l.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const statusStyles: Record<string, string> = {
    active: "bg-green-500/10 text-green-600 border-green-200",
    paused: "bg-amber-500/10 text-amber-600 border-amber-200",
    completed: "bg-muted text-muted-foreground border-border",
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex flex-1 items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
          <Search className="size-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("search")}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-soft"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="flex items-center gap-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
        >
          <option value="all">{t("all")}</option>
          <option value="active">{t("active")}</option>
          <option value="paused">{t("paused")}</option>
          <option value="completed">{t("completed")}</option>
        </select>
      </div>

      {filtered.length > 0 ? (
        <div className="space-y-2">
          {filtered.map((l) => (
            <div
              key={l.id}
              className="flex items-center justify-between rounded-xl border border-border bg-background p-4"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{l.name}</p>
                <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                  <span>Rp {l.price.toLocaleString("id-ID")}</span>
                  <span>x{l.quantity}</span>
                  <span>{l.datePosted}</span>
                </div>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {l.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <Badge
                className={cn("ml-3 shrink-0 text-[11px]", statusStyles[l.status])}
              >
                {t(l.status)}
              </Badge>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">{t("noListings")}</p>
      )}
    </div>
  )
}
