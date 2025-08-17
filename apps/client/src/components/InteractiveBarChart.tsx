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

export const description = "A mixed bar chart";

const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
];

const mixedChartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "var(--chart-2)",
  },
  safari: {
    label: "Safari",
    color: "var(--chart-2)",
  },
  firefox: {
    label: "Firefox",
    color: "var(--chart-2)",
  },
  edge: {
    label: "Edge",
    color: "var(--chart-2)",
  },
  other: {
    label: "Other",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

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

export function InteractiveBarChartLabel(props: { className?: string }) {
  const [activeChart, setActiveChart] = React.useState();

  return (
    <Card
      className={cn(
        "flex flex-col justify-between dark:bg-gray-800",
        props.className,
      )}
    >
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
          <CardDescription className="flex gap-3 justify-start items-center align-middle">
            Click Count
            <MousePointerClick className="w-5 h-5" />
          </CardDescription>
        </div>
        <div className="flex">
          {["Countries", "Cities"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="data-[active=true]:bg-gray-300/30 dark:data-[active=true]:bg-gray-900/50 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-muted-foreground text-sm">{key}</span>
              </button>
            );
          })}
        </div>
      </CardHeader>

      <CardContent className="h-[300px] my-4 flex flex-col gap-2 overflow-y-auto">
        {locationChartData.map((data, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between bg-teal-300/20  dark:bg-teal-400/20 border border-teal-600/20 px-4 py-2 rounded-lg shadow-sm"
          >
            <div className="text-sm font-medium text-gray-800 dark:text-white">
              {data.country}
            </div>
            <div className="text-sm font-bold text-teal-700 dark:text-teal-500">
              {data.visits.toLocaleString()} visits
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function InteractiveBarChartMixed(props: { className: string }) {
  const [activeChart, setActiveChart] = React.useState();

  return (
    <Card className={cn("flex flex-col dark:bg-gray-800", props.className)}>
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
          <CardDescription className="flex gap-3 justify-start items-center align-middle">
            Click Count
            <MousePointerClick className="w-5 h-5" />
          </CardDescription>
        </div>
        <div className="flex">
          {["Browser", "Device", "OS"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="data-[active=true]:bg-gray-300/30 dark:data-[active=true]:bg-gray-900/50 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-muted-foreground text-sm">{key}</span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="mt-4">
        <ChartContainer config={mixedChartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 0,
            }}
          >
            <YAxis
              dataKey="browser"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                mixedChartConfig[value as keyof typeof mixedChartConfig]?.label
              }
            />
            <XAxis dataKey="visitors" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="visitors" layout="vertical" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
