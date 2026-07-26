"use client"

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"

export function ChartWidget({
  title,
  data,
}: {
  title: string
  data: { label: string; value: number }[]
}) {
  const maxValue = Math.max(...data.map((d) => d.value), 1)

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <div className="flex h-full items-end gap-3">
            {data.map((item) => {
              const height = (item.value / maxValue) * 100
              return (
                <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-xs text-muted-foreground">{item.value}</span>
                  <div
                    className="w-full rounded-t-lg bg-primary transition-all"
                    style={{ height: `${Math.max(height, 4)}%` }}
                  />
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
