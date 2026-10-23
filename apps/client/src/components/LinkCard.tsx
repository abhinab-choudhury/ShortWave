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
    <div className="group w-full min-w-0 rounded-2xl border border-border bg-card p-4 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm hover:border-primary/40">
      <div className="flex flex-col gap-3 sm:gap-3.5 min-w-0">
        {/* Original Link with Actions */}
        <div className="flex items-start justify-between gap-2 sm:gap-3 min-w-0">
          <div className="min-w-0 flex-1">
            <Link
              to={`/analytics/${campaign_id}/${short_link}`}
              className="block text-sm font-medium leading-6 tracking-[-0.01em] text-foreground line-clamp-2 break-all hover:underline underline-offset-4"
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
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/70 pt-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="flex size-7 items-center justify-center rounded-full border border-border bg-background">
              <Link2 className="size-3.5 text-muted-foreground" />
            </span>
            <span className="truncate font-mono text-xs text-muted-foreground min-w-0" title={short_link}>
              {short_link}
            </span>
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
            {DateUtils.timeAgo(created_at)}
          </span>
        </div>
      </div>
    </div>
  );
}
