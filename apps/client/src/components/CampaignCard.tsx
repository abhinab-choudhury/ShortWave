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
        "group relative flex flex-col gap-2 rounded-xl border border-slate-200/70 dark:border-slate-700/60 p-3 sm:p-4 w-full h-[8.5rem] min-w-0 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 shadow-sm hover:shadow-md hover:border-teal-200/60 dark:hover:border-teal-500/20 transition-all duration-200",
        "overflow-hidden",
      )}
    >
      <div className="flex items-start justify-between gap-2 min-w-0">
        {/* Title */}
        <div className="min-w-0 flex-1 text-sm font-semibold leading-tight tracking-tight text-teal-700 dark:text-teal-300 truncate">
          {name}
        </div>
        <Button
          asChild
          variant="outline"
          size="icon"
          className="h-7 w-7 shrink-0 rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-700/50 hover:bg-teal-50 dark:hover:bg-teal-500/10 hover:border-teal-200 dark:hover:border-teal-500/20 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
        >
          <Link to={`/analytics/${_id}`} aria-label={`View ${name} analytics`}>
            <LinkIcon className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>

      {/* Description with clamp */}
      <p className="text-xs font-normal leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-2 min-h-[2rem] break-words">
        {description || "No description provided."}
      </p>

      {/* Link (ID) + created date */}
      <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-auto min-w-0 pt-2 border-t border-slate-100 dark:border-slate-700/50">
        <div className="flex items-center gap-1.5 min-w-0">
          <Link2 className="w-3 h-3 text-slate-400 dark:text-slate-500 shrink-0" />
          <span className="truncate font-mono tracking-tight">{shortId}</span>
        </div>
        <span className="shrink-0">
          {date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>
    </div>
  );
}
