"use client"

import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"

const sections = [
  "account",
  "company",
  "verification",
  "payment",
  "notifications",
  "security",
  "dangerZone",
] as const

export function SettingsSidebar({
  activeSection,
  onSectionClick,
}: {
  activeSection: string
  onSectionClick: (id: string) => void
}) {
  const t = useTranslations("settings.sidebar")

  return (
    <div className="space-y-1">
      {sections.map((id) => (
        <button
          key={id}
          type="button"
          onClick={() => onSectionClick(id)}
          className={cn(
            "flex w-full items-center rounded-xl px-4 py-2.5 text-left text-sm font-medium transition-colors",
            activeSection === id
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          {t(id)}
        </button>
      ))}
    </div>
  )
}
