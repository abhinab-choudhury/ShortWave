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
        "border border-transparent rounded-xl p-5 h-auto w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm hover:shadow-md transition-shadow",
        "flex flex-col flex-wrap gap-2",
      )}
    >
      <div className="flex justify-between items-center align-middle">
        {/* Title */}
        <div className="text-lg font-semibold leading-tight text-teal-700 dark:text-teal-300">
          {name}
        </div>
        <Button asChild variant={"outline"}>
          <Link to={`/analytics/${_id}`}>
            <LinkIcon className="text-black w-3 h-3" />
          </Link>
        </Button>
      </div>

      {/* Description with clamp */}
      <p className="text-sm font-light text-gray-800/60 dark:text-gray-300 line-clamp-2">
        {description}
      </p>

      {/* Link (ID) */}
      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400 mt-1">
        <div className="p-1 rounded-md bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 flex items-center justify-center">
          <Link2 className="w-3.5 h-3.5 text-gray-600 dark:text-slate-300" />
        </div>
        <span className="truncate">{shortId}</span>
      </div>

      {/* Created date */}
      <div className="text-xs text-right text-gray-400 mt-auto">
        Created on {date.toLocaleDateString("en-GB")}
      </div>
    </div>
  );
}
