import type React from "react";
import { cn } from "@/lib/utils";

export default function DashboardQuickInfoCard({
  title,
  data,
  icon,
  footer,
  className,
  icon_styles,
}: {
  title: string;
  data: string;
  icon: React.ReactNode;
  footer: string;
  className: string;
  icon_styles: string;
}) {
  return (
    <div
      className={cn(
        className,
        "font-sans p-3 sm:p-4 rounded-xl border shadow-sm transition-all duration-200 hover:shadow-md min-w-0 overflow-hidden",
      )}
    >
      <div className="flex items-center justify-between gap-3 min-w-0">
        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
          <p className="text-[11px] sm:text-xs font-medium tracking-wide text-teal-800 dark:text-teal-300 truncate">
            {title}
          </p>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-teal-900 dark:text-white leading-none truncate">
            {data}
          </h2>
        </div>
        <div
          className={cn(
            icon_styles,
            "p-2 rounded-lg shrink-0 flex items-center justify-center",
          )}
        >
          {icon}
        </div>
      </div>
      <p className="mt-1.5 text-[11px] sm:text-xs leading-4 text-teal-700/70 dark:text-slate-400 line-clamp-1">
        {footer}
      </p>
    </div>
  );
}
