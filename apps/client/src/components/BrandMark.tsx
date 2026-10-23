import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import ShortwaveLogo from "/shortwave_logo.png";

export function BrandMark({
  to = "/dashboard",
  className,
  showWordmark = true,
}: {
  to?: string;
  className?: string;
  showWordmark?: boolean;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "inline-flex min-w-0 items-center gap-2.5 rounded-lg",
        className,
      )}
      aria-label="Shortwave home"
    >
      <img
        src={ShortwaveLogo}
        alt=""
        width={30}
        height={30}
        className="size-8 shrink-0 object-contain"
      />
      {showWordmark ? (
        <span className="truncate text-[1.05rem] font-semibold tracking-[-0.03em] text-foreground">
          Shortwave
        </span>
      ) : null}
    </Link>
  );
}
