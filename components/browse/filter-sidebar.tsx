"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";

function SelectDropdown({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-lg border border-border bg-background px-3 py-3 text-sm outline-none"
      >
        {value}
        <ChevronDown
          size={16}
          className={`text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-20 mt-1 w-full rounded-lg border border-border bg-popover p-1 shadow-md">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={`flex w-full rounded-md px-3 py-2 text-left text-sm ${
                opt === value
                  ? "bg-surface-soft font-medium text-foreground"
                  : "text-muted-foreground hover:bg-surface-soft hover:text-foreground"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const SORT_OPTIONS = [
  { label: "Default", value: "" },
  { label: "Pengalaman", value: "experience" },
  { label: "Skor Kepercayaan", value: "trust_score" },
  { label: "Jumlah Proyek", value: "projects" },
];

export function FilterSidebar({ currentSort, baseUrl }: { currentSort: string; baseUrl: string }) {
  const t = useTranslations("browse");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${baseUrl}?${params.toString()}`);
  }

  function reset() {
    router.push(baseUrl);
  }

  const currentSortLabel = SORT_OPTIONS.find((o) => o.value === currentSort)?.label ?? "Default";

  const panel = (
    <div className="rounded-xl border border-border bg-surface-soft p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">{t("filter")}</h2>
        <button
          type="button"
          onClick={reset}
          className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
        >
          {t("resetFilter")}
        </button>
      </div>

      <div className="mt-6 space-y-6">
        <fieldset>
          <legend className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Urutkan
          </legend>
          <SelectDropdown
            options={SORT_OPTIONS.map((o) => o.label)}
            value={currentSortLabel}
            onChange={(label) => {
              const opt = SORT_OPTIONS.find((o) => o.label === label);
              setParam("sort", opt?.value ?? "");
            }}
          />
        </fieldset>

        <fieldset>
          <legend className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Kota
          </legend>
          <input
            type="text"
            defaultValue={searchParams.get("city") ?? ""}
            placeholder="Cari kota..."
            onBlur={(e) => {
              const val = e.currentTarget.value.trim();
              setParam("city", val);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const val = e.currentTarget.value.trim();
                setParam("city", val);
              }
            }}
            className="w-full rounded-lg border border-border bg-background px-3 py-3 text-sm outline-none placeholder:text-muted-soft focus:ring-1 focus:ring-primary"
          />
        </fieldset>

        <fieldset>
          <legend className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {t("specLabel")}
          </legend>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">
                {t("experienceLabel")}
              </label>
              <SelectDropdown
                options={t.raw("experienceOptions") as string[]}
                value={(t.raw("experienceOptions") as string[])[0]}
                onChange={() => {
                  setParam("sort", "experience");
                }}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-muted-foreground">
                {t("projectCountLabel")}
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder={t("min")}
                  className="w-full rounded-lg border border-border bg-background px-3 py-3 text-sm outline-none placeholder:text-muted-soft focus:ring-1 focus:ring-primary"
                />
                <input
                  type="number"
                  placeholder={t("max")}
                  className="w-full rounded-lg border border-border bg-background px-3 py-3 text-sm outline-none placeholder:text-muted-soft focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs text-muted-foreground">
                {t("priceLabel")}
              </label>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder={t("priceMin")}
                  className="w-full rounded-lg border border-border bg-background px-3 py-3 text-sm outline-none placeholder:text-muted-soft focus:ring-1 focus:ring-primary"
                />
                <input
                  type="text"
                  placeholder={t("priceMax")}
                  className="w-full rounded-lg border border-border bg-background px-3 py-3 text-sm outline-none placeholder:text-muted-soft focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </div>
        </fieldset>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setDrawerOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface-soft px-4 py-3 text-sm font-medium text-foreground md:hidden"
      >
        <SlidersHorizontal size={16} />
        {t("filter")}
      </button>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute left-0 top-0 flex h-full w-80 max-w-[85vw] flex-col overflow-y-auto border-r border-border bg-background shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <span className="text-sm font-semibold">{t("filter")}</span>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 px-5 py-5">{panel}</div>
          </div>
        </div>
      )}

      <aside className="hidden shrink-0 md:block md:w-72">
        {panel}
      </aside>
    </>
  );
}
