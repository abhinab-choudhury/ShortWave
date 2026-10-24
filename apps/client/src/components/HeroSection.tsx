import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Link2, QrCode } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export function Hero() {
  const { user } = useAuth();

  return (
    <section className="relative overflow-hidden border-b border-border/70">
      <div className="pointer-events-none absolute inset-0 paper-grid opacity-70" />
      <div className="relative mx-auto grid max-w-7xl gap-14 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:px-10 lg:py-28">
        <div className="max-w-2xl">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-primary">
            Link management, with context
          </p>
          <h1 className="mt-6 font-display text-5xl leading-[0.98] tracking-[-0.035em] text-balance sm:text-6xl lg:text-7xl">
            Shorten the link.
            <br />
            <span className="text-primary">Keep the story.</span>
          </h1>
          <p className="mt-7 max-w-xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            Create short links, group them into campaigns, and understand what
            happens after the click. Shortwave is a quiet, focused home for the
            links you share.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link to={user ? "/dashboard" : "/signin"}>
                {user ? "Open dashboard" : "Start with email"}
                <ArrowRight className="ml-2 size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#features">Explore features</a>
            </Button>
          </div>

          <dl className="mt-12 grid max-w-lg grid-cols-3 gap-4 border-t border-border/80 pt-6">
            {[
              ["Campaigns", "Group related links"],
              ["Analytics", "Read the click trail"],
              ["QR cards", "Customise and export"],
            ].map(([title, detail]) => (
              <div key={title}>
                <dt className="text-sm font-semibold text-foreground">{title}</dt>
                <dd className="mt-1 text-xs leading-5 text-muted-foreground">
                  {detail}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
          <div className="absolute -inset-6 rounded-[2rem] bg-primary/5 blur-2xl" />
          <div className="relative overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-xl">
            <div className="flex items-center justify-between border-b border-border/70 px-5 py-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Product launch
                </p>
                <p className="mt-0.5 text-sm font-semibold">Campaign overview</p>
              </div>
              <span className="rounded-full bg-accent px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-accent-foreground">
                Live
              </span>
            </div>

            <div className="space-y-4 p-5">
              <div className="rounded-2xl border border-border/80 bg-background/60 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                      <Link2 className="size-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        shortwave.link/launch
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        example.com/product-launch
                      </p>
                    </div>
                  </div>
                  <QrCode className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                </div>
              </div>

              <div className="rounded-2xl border border-border/80 bg-background/60 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    Clicks over time
                  </p>
                  <BarChart3 className="size-4 text-primary" aria-hidden="true" />
                </div>
                <div className="mt-4 flex h-28 items-end gap-2">
                  {[32, 48, 38, 66, 54, 82, 70, 92, 76, 88].map((height, index) => (
                    <div
                      key={index}
                      className="relative flex-1 overflow-hidden rounded-md bg-primary/15"
                      style={{ height: `${height}%` }}
                    >
                      <div
                        className="absolute inset-x-0 bottom-0 rounded-md bg-primary/65"
                        style={{ height: `${Math.max(24, height - 18)}%` }}
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex justify-between text-[0.65rem] text-muted-foreground">
                  <span>Mon</span>
                  <span>Wed</span>
                  <span>Fri</span>
                  <span>Sun</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Devices", "Desktop / Mobile"],
                  ["Locations", "Country breakdown"],
                ].map(([label, detail]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-border/80 bg-background/60 p-4"
                  >
                    <p className="text-xs font-semibold text-foreground">{label}</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
