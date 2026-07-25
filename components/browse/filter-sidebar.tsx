"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

const experienceOptions = ["0–1 tahun", "1–3 tahun", "3–5 tahun", "5+ tahun"];

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

export function FilterSidebar() {
  const t = useTranslations("browse");
  const statusOptions = t.raw("statusOptions") as string[];
  const expOptions = t.raw("experienceOptions") as string[];
  const [status, setStatus] = useState(statusOptions[0]);
  const [experience, setExperience] = useState(expOptions[0]);

  return (
    <aside className="w-full shrink-0 md:w-72">
      <div className="rounded-xl border border-border bg-surface-soft p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">{t("filter")}</h2>
          <button
            type="button"
            className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
          >
            {t("resetFilter")}
          </button>
        </div>

        <div className="mt-6 space-y-6">
          <fieldset>
            <legend className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {t("statusLabel")}
            </legend>
            <div className="space-y-2">
              {statusOptions.map((opt) => (
                <label
                  key={opt}
                  className="flex cursor-pointer items-center gap-2 text-sm"
                >
                  <input
                    type="radio"
                    name="status"
                    checked={status === opt}
                    onChange={() => setStatus(opt)}
                    className="size-4 accent-primary"
                  />
                  {opt}
                </label>
              ))}
            </div>
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
                  options={expOptions}
                  value={experience}
                  onChange={setExperience}
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
    </aside>
  );
}

