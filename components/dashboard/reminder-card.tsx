import { ArrowRight } from "lucide-react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function ReminderCard({
  title,
  items,
  actionLabel,
}: {
  title: string
  items: { title: string; subtitle: string }[]
  actionLabel: string
}) {
  return (
    <div className="rounded-[24px] bg-white border border-slate-100 p-6 shadow-sm h-full flex flex-col group/card">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-heading text-lg font-bold text-navy">{title}</h3>
      </div>
      <div className="flex-1 space-y-5">
        {items.map((item, i) => (
          <div key={i} className="group flex items-start gap-4 p-3 -mx-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
            <div className="mt-1 size-2 shrink-0 rounded-full bg-sky/40 group-hover:bg-sky group-hover:scale-125 transition-all duration-300 shadow-[0_0_10px_rgba(56,189,248,0)] group-hover:shadow-[0_0_10px_rgba(56,189,248,0.5)]" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-navy group-hover:text-sky transition-colors">{item.title}</p>
              <p className="truncate text-xs font-medium text-slate-500 mt-0.5">{item.subtitle}</p>
            </div>
            <ArrowRight className="size-4 text-slate-300 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 mt-1" />
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-slate-100">
        <Button variant="ghost" size="sm" className="w-full gap-2 text-xs font-semibold text-sky hover:text-navy hover:bg-slate-50 rounded-full transition-colors">
          {actionLabel}
          <ArrowRight className="size-3.5 transition-transform duration-300 group-hover/card:translate-x-1" />
        </Button>
      </div>
    </div>
  )
}
