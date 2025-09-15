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

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
function parseCampaignLinksDeviceData(data, shortUrl: string): IDeviceData[] {
  const parsedData: Record<string, IDeviceData> = {};

  for (const url of data.urls) {
    if (url.short_url !== shortUrl) continue;

    for (const click of url.clicks) {
      const date = click.date;

      if (!parsedData[date]) {
        parsedData[date] = {
          date,
          desktop: 0,
          mobile: 0,
          tablet: 0,
          others: 0,
        };
      }

      for (const device of click.device) {
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
  console.log("Campaign Links:", campaignLinks);
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
    <Card className="py-4 sm:py-0 dark:bg-gray-800">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
          <CardTitle>Click Count</CardTitle>
          <CardDescription>
            Showing total visitors for the last 3 month
          </CardDescription>
          ChartLineInteractive
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
        {chartData.length === 0 ?
          (<BlurFallback message="No data available" />) :
          (<ChartContainer
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
          </ChartContainer>)
        }

      </CardContent>
    </Card>
  );
}
