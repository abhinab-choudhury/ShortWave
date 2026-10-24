import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  icon,
  tone = "primary",
  className,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  icon?: React.ReactNode;
  tone?: "primary" | "sand" | "blue" | "clay";
  className?: string;
}) {
  const tones = {
    primary: "bg-accent text-accent-foreground",
    sand: "bg-chart-2/12 text-chart-2",
    blue: "bg-chart-3/12 text-chart-3",
    clay: "bg-chart-4/12 text-chart-4",
  };

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-xs transition-shadow hover:shadow-sm",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            {label}
          </p>
          <p className="mt-3 font-display text-4xl leading-none tracking-[-0.03em] text-foreground tabular-nums">
            {value}
          </p>
          {hint ? (
            <p className="mt-3 text-xs leading-5 text-muted-foreground">
              {hint}
            </p>
          ) : null}
        </div>
        {icon ? (
          <div
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-xl",
              tones[tone],
            )}
          >
            {icon}
          </div>
        ) : null}
      </div>
    </div>
  );
}
