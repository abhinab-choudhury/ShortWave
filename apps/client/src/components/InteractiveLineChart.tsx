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
import { useQueries } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/utils";

interface IDeviceData {
  date: string;
  desktop: number;
  mobile: number;
  tablet: number;
  others: number;
}

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

function BlurFallback({ message }: { message: string }) {
  return (
    <div className="flex h-[300px] items-center justify-center rounded-lg border bg-gray-200/30 dark:bg-gray-800/30 backdrop-blur-md">
      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
        {message}
      </p>
    </div>
  );
}

function normalizeDateString(dateStr: string): string {
  if (!dateStr) return "";
  const parts = dateStr.split("-").map((v) => parseInt(v, 10));
  if (parts.length !== 3 || parts.some(isNaN)) return dateStr;
  let year = parts[0];
  let month = parts[1];
  let day = parts[2];
  // Handle legacy fragile date format from toLocaleDateString split (e.g. YYYY-DD-MM)
  if (month > 12) {
    const temp = month;
    month = day;
    day = temp;
  }
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
function parseCampaignLinksDeviceData(data, shortUrl: string): IDeviceData[] {
  if (!data?.urls) return [];

  const parsedData: Record<string, IDeviceData> = {};

  for (const url of data.urls) {
    if (url.short_url !== shortUrl) continue;

    for (const click of url.clicks || []) {
      const date = normalizeDateString(click.date);
      if (!date) continue;

      if (!parsedData[date]) {
        parsedData[date] = {
          date,
          desktop: 0,
          mobile: 0,
          tablet: 0,
          others: 0,
        };
      }

      for (const device of click.device || []) {
        switch (device.device_name.toLowerCase()) {
          case "desktop":
            parsedData[date].desktop += device.count;
            break;
          case "mobile":
            parsedData[date].mobile += device.count;
            break;
          case "tablet":
            parsedData[date].tablet += device.count;
            break;
          default:
            parsedData[date].others += device.count;
            break;
        }
      }
    }
  }

  return Object.values(parsedData).sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
}


export function ChartLineInteractive({
  campaignId,
  shortUrl,
}: {
  campaignId: string;
  shortUrl: string;
}) {
  const [campaignLinks] = useQueries({
    queries: [
      {
        queryKey: ["campaignLink", campaignId],
        queryFn: () =>
          axiosInstance
            .get(`/campaign/${campaignId}/url`)
            .then((res) => res.data.data),
      },
    ],
  });
  const chartData = parseCampaignLinksDeviceData(campaignLinks.data, shortUrl);

  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("desktop");

  const total = React.useMemo(
    () => ({
      desktop: chartData.reduce((acc, curr) => acc + curr.desktop, 0),
      mobile: chartData.reduce((acc, curr) => acc + curr.mobile, 0),
      tablet: chartData.reduce((acc, curr) => acc + curr.tablet, 0),
      others: chartData.reduce((acc, curr) => acc + curr.others, 0),
    }),
    [chartData]
  );

  return (
    <Card className="py-0 dark:bg-gray-800 overflow-hidden w-full">
      <CardHeader className="flex flex-col items-stretch border-b !p-0">
        <div className="flex flex-col sm:flex-row sm:items-stretch w-full">
          <div className="flex flex-1 flex-col justify-center gap-1 px-4 sm:px-6 py-4 sm:py-5">
            <CardTitle className="text-base sm:text-lg">Click Count</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Showing total visitors for the last 3 month
            </CardDescription>
          </div>
          <div className="flex w-full sm:w-auto overflow-x-auto scrollbar-slim snap-x snap-mandatory border-t sm:border-t-0 sm:border-l">
            {["desktop", "tablet", "mobile", "others"].map((key) => {
              const chart = key as keyof typeof chartConfig;
              return (
                <button
                  key={chart}
                  data-active={activeChart === chart}
                  className="data-[active=true]:bg-teal-50 dark:data-[active=true]:bg-slate-800 flex flex-1 sm:flex-none sm:min-w-[110px] lg:min-w-[130px] flex-col justify-center gap-1 px-4 sm:px-6 py-3 sm:py-5 text-left border-r last:border-r-0 sm:border-r-0 sm:even:border-l snap-start shrink-0 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  onClick={() => setActiveChart(chart)}
                >
                  <span className="text-muted-foreground text-[11px] sm:text-xs whitespace-nowrap">
                    {chartConfig[chart].label}
                  </span>
                  <span className="text-base sm:text-xl lg:text-2xl leading-none font-bold tabular-nums">
                    {total[key as keyof typeof total].toLocaleString()}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:px-4 lg:px-6 pt-4 sm:pt-6">
        {chartData.length === 0 ?
          (<BlurFallback message="No data available" />) :
          (<ChartContainer
            config={chartConfig}
            className="aspect-auto h-[220px] sm:h-[280px] lg:h-[300px] w-full"
          >
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 8,
                right: 12,
                top: 8,
              }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={16}
                interval="preserveStartEnd"
                tick={{ fontSize: 11 }}
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
                activeDot={{ r: 4, strokeWidth: 2 }}
              />
            </LineChart>
          </ChartContainer>)
        }

      </CardContent>
    </Card>
  );
}
