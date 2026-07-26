"use client"

import { useTranslations } from "next-intl"
import { FileText, ShieldCheck, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Document } from "@/lib/profile/mock-data"

export function DocumentsTab({ documents }: { documents: Document[] }) {
  const t = useTranslations("profile.documents")

  return (
    <div className="space-y-4">
      {documents.length > 0 ? (
        <div className="space-y-2">
          {documents.map((d) => (
            <div
              key={d.id}
              className="flex items-center justify-between rounded-xl border border-border bg-background p-4"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                  <FileText className="size-4 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium">{d.name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{d.type}</span>
                    <span>·</span>
                    <span>{d.uploadDate}</span>
                  </div>
                </div>
              </div>
              <Badge
                variant={d.verified ? "default" : "secondary"}
                className="ml-3 shrink-0 gap-1 text-[11px]"
              >
                {d.verified ? (
                  <ShieldCheck className="size-3" />
                ) : (
                  <Clock className="size-3" />
                )}
                {d.verified ? t("verified") : t("unverified")}
              </Badge>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">{t("noDocuments")}</p>
      )}
    </div>
  )
}
