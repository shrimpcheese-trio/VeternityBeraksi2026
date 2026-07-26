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
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="mt-1 size-2 shrink-0 rounded-full bg-primary/40" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{item.title}</p>
              <p className="truncate text-xs text-muted-foreground">{item.subtitle}</p>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground">
          {actionLabel}
          <ArrowRight className="size-3.5" />
        </Button>
      </CardFooter>
    </Card>
  )
}
