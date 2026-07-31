"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import type { ListingResult } from "@/lib/services/listings";

const statusConfig: Record<
  ListingResult["status"],
  { key: string; dot: string }
> = {
  tersedia: { key: "statusAvailable", dot: "bg-sky" },
  dalam_proyek: { key: "statusInProgress", dot: "bg-navy" },
  segera: { key: "statusSoon", dot: "bg-sky-active" },
};

export function ListingCard({ listing }: { listing: ListingResult }) {
  const t = useTranslations("browse");
  const locale = useLocale();
  const router = useRouter();
  const [liked, setLiked] = useState(listing.isFavorite);
  const cfg = statusConfig[listing.status];

  return (
    <div
      className="flex flex-col overflow-hidden rounded-xl border border-border bg-card cursor-pointer transition-shadow hover:shadow-md"
      onClick={() => router.push(`/browse/${listing.id}?service=${listing.serviceId}`)}
    >
      <div className="relative aspect-[4/3] bg-bg-alt">
        {listing.imageUrl ? (
          <img
            src={listing.imageUrl}
            alt={listing.title}
            className="size-full object-cover"
          />
        ) : null}
        <div className="absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[0.625rem] font-semibold uppercase tracking-wider text-navy shadow-sm backdrop-blur-sm">
          <span className={`size-1.5 rounded-full ${cfg.dot}`} />
          {t(cfg.key)}
        </div>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
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
          <span className="rounded-full bg-sky/10 px-2 py-0.5 text-[10px] font-medium text-sky-active">
            {listing.trustScore.toFixed(1)}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 rounded-lg bg-bg-alt px-2 py-2 sm:gap-3 sm:px-3 sm:py-2.5">
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
