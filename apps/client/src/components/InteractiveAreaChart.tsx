import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { MousePointerClick } from "lucide-react";

import { axiosInstance } from "@/lib/utils";
import {
  buildDailyClicks,
  formatDayLabel,
  formatFullDayLabel,
  parseDateKey,
  type CampaignLinkRecord,
} from "@/lib/analytics";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";
import { Skeleton } from "./ui/skeleton";

const chartConfig = {
  clicks: { label: "Clicks", color: "var(--chart-1)" },
} satisfies ChartConfig;

export function ChartAreaInteractive({
  campaignId,
  data,
}: {
  campaignId: string;
  data?: CampaignLinkRecord;
}) {
  const campaignLinks = useQuery<CampaignLinkRecord>({
    queryKey: ["campaignLink", campaignId],
    queryFn: () =>
      axiosInstance
        .get(`/campaign/${campaignId}/url`)
        .then((res) => res.data.data),
    enabled: !data && Boolean(campaignId),
  });

  const resolvedData = data ?? campaignLinks.data;
  const gradientId = React.useId().replace(/:/g, "");

  const chartData = React.useMemo(
    () => buildDailyClicks(resolvedData?.urls),
    [resolvedData],
  );

  const [startDate, setStartDate] = React.useState<string>("");
  const [endDate, setEndDate] = React.useState<string>("");

  React.useEffect(() => {
    if (!chartData.length) return;
    const dates = chartData
      .map((d) => parseDateKey(d.date))
      .filter((d): d is Date => d !== null);
    if (!dates.length) return;
    const min = new Date(Math.min(...dates.map((d) => d.getTime())));
    const max = new Date(Math.max(...dates.map((d) => d.getTime())));
    setStartDate((prev) => prev || min.toISOString().slice(0, 10));
    setEndDate((prev) => prev || max.toISOString().slice(0, 10));
  }, [chartData]);

  const filteredData = React.useMemo(() => {
    if (!chartData.length) return chartData;
    return chartData.filter((row) => {
      const date = parseDateKey(row.date);
      if (!date) return true;
      const start = startDate ? new Date(`${startDate}T00:00:00`) : null;
      const end = endDate ? new Date(`${endDate}T23:59:59`) : null;
      if (start && date < start) return false;
      if (end && date > end) return false;
      return true;
    });
  }, [chartData, startDate, endDate]);

  const isLoading = !data && campaignLinks.isPending;
  const isError = !data && campaignLinks.isError;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-col gap-3 border-b border-border/70 py-5 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1">
          <CardTitle className="text-base font-semibold">Clicks over time</CardTitle>
          <CardDescription>Daily clicks for this campaign.</CardDescription>
        </div>
        <div className="flex flex-wrap items-end gap-2">
          <div className="grid gap-1.5">
            <Label htmlFor="clicks-start" className="text-xs text-muted-foreground">
              Start date
            </Label>
            <Input
              id="clicks-start"
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.currentTarget.value)}
              className="w-[150px]"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="clicks-end" className="text-xs text-muted-foreground">
              End date
            </Label>
            <Input
              id="clicks-end"
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.currentTarget.value)}
              className="w-[150px]"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-5 sm:px-6 sm:pt-6">
        {isLoading ? (
          <Skeleton className="h-[220px] w-full sm:h-[280px] lg:h-[300px]" />
        ) : isError ? (
          <ErrorState
            title="Couldn't load chart data"
            description="Campaign clicks are unavailable right now."
            onRetry={() => campaignLinks.refetch()}
          />
        ) : filteredData.length === 0 ? (
          <EmptyState
            className="h-[220px] border-0 bg-transparent py-0 sm:h-[280px] lg:h-[300px]"
            icon={<MousePointerClick className="size-5" />}
            title="No clicks in this period"
            description="Try another date range, or share a link to start collecting clicks."
          />
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[220px] w-full sm:h-[280px] lg:h-[300px]"
          >
            <AreaChart data={filteredData} margin={{ left: 0, right: 8 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-clicks)"
                    stopOpacity={0.35}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-clicks)"
                    stopOpacity={0.02}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={formatDayLabel}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      formatFullDayLabel(String(value))
                    }
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="clicks"
                type="monotone"
                fill={`url(#${gradientId})`}
                stroke="var(--color-clicks)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
