import { TrendingUp, TrendingDown, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

export function KpiCard({
  label,
  value,
  trendDirection,
  trendText,
  variant = "default",
}: {
  label: string
  value: string
  trendDirection: "up" | "down"
  trendText: string
  variant?: "default" | "highlighted"
}) {
  const TrendIcon = trendDirection === "up" ? TrendingUp : TrendingDown
  const isHighlighted = variant === "highlighted"

  return (
    <div
      className={cn(
        "group flex flex-col gap-2 rounded-[24px] p-6 transition-all duration-300 relative overflow-hidden",
        isHighlighted
          ? "bg-navy text-white shadow-[0_10px_40px_-10px_rgba(10,37,64,0.4)]"
          : "bg-white text-navy border border-slate-100 shadow-sm hover:shadow-md"
      )}
    >
      {isHighlighted && (
        <>
          <div className="absolute -right-6 -top-6 size-32 rounded-full bg-sky/20 blur-2xl transition-transform duration-500 group-hover:scale-150" />
          <div className="absolute -left-6 -bottom-6 size-32 rounded-full bg-teal-500/10 blur-2xl transition-transform duration-500 group-hover:scale-150" />
        </>
      )}

      <div className="flex items-center justify-between relative z-10">
        <span
          className={cn(
            "text-sm font-bold tracking-wide uppercase",
            isHighlighted ? "text-sky" : "text-slate-400"
          )}
        >
          {label}
        </span>
        <ExternalLink
          className={cn(
            "size-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1",
            isHighlighted ? "text-white/40" : "text-slate-300"
          )}
        />
      </div>

      <span
        className={cn(
          "font-heading text-3xl font-bold tracking-tight mt-1 relative z-10",
          isHighlighted && "text-white"
        )}
      >
        {value}
      </span>

      <div className="flex items-center gap-2 mt-1 relative z-10">
        <div className={cn(
          "flex items-center justify-center rounded-full p-1",
          trendDirection === "up"
            ? isHighlighted ? "bg-white/10" : "bg-green-100"
            : isHighlighted ? "bg-white/10" : "bg-red-100"
        )}>
          <TrendIcon
            className={cn(
              "size-3.5",
              trendDirection === "up"
                ? isHighlighted
                  ? "text-white"
                  : "text-green-600"
                : isHighlighted
                  ? "text-white/70"
                  : "text-red-600"
            )}
          />
        </div>
        <span
          className={cn(
            "text-xs font-semibold",
            isHighlighted
              ? "text-white/70"
              : "text-slate-500"
          )}
        >
          {trendText}
        </span>
      </div>
    </div>
  )
}
