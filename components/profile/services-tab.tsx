"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { PackageOpen, Settings2 } from "lucide-react"
import type { WorkerServiceRow } from "@/lib/services/profile"

const PRICE_UNIT_KEYS: Record<string, string> = {
  fixed: "priceUnitFixed",
  hourly: "priceUnitHourly",
  daily: "priceUnitDaily",
}

function galleryImages(service: WorkerServiceRow): string[] {
  if (!Array.isArray(service.image_urls)) return []
  return service.image_urls.filter((url): url is string => typeof url === "string")
}

export function ServicesTab({
  services,
  isOwn,
}: {
  services: WorkerServiceRow[]
  isOwn: boolean
}) {
  const t = useTranslations("profile.services")

  if (services.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
        <PackageOpen className="mb-4 size-12 text-muted-foreground/40" />
        <p className="text-sm font-medium text-muted-foreground">{t("emptyTitle")}</p>
        <p className="mt-1 text-xs text-muted-foreground">{t("emptyDescription")}</p>
        {isOwn && (
          <Link
            href="/worker/services"
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Settings2 className="size-4" />
            {t("manageServices")}
          </Link>
        )}
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => {
          const thumbnail = service.thumbnail_url
          const images = galleryImages(service)
          return (
            <div
              key={service.service_id}
              className="flex flex-col overflow-hidden rounded-xl border border-border bg-background"
            >
              {thumbnail && (
                <div className="aspect-[4/3] bg-surface-soft">
                  <img
                    src={thumbnail}
                    alt={service.name}
                    className="size-full object-cover"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold">{service.name}</h3>
                  {service.category && (
                    <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                      {service.category}
                    </span>
                  )}
                </div>
                {service.description && (
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                    {service.description}
                  </p>
                )}
                <div className="mt-3 flex items-baseline gap-1 border-t border-border pt-3">
                  <span className="text-sm font-semibold text-primary">
                    {t("price", { price: service.price.toLocaleString("id-ID") })}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    / {t(PRICE_UNIT_KEYS[service.price_unit] ?? "priceUnitFixed")}
                  </span>
                </div>
                {images.length > 0 && (
                  <div className="mt-3 flex gap-2">
                    {images.slice(0, 4).map((url) => (
                      <div
                        key={url}
                        className="size-10 overflow-hidden rounded-md bg-surface-soft"
                      >
                        <img src={url} alt="" className="size-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
      {isOwn && (
        <Link
          href="/worker/services"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/90"
        >
          <Settings2 className="size-4" />
          {t("manageServices")}
        </Link>
      )}
    </div>
  )
}
