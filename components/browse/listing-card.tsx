"use client";

import { useState } from "react";
import { Heart, MoreHorizontal } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import type { BrowseListing } from "@/lib/browse/mock-data";

const statusConfig: Record<
  BrowseListing["status"],
  { key: string; dot: string }
> = {
  tersedia: { key: "statusAvailable", dot: "bg-green-500" },
  dalam_proyek: { key: "statusInProgress", dot: "bg-amber-500" },
  segera: { key: "statusSoon", dot: "bg-blue-500" },
};

export function ListingCard({ listing }: { listing: BrowseListing }) {
  const t = useTranslations("browse");
  const locale = useLocale();
  const [liked, setLiked] = useState(listing.isFavorite);
  const cfg = statusConfig[listing.status];

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card">
      <div className="relative aspect-[4/3] bg-surface-soft">
        <div className="absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[0.625rem] font-semibold uppercase tracking-wider text-ink shadow-sm backdrop-blur-sm">
          <span className={`size-1.5 rounded-full ${cfg.dot}`} />
          {t(cfg.key)}
        </div>
        <button
          type="button"
          onClick={() => setLiked(!liked)}
          className="absolute right-3 top-3 z-10 flex size-10 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm"
        >
          <Heart
            size={16}
            className={liked ? "fill-red-500 text-red-500" : "text-muted-foreground"}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-semibold">{listing.title}</h3>
            <p className="text-xs text-muted-foreground">{listing.code}</p>
          </div>
          <button type="button" className="text-muted-foreground">
            <MoreHorizontal size={18} />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 rounded-lg bg-surface-soft px-2 py-2 sm:gap-3 sm:px-3 sm:py-2.5">
          <div>
            <p className="text-[0.625rem] font-medium uppercase tracking-wider text-muted-foreground">
              {t("completedProjects")}
            </p>
            <p className="text-sm font-semibold">
              {listing.projectCount.toLocaleString(locale)}
            </p>
          </div>
          <div>
            <p className="text-[0.625rem] font-medium uppercase tracking-wider text-muted-foreground">
              {t("startingPrice")}
            </p>
            <p className="text-sm font-semibold">
              Rp {(listing.price / 1000).toLocaleString(locale)} rb
            </p>
          </div>
        </div>

        <div className="mt-4 border-t border-border pt-3">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary uppercase">
              {listing.workerName.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-medium">{listing.workerName}</p>
              <p className="text-xs text-muted-foreground">
                {listing.workerRole}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
