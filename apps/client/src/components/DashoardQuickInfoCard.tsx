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
    <div
      className={cn(
        className,
        "font-sans p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl shadow-sm border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 min-w-0 overflow-hidden",
      )}
    >
      <div className="flex items-start sm:items-center justify-between gap-3 sm:gap-4 min-w-0">
        <div className="flex flex-col gap-1 sm:gap-1.5 min-w-0 flex-1">
          <p className="text-xs sm:text-sm font-medium tracking-wide text-teal-800 dark:text-teal-300 truncate">{title}</p>
          <h2 className="text-2xl xs:text-3xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-teal-900 dark:text-white leading-none truncate">
            {data}
          </h2>
        </div>
        <div className={cn(icon_styles, "p-2.5 sm:p-3 rounded-full sm:rounded-2xl shrink-0 flex items-center justify-center")}>{icon}</div>
      </div>
      <p className="mt-3 text-xs sm:text-sm leading-5 sm:leading-6 text-teal-700/70 dark:text-slate-400 line-clamp-1">{footer}</p>
    </div>
  )
}
