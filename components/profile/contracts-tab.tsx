"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Contract } from "@/lib/profile/mock-data"

export function ContractsTab({ contracts }: { contracts: Contract[] }) {
  const t = useTranslations("profile.contracts")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filtered = contracts.filter((c) => {
    if (statusFilter !== "all" && c.status !== statusFilter) return false
    return true
  })

  const statusStyles: Record<string, string> = {
    active: "bg-green-500/10 text-green-600 border-green-200",
    completed: "bg-blue-500/10 text-blue-600 border-blue-200",
    disputed: "bg-red-500/10 text-red-600 border-red-200",
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">
          {t("filterStatus")}:
        </span>
        {["all", "active", "completed", "disputed"].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatusFilter(s)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm transition-colors",
              statusFilter === s
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t(s)}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="space-y-2">
          {filtered.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between rounded-xl border border-border bg-background p-4"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{c.counterparty}</p>
                <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{c.type}</span>
                  <span>Rp {c.value.toLocaleString("id-ID")}</span>
                  <span>{c.date}</span>
                </div>
              </div>
              <Badge
                className={cn("ml-3 shrink-0 text-[11px]", statusStyles[c.status])}
              >
                {t(c.status)}
              </Badge>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">{t("noContracts")}</p>
      )}
    </div>
  )
}
