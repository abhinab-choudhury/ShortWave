import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { axiosInstance } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "./ui/skeleton";

export const description = "An interactive area chart";

interface IVisitorData {
  date: string;
  visitors: number;
}

interface ICampaignLink {
  urls: {
    clicks?: {
      date: string;
      click_cnt: number;
    }[];
  }[];
}

const chartConfig: ChartConfig = {
  visitors: { label: "Visitors", color: "var(--chart-1)" },
};

function BlurFallback({ message }: { message: string }) {
  return (
    <div className="flex h-[300px] items-center justify-center rounded-lg border bg-gray-200/30 dark:bg-gray-800/30 backdrop-blur-md">
      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
        {message}
      </p>
    </div>
  );
}

function parseCampaignVisitorData(data?: ICampaignLink): IVisitorData[] {
  if (!data?.urls?.length) return [];

  const parsedData: Record<string, number> = {};

  data.urls.forEach((url) => {
    url.clicks?.forEach((click) => {
      const date = click.date;
      if (!date) return;
      parsedData[date] = (parsedData[date] || 0) + click.click_cnt;
    });
  });

  return Object.entries(parsedData)
    .map(([date, visitors]) => ({ date, visitors }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function ChartAreaInteractive({
  campaignId,
  data,
}: {
  campaignId: string;
  data?: any;
}) {
  const campaignLinks = useQuery({
    queryKey: ["campaignLink", campaignId],
    queryFn: () =>
      axiosInstance
        .get(`/campaign/${campaignId}/url`)
        .then((res) => res.data.data),
    enabled: !data,
  });

  const resolvedData = data ?? campaignLinks.data;

  const chartData = parseCampaignVisitorData(resolvedData);

  const [timeRange, setTimeRange] = React.useState<"7d" | "30d" | "90d">("90d");

  const filteredData = React.useMemo(() => {
    const today = new Date();
    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - days);

    return chartData.filter((item) => new Date(item.date) >= startDate);
  }, [chartData, timeRange]);

  if (!resolvedData && campaignLinks.isLoading) {
    return (
      <Card
        className="w-full p-4 md:p-6 dark:bg-gray-800"
        aria-busy="true"
        aria-live="polite"
      >
        <div className="mb-4 flex items-center justify-between">
          <Skeleton className="h-6 w-40 dark:bg-gray-900" />
          <Skeleton className="h-6 w-20 dark:bg-gray-900" />
        </div>
        <div className="h-[260px] w-full dark:bg-gray-900">
          <div className="h-full w-full rounded-md bg-muted/50 animate-pulse" />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4">
          <Skeleton className="h-4 w-full dark:bg-gray-900" />
          <Skeleton className="h-4 w-full dark:bg-gray-900" />
          <Skeleton className="h-4 w-full dark:bg-gray-900" />
        </div>
      </Card>
    );
  }

  if (!resolvedData && campaignLinks.isError) {
    return (
      <Card className="w-full p-4 md:p-6" role="status" aria-live="polite">
        <p className="text-sm text-red-600 dark:text-red-400">
          Failed to load analytics
          {campaignLinks.error instanceof Error
            ? `: ${campaignLinks.error.message}`
            : "."}
        </p>
      </Card>
    );
  }

  return (
    <Card className="pt-0 dark:bg-gray-800">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Area Chart - Interactive</CardTitle>
          <CardDescription>
            Showing total visitors for the selected period
          </CardDescription>
        </div>
        <Select
          value={timeRange}
          onValueChange={(value) => setTimeRange(value as "7d" | "30d" | "90d")}
        >
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {filteredData.length === 0 ? (
          <BlurFallback message="No data available" />
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-visitors)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-visitors)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
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
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="visitors"
                type="natural"
                fill="url(#fillVisitors)"
                stroke="var(--color-visitors)"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
