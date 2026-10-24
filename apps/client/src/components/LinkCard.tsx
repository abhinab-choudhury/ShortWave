import { Link2 } from "lucide-react";
import { Link } from "react-router-dom";
import { CopyShortUrlBtn } from "./CopyShortUrlBtn";
import { QRCardBtn } from "./QRCardBtn";
import { EditLinkBtn } from "./EditLinkBtn";
import { DateUtils } from "@/lib/utils";

export interface LinkCardI {
  campaign_id: string;
  original_link: string;
  short_link: string;
  created_at: string;
  from_date?: string | null;
  to_date?: string | null;
  is_active?: boolean;
}

export default function LinkCard({
  campaign_id,
  original_link,
  short_link,
  created_at,
  from_date,
  to_date,
  is_active,
}: LinkCardI) {
  return (
    <div className="group w-full min-w-0 rounded-2xl border border-border bg-card p-4 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm hover:border-primary/40">
      <div className="flex flex-col gap-3 sm:gap-3.5 min-w-0">
        {/* Original Link with Actions */}
        <div className="flex items-start justify-between gap-2 sm:gap-3 min-w-0">
          <div className="min-w-0 flex-1">
            <Link
              to={`/analytics/${campaign_id}/${short_link}`}
              className="block text-sm font-medium leading-6 tracking-[-0.01em] text-foreground line-clamp-2 break-all underline-offset-4 group-hover:underline focus-visible:underline"
              title={original_link}
              aria-label="View link analytics"
            >
              {original_link}
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <EditLinkBtn
              campaignId={campaign_id}
              link={{
                original_url: original_link,
                short_url: short_link,
                from_date,
                to_date,
                is_active,
              }}
            />
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
            {is_active === false ? (
              <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                Inactive
              </span>
            ) : null}
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
            {DateUtils.timeAgo(created_at)}
          </span>
        </div>
      </div>
    </div>
  );
}
