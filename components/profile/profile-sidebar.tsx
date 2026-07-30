"use client";

import { useTranslations } from "next-intl";
import {
  Star,
  MapPin,
  Calendar,
  Mail,
  Globe,
  ShieldCheck,
  BadgeCheck,
  CreditCard,
  Briefcase,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ProfileData } from "@/lib/profile/mock-data";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function ProfileSidebar({
  profile,
  sessionAvatarUrl,
  sessionName,
  userRole,
  totalSpending,
}: {
  profile: ProfileData;
  sessionAvatarUrl?: string;
  sessionName?: string;
  userRole?: "worker" | "employer";
  totalSpending?: number;
}) {
  const t = useTranslations("profile.sidebar");
  const displayName = sessionName ?? profile.name;
  const displayAvatar = sessionAvatarUrl ?? profile.avatarUrl;

  return (
    <div className="space-y-5 rounded-xl border border-border bg-background p-5">
      <div className="flex flex-col items-center text-center">
        {displayAvatar ? (
          <img
            src={displayAvatar}
            alt={displayName}
            className="mb-3 size-48 rounded-full object-cover"
          />
        ) : (
          <div className="mb-3 flex size-24 items-center justify-center rounded-full bg-primary/10 text-2xl font-semibold text-primary">
            {getInitials(displayName)}
          </div>
        )}
        <h2 className="text-lg font-semibold">{displayName}</h2>
        <p className="text-sm text-muted-foreground">{profile.role}</p>
        {profile.company && (
          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
            <Briefcase className="size-3" />
            {profile.company}
          </p>
        )}
      </div>

      <p className="text-center text-sm text-muted-foreground/60">
        {profile.bio || t("noBio")}
      </p>

      <div className="flex justify-around rounded-xl bg-surface-card py-3">
        {userRole === "employer" ? (
          <>
            <div className="text-center">
              <p className="text-lg font-semibold">{profile.activeListings}</p>
              <p className="text-xs text-muted-foreground">{t("jobsPosted")}</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold">{profile.completedJobs}</p>
              <p className="text-xs text-muted-foreground">{t("completedJobs")}</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold">
                {totalSpending !== undefined
                  ? `Rp ${(totalSpending / 1_000_000).toFixed(1)} Jt`
                  : "Rp 0"}
              </p>
              <p className="text-xs text-muted-foreground">{t("totalSpending")}</p>
            </div>
          </>
        ) : (
          <>
            <div className="text-center">
              <p className="text-lg font-semibold">{profile.completedJobs}</p>
              <p className="text-xs text-muted-foreground">{t("completedJobs")}</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold">{profile.activeListings}</p>
              <p className="text-xs text-muted-foreground">{t("activeListings")}</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold">{profile.rating.toFixed(1)}</p>
              <p className="text-xs text-muted-foreground">{t("rating")}</p>
            </div>
          </>
        )}
      </div>

      <div className="grid gap-2.5">
        {profile.location && profile.locationVisible !== false && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="size-4 shrink-0" />
            <span className="truncate">{profile.location}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="size-4 shrink-0" />
          <span className="truncate">
            {t("memberSince")}: {profile.memberSince}
          </span>
        </div>
        {profile.contact && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="size-4 shrink-0" />
            <span className="truncate">{profile.contact}</span>
          </div>
        )}
        {profile.website && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Globe className="size-4 shrink-0" />
            <span className="truncate">{profile.website}</span>
          </div>
        )}
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold tracking-wider text-muted-foreground">
          {t("verificationBadges")}
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={profile.verifications.idVerified ? "default" : "secondary"}
            className={cn(
              "gap-1",
              !profile.verifications.idVerified && "opacity-50",
            )}
          >
            <ShieldCheck className="size-3" />
            <span className="text-[11px]">{t("idVerified")}</span>
          </Badge>
          <Badge
            variant={
              profile.verifications.companyVerified ? "default" : "secondary"
            }
            className={cn(
              "gap-1",
              !profile.verifications.companyVerified && "opacity-50",
            )}
          >
            <BadgeCheck className="size-3" />
            <span className="text-[11px]">{t("companyVerified")}</span>
          </Badge>
          <Badge
            variant={
              profile.verifications.paymentVerified ? "default" : "secondary"
            }
            className={cn(
              "gap-1",
              !profile.verifications.paymentVerified && "opacity-50",
            )}
          >
            <CreditCard className="size-3" />
            <span className="text-[11px]">{t("paymentVerified")}</span>
          </Badge>
        </div>
      </div>
    </div>
  );
}
