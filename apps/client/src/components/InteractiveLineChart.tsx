import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { MonitorSmartphone } from "lucide-react";

import {
  buildDeviceDailyClicks,
  filterByRange,
  formatDayLabel,
  formatFullDayLabel,
  RANGE_LABELS,
  type CampaignLinkRecord,
  type DeviceDailyClicks,
  type RangeValue,
} from "@/lib/analytics";
import { axiosInstance, cn } from "@/lib/utils";
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
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";
import { Skeleton } from "./ui/skeleton";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
  tablet: {
    label: "Tablet",
    color: "var(--chart-3)",
  },
  other: {
    label: "Other",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

type DeviceKey = keyof typeof chartConfig;

const DEVICE_ORDER: DeviceKey[] = ["desktop", "mobile", "tablet", "other"];

export function ChartLineInteractive({
  campaignId,
  shortUrl,
}: {
  campaignId: string;
  shortUrl: string;
}) {
  const campaignLinks = useQuery<CampaignLinkRecord>({
    queryKey: ["campaignLink", campaignId],
    queryFn: () =>
      axiosInstance
        .get(`/campaign/${campaignId}/url`)
        .then((res) => res.data.data),
    enabled: Boolean(campaignId),
  });

  const [activeChart, setActiveChart] =
    React.useState<DeviceKey>("desktop");
  const [timeRange, setTimeRange] = React.useState<RangeValue>("30d");

  const chartData = React.useMemo(
    () => buildDeviceDailyClicks(campaignLinks.data?.urls, shortUrl),
    [campaignLinks.data, shortUrl],
  );
  const filteredData = React.useMemo(
    () => filterByRange(chartData, timeRange),
    [chartData, timeRange],
  );

  const totals = React.useMemo(
    () =>
      chartData.reduce(
        (sum, current) => ({
          desktop: sum.desktop + current.desktop,
          mobile: sum.mobile + current.mobile,
          tablet: sum.tablet + current.tablet,
          other: sum.other + current.other,
        }),
        { desktop: 0, mobile: 0, tablet: 0, other: 0 } satisfies Record<
          DeviceKey,
          number
        >,
      ),
    [chartData],
  );

  return (
    <Card className="overflow-hidden">
      <CardHeader className="gap-4 border-b border-border/70 p-0">
        <div className="flex flex-col gap-3 px-5 pt-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="text-base font-semibold">
              Clicks by device
            </CardTitle>
            <CardDescription>Daily click trend for this link.</CardDescription>
          </div>
          <Select
            value={timeRange}
            onValueChange={(value) => setTimeRange(value as RangeValue)}
          >
            <SelectTrigger
              className="w-full sm:w-[160px]"
              aria-label="Select period"
            >
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="90d">{RANGE_LABELS["90d"]}</SelectItem>
              <SelectItem value="30d">{RANGE_LABELS["30d"]}</SelectItem>
              <SelectItem value="7d">{RANGE_LABELS["7d"]}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div
          className="grid grid-cols-2 border-t border-border/70 sm:grid-cols-4"
          role="tablist"
          aria-label="Device type"
        >
          {DEVICE_ORDER.map((key) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={activeChart === key}
              onClick={() => setActiveChart(key)}
              className={cn(
                "flex min-h-14 flex-col items-start justify-center gap-1 border-b border-r border-border/70 px-5 py-3 text-left transition-colors last:border-r-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:border-b-0",
                activeChart === key
                  ? "bg-accent/70"
                  : "hover:bg-muted/60",
              )}
            >
              <span className="text-xs text-muted-foreground">
                {chartConfig[key].label}
              </span>
              <span className="text-lg font-semibold tabular-nums">
                {totals[key].toLocaleString()}
              </span>
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="px-2 pt-5 sm:px-4 sm:pt-6 lg:px-6">
        {campaignLinks.isPending ? (
          <Skeleton className="h-[220px] w-full sm:h-[280px] lg:h-[300px]" />
        ) : campaignLinks.isError ? (
          <ErrorState
            title="Couldn't load chart data"
            description="Device analytics are unavailable right now."
            onRetry={() => campaignLinks.refetch()}
          />
        ) : filteredData.length === 0 ? (
          <EmptyState
            className="h-[220px] border-0 bg-transparent py-0 sm:h-[280px] lg:h-[300px]"
            icon={<MonitorSmartphone className="size-5" />}
            title="No device data in this period"
            description="Device details appear after this link receives clicks."
          />
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[220px] w-full sm:h-[280px] lg:h-[300px]"
          >
            <LineChart
              accessibilityLayer
              data={filteredData}
              margin={{ left: 0, right: 12, top: 8 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={16}
                interval="preserveStartEnd"
                tickFormatter={formatDayLabel}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      formatFullDayLabel(String(value))
                    }
                    indicator="line"
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
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

export type { DeviceDailyClicks };
