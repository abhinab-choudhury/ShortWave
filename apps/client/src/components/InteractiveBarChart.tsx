import * as React from "react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { Globe2, Layers } from "lucide-react";

import {
  buildDimensionCounts,
  type CampaignLinkRecord,
  type Dimension,
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
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";
import { Skeleton } from "./ui/skeleton";

const chartConfig = {
  count: {
    label: "Clicks",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const mixedLabels: Record<"browser" | "device" | "os", string> = {
  browser: "Browser",
  device: "Device",
  os: "Operating system",
};

function DimensionChart({
  campaignId,
  shortUrl,
  className,
}: {
  campaignId: string;
  shortUrl: string;
  className?: string;
}) {
  const campaignLinks = useQuery<CampaignLinkRecord>({
    queryKey: ["campaignLink", campaignId],
    queryFn: () =>
      axiosInstance
        .get(`/campaign/${campaignId}/url`)
        .then((res) => res.data.data),
    enabled: Boolean(campaignId),
  });

  const [activeDimension, setActiveDimension] = React.useState<
    "browser" | "device" | "os"
  >("browser");

  const data = React.useMemo(
    () =>
      buildDimensionCounts(
        campaignLinks.data?.urls,
        shortUrl,
        activeDimension as Dimension,
      ),
    [campaignLinks.data, shortUrl, activeDimension],
  );

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="gap-4 border-b border-border/70 p-0">
        <div className="px-5 pt-5">
          <CardTitle className="text-base font-semibold">
            Audience breakdown
          </CardTitle>
          <CardDescription>All clicks grouped by category.</CardDescription>
        </div>
        <div
          className="grid grid-cols-3 border-t border-border/70"
          role="tablist"
          aria-label="Audience dimension"
        >
          {(["browser", "device", "os"] as const).map((key) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={activeDimension === key}
              onClick={() => setActiveDimension(key)}
              className={cn(
                "min-h-12 border-r border-border/70 px-3 py-3 text-sm font-medium transition-colors last:border-r-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                activeDimension === key
                  ? "bg-accent/70 text-foreground"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )}
            >
              {mixedLabels[key]}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-5 sm:px-4 sm:pt-6 lg:px-6">
        {campaignLinks.isPending ? (
          <Skeleton className="h-[240px] w-full" />
        ) : campaignLinks.isError ? (
          <ErrorState
            title="Couldn't load breakdown"
            description="Audience analytics are unavailable right now."
            onRetry={() => campaignLinks.refetch()}
          />
        ) : data.length === 0 ? (
          <EmptyState
            className="h-[240px] border-0 bg-transparent py-0"
            icon={<Layers className="size-5" />}
            title="No audience data yet"
            description="Browser, device, and OS details appear after clicks arrive."
          />
        ) : (
          <ChartContainer config={chartConfig} className="h-[240px] w-full">
            <BarChart
              accessibilityLayer
              data={data}
              layout="vertical"
              margin={{ left: 0, right: 16, top: 4, bottom: 4 }}
            >
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                tickMargin={8}
                axisLine={false}
                width={104}
                tick={{ fontSize: 11 }}
                tickFormatter={(value: string) =>
                  value.length > 16 ? `${value.slice(0, 16)}…` : value
                }
              />
              <XAxis dataKey="count" type="number" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar
                fill="var(--color-count)"
                dataKey="count"
                layout="vertical"
                radius={[0, 6, 6, 0]}
                barSize={20}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

export function InteractiveBarChartLabel(props: {
  campaignId: string;
  shortUrl: string;
  className?: string;
}) {
  const campaignLinks = useQuery<CampaignLinkRecord>({
    queryKey: ["campaignLink", props.campaignId],
    queryFn: () =>
      axiosInstance
        .get(`/campaign/${props.campaignId}/url`)
        .then((res) => res.data.data),
    enabled: Boolean(props.campaignId),
  });

  const data = React.useMemo(
    () =>
      buildDimensionCounts(
        campaignLinks.data?.urls,
        props.shortUrl,
        "country",
      ),
    [campaignLinks.data, props.shortUrl],
  );

  return (
    <Card className={cn("overflow-hidden", props.className)}>
      <CardHeader className="px-5 pt-5">
        <CardTitle className="text-base font-semibold">
          Top countries
        </CardTitle>
        <CardDescription>Where your audience clicks from.</CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-1 sm:px-4 lg:px-6">
        {campaignLinks.isPending ? (
          <Skeleton className="h-[240px] w-full" />
        ) : campaignLinks.isError ? (
          <ErrorState
            title="Couldn't load countries"
            description="Country analytics are unavailable right now."
            onRetry={() => campaignLinks.refetch()}
          />
        ) : data.length === 0 ? (
          <EmptyState
            className="h-[240px] border-0 bg-transparent py-0"
            icon={<Globe2 className="size-5" />}
            title="No country data yet"
            description="Locations appear once this link receives clicks."
          />
        ) : (
          <ChartContainer config={chartConfig} className="h-[240px] w-full">
            <BarChart
              accessibilityLayer
              data={data}
              layout="vertical"
              margin={{ left: 0, right: 16, top: 4, bottom: 4 }}
            >
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                tickMargin={8}
                axisLine={false}
                width={104}
                tick={{ fontSize: 11 }}
                tickFormatter={(value: string) =>
                  value.length > 16 ? `${value.slice(0, 16)}…` : value
                }
              />
              <XAxis dataKey="count" type="number" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar
                fill="var(--color-count)"
                dataKey="count"
                layout="vertical"
                radius={[0, 6, 6, 0]}
                barSize={20}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

export function InteractiveBarChartMixed(props: {
  campaignId: string;
  shortUrl: string;
  className?: string;
}) {
  return <DimensionChart {...props} />;
}
