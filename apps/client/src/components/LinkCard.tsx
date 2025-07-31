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
    <div className="w-[32%] border dark:border-gray-800 rounded-lg mb-3 px-4 py-5 bg-white dark:bg-gray-900 shadow-sm transition-all hover:shadow-md">
      <div className="flex justify-between items-start w-full">
        <div className="flex flex-col gap-2 w-full">
          <div className="flex justify-between items-center gap-2 text-sm font-medium break-all">
            <Link
              to={`/analytics/${campaign_id}/${link_id}`}
              className="line-clamp-1"
            >
              {original_link}
            </Link>
            <div className="flex flex-row gap-2">
              <button
                className="p-1 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                aria-label="Copy original link"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                className="p-1 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                aria-label="Show QR code"
              >
                <QrCode className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="w-full flex flex-row justify-between items-center text-sm text-muted-foreground">
            <div className="flex flex-row items-center align-middle gap-1">
              <span className="p-1 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <Link2 className="w-4 h-4" />
              </span>
              <span>{short_link}</span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap mt-1">
              {created_at}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
