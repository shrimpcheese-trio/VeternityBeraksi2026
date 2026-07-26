"use client"

import { cn } from "@/lib/utils"

export function Switch({
  checked,
  onCheckedChange,
  id,
}: {
  checked: boolean
  onCheckedChange: (v: boolean) => void
  id?: string
}) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-10 shrink-0 cursor-pointer items-center rounded-full transition-colors",
        checked ? "bg-primary" : "bg-input"
      )}
    >
      <span
        className={cn(
          "inline-block size-4 rounded-full bg-white transition-transform",
          checked ? "translate-x-5" : "translate-x-1"
        )}
      />
    </button>
  )
}
