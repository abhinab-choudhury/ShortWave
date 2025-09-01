import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BadgePercent, BarChart3, CalendarClock, FileBarChart, LayoutDashboard, Palette, QrCode, SlidersHorizontal, Target, UserCog } from "lucide-react"
import type { ReactNode } from "react"

type Feature = {
  icon: React.ReactNode
  title: string
  desc: string
}

type TabKey = "auto" | "analytics" | "report" | "custom"

const TABS: {
  key: TabKey
  label: string
  Icon: React.ElementType
  cardTitle: string
  cardDesc: string
  features: Feature[]
}[] = [
    {
      key: "auto",
      label: "Auto Tracking",
      Icon: BadgePercent,
      cardTitle: "All features, always free",
      cardDesc: "Unlock every tool without limits — no hidden fees, no subscriptions.",
      features: [
        {
          icon: <LayoutDashboard className="h-5 w-5 text-teal-600 dark:text-teal-400" />,
          title: "Simple & Interactive",
          desc: "An intuitive dashboard that’s easy to navigate, designed for productivity.",
        },
        {
          icon: <QrCode className="h-5 w-5 text-teal-600 dark:text-teal-400" />,
          title: "QR Code Support",
          desc: "Generate, customize, and manage multiple QR codes with ease.",
        },
      ],
    },
    {
      key: "analytics",
      label: "Powerful Analytic",
      Icon: BarChart3,
      cardTitle: "Understand your business deeply",
      cardDesc: "Use analytics to uncover trends, track KPIs, and grow smarter.",
      features: [
        {
          icon: <BarChart3 className="h-5 w-5 text-teal-600 dark:text-teal-400" />,
          title: "Insightful Graphs",
          desc: "Interactive charts and analytics to track performance at a glance.",
        },
        {
          icon: <LayoutDashboard className="h-5 w-5 text-teal-600 dark:text-teal-400" />,
          title: "Data-driven Dashboard",
          desc: "Get real-time insights with a clear and actionable interface.",
        },
      ],
    },
    {
      key: "report",
      label: "Live Project Report",
      Icon: FileBarChart,
      cardTitle: "Always up-to-date reports",
      cardDesc: "Keep track of progress with automated reporting and status updates.",
      features: [
        {
          icon: <CalendarClock className="h-5 w-5 text-teal-600 dark:text-teal-400" />,
          title: "Real-time Reports",
          desc: "Instant reporting keeps you ahead of deadlines.",
        },
        {
          icon: <UserCog className="h-5 w-5 text-teal-600 dark:text-teal-400" />,
          title: "Team Insights",
          desc: "Collaborative reporting that helps your team stay aligned.",
        },
      ],
    },
    {
      key: "custom",
      label: "Customization",
      Icon: SlidersHorizontal,
      cardTitle: "Tailored to your workflow",
      cardDesc: "Flexible tools that adapt to your business needs.",
      features: [
        {
          icon: <Palette className="h-5 w-5 text-teal-600 dark:text-teal-400" />,
          title: "Beautiful UI/UX",
          desc: "Clean, modern, and visually pleasing interface that enhances the user experience.",
        },
        {
          icon: <Target className="h-5 w-5 text-teal-600 dark:text-teal-400" />,
          title: "Personalized Setup",
          desc: "Customize workflows, dashboards, and reports the way you want.",
        },
      ],
    },
  ]

export function Features() {
  return (
    <section className="w-full border-y dark:bg-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <div className="text-center space-y-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">What sets this apart</p>
          <h2 className="text-4xl md:text-5xl font-bold text-balance">Features</h2>
          <p className="mx-auto max-w-3xl text-sm md:text-base leading-relaxed text-muted-foreground">
            All the advantages that simplify link management and analytics — with a clean, modern experience.
          </p>
        </div>

        <Tabs defaultValue={TABS[0].key} className="mt-10 md:mt-14">
          <TabsList className="w-full justify-start border-b bg-transparent p-0">
            {TABS.map(({ key, label, Icon }) => (
              <TabsTrigger
                key={key}
                value={key}
                className="group relative rounded-none px-3 py-2 text-sm md:text-base font-medium
                           text-muted-foreground border-none shadow-none transition-all
                           hover:text-foreground hover:bg-muted/30
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/70
                           data-[state=active]:bg-teal-50 dark:data-[state=active]:bg-teal-900/40"
              >
                <span className="inline-flex items-center gap-2">
                  <Icon
                    className="h-4 w-4 text-muted-foreground group-data-[state=active]:text-teal-600 dark:group-data-[state=active]:text-teal-400"
                    aria-hidden="true"
                  />
                  {label}
                </span>
                <span className="absolute inset-x-0 -bottom-0.5 h-[2px] bg-transparent group-data-[state=active]:bg-teal-600 dark:group-data-[state=active]:bg-teal-400" />
              </TabsTrigger>
            ))}
          </TabsList>

          {TABS.map(({ key, cardTitle, cardDesc, features }) => (
            <TabsContent key={key} value={key} className="mt-10 md:mt-12 focus-visible:outline-none">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
                <Card className="bg-muted/40 shadow-none">
                  <CardContent className="h-full p-6 md:p-8 flex flex-col justify-between">
                    <div className="space-y-3">
                      <h3 className="text-lg md:text-xl font-semibold">{cardTitle}</h3>
                      <p className="text-sm text-muted-foreground">{cardDesc}</p>
                    </div>
                    <div className="pt-6">
                      <Button className="bg-teal-600 hover:bg-teal-700 text-white">Get Started</Button>
                    </div>
                  </CardContent>
                </Card>

                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10">
                  {features.map((f, i) => (
                    <FeatureItem key={i} icon={f.icon} title={f.title} desc={f.desc} />
                  ))}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}
export function FeatureItem({
  icon,
  title,
  desc,
}: {
  icon: ReactNode
  title: string
  desc: string
}) {
  return (
    <div className="flex items-start gap-4">
      <div
        className="iinline-flex p-2 items-center justify-center rounded-full 
 border border-teal-200 bg-teal-50 
 dark:border-teal-900 dark:bg-teal-950/40"
        aria-hidden="true"
      >
        {icon}
      </div>
      <div className="space-y-1">
        <h4 className="font-semibold">{title}</h4>
        <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
      </div>
    </div>
  )
}
