"use client"

import { motion } from "framer-motion"

export function ChartWidget({
  title,
  data,
}: {
  title: string
  data: { label: string; value: number }[]
}) {
  const maxValue = Math.max(...data.map((d) => d.value), 1)

  return (
    <div className="rounded-[24px] bg-white border border-slate-100 p-6 shadow-sm h-full flex flex-col">
      <div className="mb-6">
        <h3 className="font-heading text-lg font-bold text-navy">{title}</h3>
      </div>
      <div className="flex-1 w-full min-h-[250px]">
        <div className="flex h-full items-end gap-2 sm:gap-4">
          {data.map((item, index) => {
            const height = (item.value / maxValue) * 100
            return (
              <div key={item.label} className="flex flex-1 flex-col items-center gap-3 group">
                <span className="text-xs font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity -translate-y-2 group-hover:translate-y-0 duration-300">
                  {item.value}
                </span>
                <div className="relative w-full max-w-[40px] flex-1 flex items-end justify-center">
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: `${Math.max(height, 4)}%`, opacity: 1 }}
                    transition={{ duration: 1, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full rounded-t-xl bg-gradient-to-t from-sky/20 to-sky shadow-[0_0_15px_rgba(56,189,248,0.2)] relative overflow-hidden group-hover:shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-shadow duration-300"
                  >
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>
                </div>
                <span className="text-xs font-semibold text-slate-400 group-hover:text-navy transition-colors">{item.label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
