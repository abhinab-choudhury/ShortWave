import { Link2, LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";
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
        "group relative flex flex-col gap-2 rounded-2xl border border-border bg-card p-4 w-full min-h-[8.5rem] min-w-0 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm hover:border-primary/40",
        "overflow-hidden",
      )}
    >
      <Link
        to={`/analytics/${_id}`}
        aria-label={`View ${name} analytics`}
        className="flex items-center justify-between gap-2 min-w-0 rounded-xl px-4 py-0.5 transition-colors hover:bg-accent/60 focus-visible:bg-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {/* Title */}
        <div className="min-w-0 flex-1 text-sm font-semibold leading-tight tracking-tight text-foreground truncate">
          {name}
        </div>
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground">
          <LinkIcon className="size-3.5" aria-hidden="true" />
        </span>
      </Link>

      {/* Description with clamp */}
      <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2 min-h-8 wrap-break-word">
        {description || "No description provided."}
      </p>

      {/* Link (ID) + created date */}
      <div className="flex items-center justify-between gap-2 text-[11px] text-muted-foreground mt-auto min-w-0 pt-2 border-t border-border/70">
        <div className="flex items-center gap-1.5 min-w-0">
          <Link2 className="size-3 shrink-0" />
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
