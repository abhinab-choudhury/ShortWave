import type React from "react"
import { cn } from "@/lib/utils"

export default function DashboardQuickInfoCard({
  title,
  data,
  icon,
  footer,
  className,
  icon_styles,
}: {
  title: string
  data: string
  icon: React.ReactNode
  footer: string
  className: string
  icon_styles: string
}) {
  return (
    <>
      <div
        className={cn(
          className,
          "font-sans p-6 rounded-xl shadow-md border transition hover:shadow-lg hover:-translate-y-1 duration-200",
        )}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-medium tracking-wide text-teal-800 dark:text-teal-300">{title}</p>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-teal-900 dark:text-white leading-tight">
              {data}
            </h2>
          </div>
          <div className={cn(icon_styles, "p-3 rounded-full shrink-0")}>{icon}</div>
        </div>
        <p className="mt-3 text-sm leading-6 text-teal-700/70 dark:text-slate-400">{footer}</p>
      </div>
    </>
  )
}
