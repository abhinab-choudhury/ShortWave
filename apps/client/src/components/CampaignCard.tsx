import { Link2, LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

export interface CampaignCardI {
  name: string;
  description: string;
  _id: string;
  createdAt: string;
}

export default function CampaignCard({
  name,
  description,
  _id,
  createdAt,
}: CampaignCardI) {
  const shortId = _id.slice(0, 6) + "..." + _id.slice(-4);
  const date = new Date(createdAt);
  return (
    <div
      className={cn(
        "group relative flex flex-col gap-2.5 sm:gap-3 rounded-xl sm:rounded-2xl border border-slate-200/70 dark:border-slate-700/60 p-4 sm:p-5 w-full min-w-0 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 shadow-sm hover:shadow-md hover:border-teal-200/60 dark:hover:border-teal-500/20 transition-all duration-200",
        "overflow-hidden",
      )}
    >
      <div className="flex items-start justify-between gap-3 min-w-0">
        {/* Title */}
        <div className="min-w-0 flex-1 text-[15px] sm:text-lg font-semibold leading-tight tracking-tight text-teal-700 dark:text-teal-300 line-clamp-2 break-words">
          {name}
        </div>
        <Button
          asChild
          variant="outline"
          size="icon"
          className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-700/50 hover:bg-teal-50 dark:hover:bg-teal-500/10 hover:border-teal-200 dark:hover:border-teal-500/20 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
        >
          <Link to={`/analytics/${_id}`} aria-label={`View ${name} analytics`}>
            <LinkIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Link>
        </Button>
      </div>

      {/* Description with clamp */}
      <p className="text-[13px] sm:text-sm font-normal leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-2 min-h-[2.2em] break-words">
        {description || "No description provided."}
      </p>

      {/* Link (ID) */}
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1 min-w-0">
        <div className="p-1 sm:p-1.5 rounded-md bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 flex items-center justify-center shrink-0">
          <Link2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-500 dark:text-slate-300" />
        </div>
        <span className="truncate font-mono text-[11px] sm:text-xs tracking-tight">{shortId}</span>
      </div>

      {/* Created date */}
      <div className="text-[11px] sm:text-xs text-right text-slate-400 dark:text-slate-500 mt-auto pt-2 border-t border-dashed border-slate-100 dark:border-slate-700/50">
        Created on {date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
      </div>
    </div>
  );
}
