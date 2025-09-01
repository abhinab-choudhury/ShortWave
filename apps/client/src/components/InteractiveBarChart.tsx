import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { cn } from "@/lib/utils";
import { MousePointerClick } from "lucide-react";

const browserData = [
  { name: "Chrome", visitors: 275 },
  { name: "Safari", visitors: 200 },
  { name: "Firefox", visitors: 187 },
  { name: "Edge", visitors: 173 },
  { name: "Other", visitors: 90 },
];

const countryData = [
  { name: "India", visitors: 320 },
  { name: "USA", visitors: 210 },
  { name: "Germany", visitors: 150 },
  { name: "Brazil", visitors: 95 },
  { name: "Australia", visitors: 180 },
  { name: "Japan", visitors: 240 },
  { name: "Canada", visitors: 160 },
  { name: "France", visitors: 131 },
  { name: "South Korea", visitors: 152 },
];

const deviceData = [
  { name: "Mobile", visitors: 480 },
  { name: "Desktop", visitors: 320 },
  { name: "Tablet", visitors: 140 },
  { name: "Others", visitors: 40 },
];

const osData = [
  { name: "Windows", visitors: 300 },
  { name: "macOS", visitors: 180 },
  { name: "Linux", visitors: 120 },
  { name: "Android", visitors: 260 },
  { name: "iOS", visitors: 200 },
];

const locationChartData = [
  { country: "India", visits: 320 },
  { country: "USA", visits: 210 },
  { country: "Germany", visits: 150 },
  { country: "Brazil", visits: 95 },
  { country: "Australia", visits: 180 },
  { country: "Japan", visits: 240 },
  { country: "Canada", visits: 160 },
  { country: "Australia", visits: 148 },
  { country: "France", visits: 131 },
  { country: "Japan", visits: 198 },
  { country: "South Korea", visits: 152 },
];

const barChartConfig = {
  country: {
    label: "Country",
    color: "var(--char-2)",
  },
} satisfies ChartConfig;

const mixedBarChartConfig = {
  browser: {
    label: "Browser",
    color: "var(--char-2)",
  },
  device: {
    label: "Device",
    color: "var(--char-2)",
  },
  os: {
    label: "OS",
    color: "var(--char-2)",
  },
} satisfies ChartConfig;

function BlurFallback({ message }: { message: string }) {
  return (
    <div className="flex h-[300px] items-center justify-center rounded-lg border bg-gray-200/30 dark:bg-gray-800/30 backdrop-blur-md">
      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
        {message}
      </p>
    </div>
  );
}

export function InteractiveBarChartLabel(props: { campaignId: string; className?: string }) {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof barChartConfig>("country");

  // 👉 Check for data
  const hasData = locationChartData.length > 0;

  return (
    <Card
      className={cn(
        "flex flex-col justify-between dark:bg-gray-800 shadow-sm",
        props.className,
      )}
    >
      {/* Header */}
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
          <CardDescription className="flex gap-2 items-center text-base font-semibold text-gray-700 dark:text-gray-200">
            Click Count
            <MousePointerClick className="w-5 h-5" />
          </CardDescription>
        </div>
        <div className="flex">
          {["country"].map((key) => {
            const chart = key as keyof typeof barChartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="data-[active=true]:bg-gray-200/40 dark:data-[active=true]:bg-gray-900/50 flex flex-1 flex-col justify-center border-t px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-5 transition-colors"
                onClick={() => setActiveChart(chart)}
              >
                {barChartConfig[chart].label}
              </button>
            );
          })}
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="h-[300px] my-4 flex flex-col gap-1 overflow-y-auto">
        {hasData ? (
          locationChartData.map((data, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-5 py-3 dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="text-sm font-medium text-slate-700 dark:text-slate-200">
                {data.country}
              </div>

              <div className="text-sm font-semibold text-teal-600 dark:text-teal-400">
                {data.visits.toLocaleString()}{" "}
                <span className="font-normal text-slate-500 dark:text-slate-400">
                  visits
                </span>
              </div>
            </div>
          ))
        ) : (
          <BlurFallback message="No data available" />
        )}
      </CardContent>
    </Card>
  );
}


export function InteractiveBarChartMixed(props: { campaignId: string; className?: string }) {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof mixedBarChartConfig>("browser");

  const datasets = {
    browser: browserData,
    country: countryData,
    device: deviceData,
    os: osData,
  };

  // 👉 Check for data
  const hasData = datasets[activeChart]?.length > 0;

  return (
    <Card
      className={cn(
        "flex flex-col dark:bg-gray-800 shadow-sm",
        props.className,
      )}
    >
      {/* Header */}
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
          <CardDescription className="flex gap-2 items-center text-base font-semibold text-gray-700 dark:text-gray-200">
            Click Count
            <MousePointerClick className="w-5 h-5" />
          </CardDescription>
        </div>
        <div className="flex">
          {["browser", "device", "os"].map((key) => {
            const chart = key as keyof typeof mixedBarChartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="data-[active=true]:bg-gray-200/40 dark:data-[active=true]:bg-gray-900/50 flex flex-1 flex-col justify-center border-t px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-5 transition-colors"
                onClick={() => setActiveChart(chart)}
              >
                {mixedBarChartConfig[chart].label}
              </button>
            );
          })}
        </div>
      </CardHeader>

      {/* Chart */}
      <CardContent className="mt-6">
        {hasData ? (
          <ChartContainer config={mixedBarChartConfig}>
            <BarChart
              accessibilityLayer
              data={datasets[activeChart]}
              layout="vertical"
              margin={{ left: 12 }}
            >
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <XAxis dataKey="visitors" type="number" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar
                fill="var(--chart-2)"
                dataKey="visitors"
                layout="vertical"
                radius={6}
              />
            </BarChart>
          </ChartContainer>
        ) : (
          <BlurFallback message="No data to display" />
        )}
      </CardContent>
    </Card>
  );
}

