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
        "flex flex-col gap-1.5 rounded-2xl p-5 transition-colors",
        isHighlighted
          ? "bg-primary text-primary-foreground"
          : "bg-card text-card-foreground"
      )}
    >
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "text-sm font-medium",
            isHighlighted ? "text-primary-foreground/80" : "text-muted-foreground"
          )}
        >
          {label}
        </span>
        <ExternalLink
          className={cn(
            "size-3.5",
            isHighlighted ? "text-primary-foreground/50" : "text-muted-foreground"
          )}
        />
      </div>

      <span
        className={cn(
          "font-heading text-2xl font-medium tracking-tight",
          isHighlighted && "text-primary-foreground"
        )}
      >
        {value}
      </span>

      <div className="flex items-center gap-1.5">
        <TrendIcon
          className={cn(
            "size-3.5",
            trendDirection === "up"
              ? isHighlighted
                ? "text-primary-foreground"
                : "text-success"
              : isHighlighted
                ? "text-primary-foreground/70"
                : "text-error"
          )}
        />
        <span
          className={cn(
            "text-xs",
            isHighlighted
              ? "text-primary-foreground/70"
              : "text-muted-foreground"
          )}
        >
          {trendText}
        </span>
      </div>
    </div>
  )
}
