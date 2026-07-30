import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

type Option = { value: string; label: string }

export function Select({
  name,
  options,
  value,
  onValueChange,
  placeholder,
  className,
}: {
  name?: string
  options: Option[]
  value: string
  onValueChange: (v: string) => void
  placeholder?: string
  className?: string
}) {
  return (
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className={cn(
          "h-9 w-full min-w-0 appearance-none rounded-3xl border border-border bg-input/50 px-3 py-1 pr-8 text-sm outline-none transition-[color,box-shadow,background-color] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30",
          !value && "text-muted-foreground",
          className
        )}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  )
}
