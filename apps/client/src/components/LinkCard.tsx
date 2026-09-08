import { Link2 } from "lucide-react";
import { Link } from "react-router-dom";
import { CopyShortUrlBtn } from "./CopyShortUrlBtn";
import { QRCardBtn } from "./QRCardBtn";
import { DateUtils } from "@/lib/utils";

export interface LinkCardI {
  campaign_id: string;
  original_link: string;
  short_link: string;
  created_at: string;
}

export default function LinkCard({
  campaign_id,
  original_link,
  short_link,
  created_at,
}: LinkCardI) {
  return (
    <div className="group w-full min-w-0 rounded-xl sm:rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-card-foreground p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-teal-200/60 dark:hover:border-teal-500/20 transition-all duration-200">
      <div className="flex flex-col gap-3 sm:gap-3.5 min-w-0">
        {/* Original Link with Actions */}
        <div className="flex items-start justify-between gap-2 sm:gap-3 min-w-0">
          <div className="min-w-0 flex-1">
            <Link
              to={`/analytics/${campaign_id}/${short_link}`}
              className="block text-sm sm:text-[15px] font-medium text-slate-900 dark:text-white leading-5 sm:leading-6 tracking-tight hover:text-teal-700 dark:hover:text-teal-300 hover:underline decoration-teal-500/30 underline-offset-4 line-clamp-2 break-all min-w-0"
              title={original_link}
            >
              {original_link}
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <CopyShortUrlBtn shortLink={short_link} />
            <QRCardBtn shortLink={short_link} />
          </div>
        </div>

        {/* Short link and Created At */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground border-t border-dashed border-slate-100 dark:border-slate-800 pt-3 mt-1">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="p-1 sm:p-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 shrink-0">
              <Link2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-500 dark:text-slate-400" />
            </span>
            <span
              className="truncate font-mono text-xs sm:text-[13px] text-slate-700 dark:text-slate-300 min-w-0"
              title={short_link}
            >
              {short_link}
            </span>
          </div>
          <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap shrink-0">
            {DateUtils.timeAgo(created_at)}
          </span>
        </div>
      </div>
    </div>
  );
}
