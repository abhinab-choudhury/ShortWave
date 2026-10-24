import {
  BarChart3,
  CalendarRange,
  Link2,
  QrCode,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

const FEATURES = [
  {
    icon: Link2,
    title: "Campaigns, not clutter",
    description:
      "Keep related short links together so every launch, post, or experiment has a clear home.",
  },
  {
    icon: BarChart3,
    title: "A click trail you can read",
    description:
      "Track daily clicks and break them down by device, browser, operating system, and country.",
  },
  {
    icon: QrCode,
    title: "QR cards worth sharing",
    description:
      "Adjust colours, style, quiet zone, and logo, then export a clean QR card for print or screen.",
  },
  {
    icon: CalendarRange,
    title: "Time ranges that make sense",
    description:
      "Compare the last 7, 30, or 90 days with inclusive, timezone-safe date handling.",
  },
  {
    icon: Smartphone,
    title: "Built for the small screen",
    description:
      "The Android app uses native navigation, safe areas, and touch targets that behave like an app.",
  },
  {
    icon: ShieldCheck,
    title: "No password to remember",
    description:
      "Sign in with a one-time code or your existing OAuth account. Your session stays on your device.",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Sign in",
    description:
      "Use an email code, Google, or GitHub. No new password to keep track of.",
  },
  {
    number: "02",
    title: "Create a campaign",
    description:
      "Give a group of links a name and a purpose, then add the destination URLs.",
  },
  {
    number: "03",
    title: "Share and observe",
    description:
      "Copy the short link or share its QR card, then follow the clicks in analytics.",
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="border-b border-border/70 bg-card/45"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-primary">
              What is inside
            </p>
            <h2 className="mt-5 font-display text-4xl leading-none tracking-[-0.03em] text-balance sm:text-5xl">
              A smaller toolkit, used properly.
            </h2>
            <p className="mt-5 max-w-md text-pretty text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
              No inflated dashboards or decorative controls. Just the parts of
              link management that help you publish, share, and learn.
            </p>
          </div>

          <div className="grid gap-x-10 gap-y-9 sm:grid-cols-2">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <article key={title}>
                <span className="flex size-10 items-center justify-center rounded-xl border border-border bg-background text-primary">
                  <Icon className="size-4.5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-base font-semibold tracking-[-0.01em]">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Workflow() {
  return (
    <section id="workflow" className="border-b border-border/70">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-10">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-primary">
              The loop
            </p>
            <h2 className="mt-4 font-display text-4xl leading-none tracking-[-0.03em] sm:text-5xl">
              From link to lesson.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-muted-foreground">
            Shortwave is deliberately three steps, repeated. The interesting
            part is what you learn along the way.
          </p>
        </div>

        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
          {STEPS.map((step) => (
            <article key={step.number} className="bg-card p-6 sm:p-7">
              <p className="font-mono text-xs text-primary">{step.number}</p>
              <h3 className="mt-6 font-display text-2xl tracking-[-0.02em]">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
