"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import Link from "next/link";
import {
  Search,
  Bell,
  HelpCircle,
  ChevronDown,
  User,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
} from "lucide-react";
import { setCookie } from "@/lib/cookie";
import { signOut } from "@/lib/actions/auth";

const locales = [
  { code: "id", label: "ID", name: "Indonesia" },
  { code: "en", label: "EN", name: "English" },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function TopHeader({
  userName,
  userEmail,
  avatarUrl,
  onToggleSidebar,
}: {
  userName: string;
  userEmail: string;
  avatarUrl?: string;
  onToggleSidebar?: () => void;
}) {
  const t = useTranslations("dashboard.header");
  const locale = useLocale();
  const [localeOpen, setLocaleOpen] = useState(false);
  const localeRef = useRef<HTMLDivElement>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (localeRef.current && !localeRef.current.contains(e.target as Node)) {
        setLocaleOpen(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function switchLocale(next: string) {
    setCookie("locale", next, 365);
    window.location.reload();
  }

  return (
    <header className="sticky top-0 z-40 flex h-20 items-center border-b border-slate-200 bg-white/80 backdrop-blur-xl px-4 md:px-8 gap-4">
      {onToggleSidebar && (
        <button
          onClick={onToggleSidebar}
          className="flex size-10 shrink-0 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-navy transition-colors"
        >
          <Menu className="size-5" />
        </button>
      )}

      <div className="flex max-w-md flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 shadow-sm transition-all focus-within:bg-white focus-within:border-sky focus-within:ring-4 focus-within:ring-sky/10">
        <Search className="size-4.5 shrink-0 text-slate-400" />
        <input
          type="text"
          placeholder={t("searchPlaceholder")}
          className="flex-1 bg-transparent text-sm font-medium text-navy outline-none placeholder:text-slate-400 min-w-0"
        />
        <kbd className="hidden shrink-0 rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest shadow-sm sm:block">
          ⌘K
        </kbd>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-3">
        <div ref={localeRef} className="relative">
          <button
            type="button"
            onClick={() => setLocaleOpen(!localeOpen)}
            className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            {locale === "id" ? "ID" : "EN"}
            <ChevronDown className="size-3" />
          </button>
          {localeOpen && (
            <div className="absolute right-0 top-full mt-2 w-36 rounded-lg border border-border bg-popover p-1 shadow-md">
              {locales.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => switchLocale(l.code)}
                  className={`flex w-full items-center rounded-md px-3 py-2 text-left text-sm ${
                    locale === l.code
                      ? "bg-surface-soft font-medium text-foreground"
                      : "text-muted-foreground hover:bg-surface-soft hover:text-foreground"
                  }`}
                >
                  <span className="mr-2">{l.label}</span>
                  <span className="text-muted-soft">{l.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          className="relative flex size-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <Bell className="size-4" />
          <span className="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
            3
          </span>
        </button>

        <button
          type="button"
          className="flex size-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <HelpCircle className="size-4" />
        </button>

        <div ref={profileRef} className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-3 border-l border-border pl-3"
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={userName}
                className="size-8 rounded-full object-cover"
              />
            ) : (
              <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {getInitials(userName)}
              </div>
            )}
            <ChevronDown className="size-3 text-muted-foreground" />
          </button>
          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-border bg-popover p-1 shadow-md">
              <div className="border-b border-border px-3 py-2.5">
                <p className="truncate text-sm font-medium">{userName}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {userEmail}
                </p>
              </div>
              <Link
                href="/profile"
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-muted-foreground hover:bg-surface-soft hover:text-foreground"
              >
                <User className="size-4" />
                View Profile
              </Link>
              <Link
                href="/settings"
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-muted-foreground hover:bg-surface-soft hover:text-foreground"
              >
                <Settings className="size-4" />
                Settings
              </Link>
              <div className="my-1 border-t border-border" />
              <button
                type="button"
                onClick={async () => {
                  await signOut();
                }}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-muted-foreground hover:bg-surface-soft hover:text-foreground"
              >
                <LogOut className="size-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
