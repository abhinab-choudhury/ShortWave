import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { date: "2025-07-01", desktop: 143, mobile: 238, tablet: 61, others: 13 },
  { date: "2025-07-02", desktop: 198, mobile: 312, tablet: 78, others: 15 },
  { date: "2025-07-03", desktop: 176, mobile: 290, tablet: 64, others: 11 },
  { date: "2025-07-04", desktop: 212, mobile: 354, tablet: 70, others: 17 },
  { date: "2025-07-05", desktop: 134, mobile: 186, tablet: 44, others: 8 },
  { date: "2025-07-06", desktop: 158, mobile: 205, tablet: 49, others: 9 },
  { date: "2025-07-07", desktop: 200, mobile: 330, tablet: 68, others: 16 },
  { date: "2025-07-08", desktop: 179, mobile: 273, tablet: 55, others: 12 },
  { date: "2025-07-09", desktop: 194, mobile: 306, tablet: 63, others: 14 },
  { date: "2025-07-10", desktop: 150, mobile: 225, tablet: 50, others: 10 },
  { date: "2025-07-11", desktop: 137, mobile: 212, tablet: 46, others: 9 },
  { date: "2025-07-12", desktop: 185, mobile: 295, tablet: 59, others: 13 },
  { date: "2025-07-13", desktop: 169, mobile: 278, tablet: 53, others: 12 },
  { date: "2025-07-14", desktop: 210, mobile: 348, tablet: 71, others: 18 },
  { date: "2025-07-15", desktop: 145, mobile: 240, tablet: 60, others: 11 },
  { date: "2025-07-16", desktop: 162, mobile: 256, tablet: 58, others: 10 },
  { date: "2025-07-17", desktop: 188, mobile: 310, tablet: 65, others: 13 },
  { date: "2025-07-18", desktop: 173, mobile: 290, tablet: 61, others: 12 },
  { date: "2025-07-19", desktop: 195, mobile: 315, tablet: 67, others: 14 },
  { date: "2025-07-20", desktop: 158, mobile: 240, tablet: 52, others: 10 },
  { date: "2025-07-21", desktop: 132, mobile: 198, tablet: 45, others: 9 },
  { date: "2025-07-22", desktop: 184, mobile: 287, tablet: 57, others: 11 },
  { date: "2025-07-23", desktop: 169, mobile: 275, tablet: 54, others: 12 },
  { date: "2025-07-24", desktop: 221, mobile: 360, tablet: 73, others: 18 },
  { date: "2025-07-25", desktop: 144, mobile: 230, tablet: 51, others: 10 },
  { date: "2025-07-26", desktop: 167, mobile: 265, tablet: 56, others: 11 },
  { date: "2025-07-27", desktop: 193, mobile: 308, tablet: 64, others: 14 },
  { date: "2025-07-28", desktop: 178, mobile: 295, tablet: 60, others: 13 },
  { date: "2025-07-29", desktop: 207, mobile: 335, tablet: 69, others: 16 },
  { date: "2025-07-30", desktop: 155, mobile: 245, tablet: 53, others: 11 },
  { date: "2025-07-31", desktop: 166, mobile: 270, tablet: 55, others: 12 },
  { date: "2025-08-01", desktop: 143, mobile: 238, tablet: 61, others: 13 },
  { date: "2025-08-02", desktop: 198, mobile: 312, tablet: 78, others: 15 },
  { date: "2025-08-03", desktop: 176, mobile: 290, tablet: 64, others: 11 },
  { date: "2025-08-04", desktop: 212, mobile: 354, tablet: 70, others: 17 },
  { date: "2025-08-05", desktop: 134, mobile: 186, tablet: 44, others: 8 },
  { date: "2025-08-06", desktop: 158, mobile: 205, tablet: 49, others: 9 },
  { date: "2025-08-07", desktop: 200, mobile: 330, tablet: 68, others: 16 },
  { date: "2025-08-08", desktop: 179, mobile: 273, tablet: 55, others: 12 },
  { date: "2025-08-09", desktop: 194, mobile: 306, tablet: 63, others: 14 },
  { date: "2025-08-10", desktop: 150, mobile: 225, tablet: 50, others: 10 },
  { date: "2025-08-11", desktop: 137, mobile: 212, tablet: 46, others: 9 },
  { date: "2025-08-12", desktop: 185, mobile: 295, tablet: 59, others: 13 },
  { date: "2025-08-13", desktop: 169, mobile: 278, tablet: 53, others: 12 },
  { date: "2025-08-14", desktop: 210, mobile: 348, tablet: 71, others: 18 },
  { date: "2025-08-15", desktop: 145, mobile: 240, tablet: 60, others: 11 },
  { date: "2025-08-16", desktop: 162, mobile: 256, tablet: 58, others: 10 },
  { date: "2025-08-17", desktop: 188, mobile: 310, tablet: 65, others: 13 },
  { date: "2025-08-18", desktop: 173, mobile: 290, tablet: 61, others: 12 },
  { date: "2025-08-19", desktop: 195, mobile: 315, tablet: 67, others: 14 },
  { date: "2025-08-20", desktop: 158, mobile: 240, tablet: 52, others: 10 },
  { date: "2025-08-21", desktop: 132, mobile: 198, tablet: 45, others: 9 },
  { date: "2025-08-22", desktop: 184, mobile: 287, tablet: 57, others: 11 },
  { date: "2025-08-23", desktop: 169, mobile: 275, tablet: 54, others: 12 },
  { date: "2025-08-24", desktop: 221, mobile: 360, tablet: 73, others: 18 },
  { date: "2025-08-25", desktop: 144, mobile: 230, tablet: 51, others: 10 },
  { date: "2025-08-26", desktop: 167, mobile: 265, tablet: 56, others: 11 },
  { date: "2025-08-27", desktop: 193, mobile: 308, tablet: 64, others: 14 },
  { date: "2025-08-28", desktop: 178, mobile: 295, tablet: 60, others: 13 },
  { date: "2025-08-29", desktop: 207, mobile: 335, tablet: 69, others: 16 },
  { date: "2025-08-30", desktop: 155, mobile: 245, tablet: 53, others: 11 },
  { date: "2025-08-31", desktop: 166, mobile: 270, tablet: 55, others: 12 },
  { date: "2025-09-01", desktop: 143, mobile: 238, tablet: 61, others: 13 },
  { date: "2025-09-02", desktop: 198, mobile: 312, tablet: 78, others: 15 },
  { date: "2025-09-03", desktop: 176, mobile: 290, tablet: 64, others: 11 },
  { date: "2025-09-04", desktop: 212, mobile: 354, tablet: 70, others: 17 },
  { date: "2025-09-05", desktop: 134, mobile: 186, tablet: 44, others: 8 },
  { date: "2025-09-06", desktop: 158, mobile: 205, tablet: 49, others: 9 },
  { date: "2025-09-07", desktop: 200, mobile: 330, tablet: 68, others: 16 },
  { date: "2025-09-08", desktop: 179, mobile: 273, tablet: 55, others: 22 },
  { date: "2025-09-09", desktop: 194, mobile: 306, tablet: 63, others: 84 },
  { date: "2025-09-10", desktop: 150, mobile: 225, tablet: 50, others: 80 },
  { date: "2025-09-11", desktop: 137, mobile: 212, tablet: 46, others: 91 },
  { date: "2025-09-12", desktop: 185, mobile: 295, tablet: 59, others: 93 },
  { date: "2025-09-13", desktop: 169, mobile: 278, tablet: 53, others: 12 },
  { date: "2025-09-14", desktop: 210, mobile: 348, tablet: 71, others: 18 },
  { date: "2025-09-15", desktop: 145, mobile: 240, tablet: 60, others: 11 },
  { date: "2025-09-16", desktop: 162, mobile: 256, tablet: 58, others: 10 },
  { date: "2025-09-17", desktop: 188, mobile: 310, tablet: 65, others: 13 },
  { date: "2025-09-18", desktop: 173, mobile: 290, tablet: 61, others: 32 },
  { date: "2025-09-19", desktop: 195, mobile: 315, tablet: 67, others: 54 },
  { date: "2025-09-20", desktop: 158, mobile: 240, tablet: 52, others: 10 },
  { date: "2025-09-21", desktop: 132, mobile: 198, tablet: 45, others: 32 },
  { date: "2025-09-22", desktop: 184, mobile: 287, tablet: 57, others: 11 },
  { date: "2025-09-23", desktop: 169, mobile: 129, tablet: 54, others: 12 },
  { date: "2025-09-24", desktop: 221, mobile: 360, tablet: 73, others: 18 },
  { date: "2025-09-25", desktop: 144, mobile: 230, tablet: 51, others: 30 },
  { date: "2025-09-26", desktop: 167, mobile: 265, tablet: 26, others: 31 },
  { date: "2025-09-27", desktop: 193, mobile: 308, tablet: 64, others: 14 },
  { date: "2025-09-28", desktop: 178, mobile: 295, tablet: 60, others: 13 },
  { date: "2025-09-29", desktop: 207, mobile: 335, tablet: 69, others: 96 },
  { date: "2025-09-30", desktop: 155, mobile: 245, tablet: 53, others: 91 },
  { date: "2025-09-31", desktop: 166, mobile: 270, tablet: 55, others: 12 },
];

const chartConfig = {
  views: {
    label: "Page Views",
  },
  desktop: {
    label: "Desktop",
    color: "var(--chart-2)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
  tablet: {
    label: "Tablet",
    color: "var(--chart-2)",
  },
  others: {
    label: "Others",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function ChartLineInteractive() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("desktop");

  const total = React.useMemo(
    () => ({
      desktop: chartData.reduce((acc, curr) => acc + curr.desktop, 0),
      mobile: chartData.reduce((acc, curr) => acc + curr.mobile, 0),
      tablet: chartData.reduce((acc, curr) => acc + curr.tablet, 0),
      others: chartData.reduce((acc, curr) => acc + curr.others, 0),
    }),
    [],
  );

  return (
    <Card className="py-4 sm:py-0 dark:bg-gray-800">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
          <CardTitle>Click Count</CardTitle>
          <CardDescription>
            Showing total visitors for the last 3 month
          </CardDescription>
        </div>
        <div className="flex">
          {["desktop", "tablet", "mobile", "others"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="data-[active=true]:bg-gray-300/30 dark:data-[active=true]:bg-gray-900/50 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-muted-foreground text-xs">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg leading-none font-bold sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Line
              dataKey={activeChart}
              type="monotone"
              stroke={`var(--color-${activeChart})`}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
