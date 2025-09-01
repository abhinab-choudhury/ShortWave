import { Link2 } from "lucide-react"
import { Link } from "react-router-dom"
import { CopyShortUrlBtn } from "./CopyShortUrlBtn"
import { QRCardBtn } from "./QRCardBtn"
import { DateUtils } from "@/lib/utils"

export interface LinkCardI {
  campaign_id: string
  original_link: string
  short_link: string
  created_at: string
}

export default function LinkCard({ campaign_id, original_link, short_link, created_at }: LinkCardI) {
  return (
    <div className="w-full md:w-[32%] my-2 rounded-lg border bg-white dark:bg-slate-900 text-card-foreground p-4 md:p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.01]">
      <div className="flex flex-col gap-3 md:gap-4">
        {/* Original Link with Actions */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <Link
              to={`/analytics/${campaign_id}/${short_link}`}
              className="text-sm md:text-[15px] font-medium text-foreground leading-6 tracking-tight hover:underline line-clamp-2 break-words"
            >
              {original_link}
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="flex shrink-0 items-center gap-2">
            <CopyShortUrlBtn shortLink={short_link} />
            <QRCardBtn shortLink={short_link} />
          </div>
        </div>

        {/* Short link and Created At */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2 min-w-0">
            <span className="p-1 rounded-md border dark:bg-gray-800">
              <Link2 className="h-4 w-4 text-muted-foreground" />
            </span>
            <span className="truncate font-mono text-[13px] text-foreground/90" title={short_link}>
              {short_link}
            </span>
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">{DateUtils.timeAgo(created_at)}</span>
        </div>
      </div>
    </div>
  )
}
