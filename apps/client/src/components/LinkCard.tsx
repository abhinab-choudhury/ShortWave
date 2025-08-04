import { Copy, Link2, QrCode } from "lucide-react";
import { Link } from "react-router-dom";

export interface LinkCardI {
  link_id: string;
  campaign_id: string;
  original_link: string;
  short_link: string;
  created_at: string;
}

export default function LinkCard({
  link_id,
  campaign_id,
  original_link,
  short_link,
  created_at,
}: LinkCardI) {
  return (
    <div className="w-full md:w-[32%] my-2 border border-transparent rounded-xl p-5 bg-white dark:bg-gray-900 shadow-sm hover:shadow-mdshadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-200">
      <div className="flex flex-col gap-4">
        {/* Original Link with Actions */}
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1">
            <Link
              to={`/analytics/${campaign_id}/${link_id}`}
              className="text-sm font-medium text-foreground hover:underline line-clamp-2 break-all"
            >
              {original_link}
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              className="p-2 rounded-md border border-border dark:hover:bg-gray-800 hover:bg-gray-100 transition"
              aria-label="Copy original link"
            >
              <Copy className="w-4 h-4 text-muted-foreground" />
            </button>
            <button
              className="p-2 rounded-md border border-border dark:hover:bg-gray-800 hover:bg-gray-100 transition"
              aria-label="Show QR code"
            >
              <QrCode className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Short link and Created At */}
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <Link2 className="w-4 h-4 text-muted-foreground" />
            </span>
            <span className="text-foreground font-medium">{short_link}</span>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
            {created_at}
          </span>
        </div>
      </div>
    </div>
  );
}
