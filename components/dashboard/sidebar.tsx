"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Search,
  Briefcase,
  Package,
  Trophy,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type MenuItem = {
  key: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: string;
};

function getMenuItems(role: "worker" | "employer"): MenuItem[] {
  const items: MenuItem[] = [
    { key: "dashboard", icon: LayoutDashboard, href: `/${role}/dashboard` },
    { key: "browse", icon: Search, href: "/browse" },
  ];

  items.push({
    key: "jobs",
    icon: Briefcase,
    href: `/${role === "worker" ? "worker" : "employer"}/agreements`,
  });

  if (role === "worker") {
    items.push({
      key: "services",
      icon: Package,
      href: "/worker/services",
    });
  }

  items.push(
    { key: "calendar", icon: Calendar, href: `/${role}/calendar` },
  );

  return items;
}

export function Sidebar({ role }: { role: "worker" | "employer" }) {
  const t = useTranslations("dashboard.sidebar");
  const pathname = usePathname();
  const menuItems = getMenuItems(role);

  return (
    <aside className="sticky top-0 flex h-screen w-64 flex-col border-r border-border bg-background">
      <div className="flex items-center gap-2.5 border-b border-border px-6 py-5">
        <span className="font-heading text-base font-medium">Upahku</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="mb-6">
          <span className="px-2 text-[11px] font-semibold tracking-widest text-muted-foreground">
            {t("menuLabel")}
          </span>
          <ul className="mt-2 space-y-0.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.href !== "#" && pathname === item.href;
              return (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <Icon className="size-4 shrink-0" />
                    <span className="flex-1">{t(`menu.${item.key}`)}</span>
                    {item.badge && (
                      <Badge
                        variant="secondary"
                        className="h-5 min-w-5 px-1 text-[11px]"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      <div className="mx-3 mb-4 rounded-2xl bg-surface-card p-4">
        <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-primary/10">
          {role === "employer" ? (
            <Sparkles className="size-5 text-primary" />
          ) : (
            <Trophy className="size-5 text-primary" />
          )}
        </div>
        <p className="mb-0.5 text-sm font-semibold">
          {role === "employer"
            ? t("promo.employer.title")
            : t("promo.worker.title")}
        </p>
        <p className="mb-3 text-xs text-muted-foreground">
          {role === "employer"
            ? t("promo.employer.subtitle")
            : t("promo.worker.subtitle")}
        </p>
        <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs">
          {role === "employer"
            ? t("promo.employer.cta")
            : t("promo.worker.cta")}
          <ArrowRight className="size-3.5" />
        </Button>
      </div>
    </aside>
  );
}
