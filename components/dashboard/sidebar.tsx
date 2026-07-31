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

export function Sidebar({ role, isOpen = true, setIsOpen }: { role: "worker" | "employer", isOpen?: boolean, setIsOpen?: (v: boolean) => void }) {
  const t = useTranslations("dashboard.sidebar");
  const pathname = usePathname();
  const menuItems = getMenuItems(role);

  return (
    <aside className={cn(
      "sticky top-0 flex h-screen flex-col border-r border-slate-200 bg-slate-50/50 backdrop-blur-xl transition-all duration-300",
      isOpen ? "w-64" : "w-20 items-center"
    )}>
      <div className={cn("flex items-center border-b border-slate-200 py-5 transition-all duration-300", isOpen ? "gap-2.5 px-6" : "justify-center px-0")}>
        <div className="flex size-8 shrink-0 items-center justify-center rounded-[8px] bg-sky text-navy text-sm font-bold shadow-[0_0_15px_rgba(56,189,248,0.3)]">
          U
        </div>
        <span className={cn("font-heading text-lg font-bold text-navy whitespace-nowrap overflow-hidden transition-all duration-300", !isOpen && "w-0 opacity-0")}>Upahku</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-3">
        <div className="mb-6">
          <div className={cn("mb-3 px-3 transition-all duration-300", !isOpen && "hidden")}>
            <span className="text-[11px] font-bold tracking-widest text-slate-400 uppercase">
              {t("menuLabel")}
            </span>
          </div>
          <ul className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.href !== "#" && pathname === item.href;
              return (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    title={!isOpen ? t(`menu.${item.key}`) : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-xl py-2.5 text-sm transition-all duration-300",
                      isOpen ? "px-3" : "justify-center px-0",
                      isActive
                        ? "bg-sky/10 text-navy font-bold shadow-[0_0_15px_rgba(56,189,248,0.1)]"
                        : "font-medium text-slate-500 hover:bg-white hover:text-navy hover:shadow-sm",
                    )}
                  >
                    <Icon className={cn("size-4.5 shrink-0 transition-colors", isActive ? "text-sky" : "text-slate-400")} />
                    <span className={cn("flex-1 whitespace-nowrap overflow-hidden transition-all duration-300", !isOpen && "w-0 opacity-0 hidden")}>{t(`menu.${item.key}`)}</span>
                    {item.badge && isOpen && (
                      <Badge
                        variant="secondary"
                        className="h-5 min-w-5 px-1.5 text-[10px] font-bold bg-navy text-white hover:bg-navy"
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

      <div className={cn(
        "mx-4 mb-6 rounded-2xl bg-white border border-slate-100 p-5 shadow-sm relative overflow-hidden transition-all duration-300",
        !isOpen && "opacity-0 h-0 mb-0 p-0 border-none scale-0"
      )}>
        <div className="absolute -right-4 -top-4 size-20 rounded-full bg-sky/5 blur-xl" />
        <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-sky/10 border border-sky/20 shadow-[0_0_15px_rgba(56,189,248,0.1)] relative z-10">
          {role === "employer" ? (
            <Sparkles className="size-5 text-sky" />
          ) : (
            <Trophy className="size-5 text-sky" />
          )}
        </div>
        <p className="mb-1 text-sm font-bold text-navy relative z-10">
          {role === "employer"
            ? t("promo.employer.title")
            : t("promo.worker.title")}
        </p>
        <p className="mb-4 text-xs font-medium text-slate-500 relative z-10 leading-relaxed">
          {role === "employer"
            ? t("promo.employer.subtitle")
            : t("promo.worker.subtitle")}
        </p>
        <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs font-semibold rounded-full border-slate-200 text-navy hover:bg-slate-50 transition-colors relative z-10">
          {role === "employer"
            ? t("promo.employer.cta")
            : t("promo.worker.cta")}
          <ArrowRight className="size-3.5" />
        </Button>
      </div>
    </aside>
  );
}
