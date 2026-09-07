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
import { axiosInstance, cn } from "@/lib/utils";
import { MousePointerClick } from "lucide-react";
import { useQueries } from "@tanstack/react-query";

interface ICountryData {
  country: string;
  visitors: number;
}

interface IOSData {
  name: string;
  visitors: number;
}

interface IDeviceData {
  name: string;
  visitors: number;
}

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
    <div className="flex h-[220px] sm:h-[300px] items-center justify-center rounded-lg border bg-gray-200/30 dark:bg-gray-800/30 backdrop-blur-md p-4 text-center">
      <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
        {message}
      </p>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
function parseCampaignLinksBrowserData(data, shortUrl): IDeviceData[] {
  if (!data?.urls) return [];

  const parsedData: Record<string, IDeviceData> = {};

  for (const url of data.urls) {
    if (url.short_url != shortUrl) continue;

    for (const click of url.clicks || []) {
      for (const browser of click.browser || []) {
        const key = browser.browser_name || "unknown";

        if (!parsedData[key]) {
          parsedData[key] = {
            name: key,
            visitors: 0,
          };
        }

        parsedData[key].visitors += browser.count;
      }
    }
  }

  return Object.values(parsedData);
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
function parseCampaignLinksDeviceData(data, shortUrl): IDeviceData[] {
  if (!data?.urls) return [];

  const parsedData: Record<string, IDeviceData> = {};

  for (const url of data.urls) {
    if (url.short_url != shortUrl) continue;

    for (const click of url.clicks || []) {
      for (const device of click.device || []) {
        const key = device.device_name || "unknown";

        if (!parsedData[key]) {
          parsedData[key] = {
            name: key,
            visitors: 0,
          };
        }

        parsedData[key].visitors += device.count;
      }
    }
  }

  return Object.values(parsedData);
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
function parseCampaignLinksOSData(data, shortUrl): IOSData[] {
  if (!data?.urls) return [];

  const parsedData: Record<string, IOSData> = {};

  for (const url of data.urls) {
    if (url.short_url != shortUrl) continue;

    for (const click of url.clicks || []) {
      for (const os of click.os || []) {
        const key = os.os_name || "unknown";

        if (!parsedData[key]) {
          parsedData[key] = {
            name: key,
            visitors: 0,
          };
        }

        parsedData[key].visitors += os.count;
      }
    }
  }

  return Object.values(parsedData);
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
function parseCampaignLinksCountryData(data,shortUrl): ICountryData[] {
  if (!data?.urls) return [];

  const parsedData: Record<string, ICountryData> = {};

  for (const url of data.urls) {
    if (url.short_url !== shortUrl) continue;

    for (const click of url.clicks || []) {
      for (const country of click.country || []) {
        const key = country.country_name || "unknown";

        if (!parsedData[key]) {
          parsedData[key] = { country: key, visitors: 0 };
        }

        parsedData[key].visitors += country.count;
      }
    }
  }

  return Object.values(parsedData).sort((a, b) => b.visitors - a.visitors);
}

export function InteractiveBarChartLabel(props: {
  campaignId: string;
  shortUrl: string;
  className?: string;
}) {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof barChartConfig>("country");
  const [campaignLinks] = useQueries({
    queries: [
      {
        queryKey: ["campaignLink", props.campaignId],
        queryFn: () =>
          axiosInstance
            .get(`/campaign/${props.campaignId}/url`)
            .then((res) => res.data.data),
      },
    ],
  });
  const countryData = parseCampaignLinksCountryData(
    campaignLinks.data,
    props.shortUrl
  );
  const hasData = countryData.length > 0;

  return (
    <Card
      className={cn(
        "flex flex-col justify-between dark:bg-gray-800 shadow-sm overflow-hidden w-full",
        props.className
      )}
    >
      {/* Header */}
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-4 sm:px-6 py-3 sm:py-4">
          <CardDescription className="flex gap-2 items-center text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-200">
            Click Count
            <MousePointerClick className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          </CardDescription>
        </div>
        <div className="flex sm:border-l overflow-x-auto scrollbar-slim">
          {["country"].map((key) => {
            const chart = key as keyof typeof barChartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="data-[active=true]:bg-teal-50 dark:data-[active=true]:bg-slate-800 flex flex-1 sm:flex-none flex-col justify-center border-t sm:border-t-0 px-4 sm:px-8 py-3 sm:py-5 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                onClick={() => setActiveChart(chart)}
              >
                {barChartConfig[chart].label}
              </button>
            );
          })}
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="h-[260px] sm:h-[300px] my-3 sm:my-4 flex flex-col gap-2 sm:gap-1.5 overflow-y-auto px-3 sm:px-6 scrollbar-slim">
        {hasData ? (
          countryData.map((data, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between gap-3 rounded-lg sm:rounded-md border border-slate-200 bg-slate-50 px-3 sm:px-5 py-2.5 sm:py-3 dark:border-slate-700 dark:bg-slate-900 min-w-0"
            >
              <div className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 truncate min-w-0 flex-1">
                {data.country}
              </div>

              <div className="text-xs sm:text-sm font-semibold text-teal-600 dark:text-teal-400 whitespace-nowrap shrink-0">
                {data.visitors.toLocaleString()}{" "}
                <span className="font-normal text-slate-500 dark:text-slate-400 hidden xs:inline">
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

export function InteractiveBarChartMixed(props: {
  campaignId: string;
  shortUrl: string;
  className?: string;
}) {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof mixedBarChartConfig>("browser");
  const [campaignLinks] = useQueries({
    queries: [
      {
        queryKey: ["campaignLink", props.campaignId],
        queryFn: () =>
          axiosInstance
            .get(`/campaign/${props.campaignId}/url`)
            .then((res) => res.data.data),
      },
    ],
  });

  const datasets = {
    browser: parseCampaignLinksBrowserData(campaignLinks.data, props.shortUrl),
    country: parseCampaignLinksCountryData(campaignLinks.data, props.shortUrl),
    device: parseCampaignLinksDeviceData(campaignLinks.data, props.shortUrl),
    os: parseCampaignLinksOSData(campaignLinks.data, props.shortUrl),
  };

  const hasData = datasets[activeChart]?.length > 0;

  return (
    <Card
      className={cn(
        "flex flex-col dark:bg-gray-800 shadow-sm overflow-hidden w-full",
        props.className
      )}
    >
      {/* Header */}
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-4 sm:px-6 py-3 sm:py-4">
          <CardDescription className="flex gap-2 items-center text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-200">
            Click Count
            <MousePointerClick className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          </CardDescription>
        </div>
        <div className="flex overflow-x-auto scrollbar-slim snap-x sm:border-l">
          {["browser", "device", "os"].map((key) => {
            const chart = key as keyof typeof mixedBarChartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="data-[active=true]:bg-teal-50 dark:data-[active=true]:bg-slate-800 flex flex-1 sm:flex-none flex-col justify-center border-t sm:border-t-0 border-r last:border-r-0 sm:border-r-0 sm:even:border-l px-4 sm:px-6 py-3 sm:py-5 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap snap-start shrink-0 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                onClick={() => setActiveChart(chart)}
              >
                {mixedBarChartConfig[chart].label}
              </button>
            );
          })}
        </div>
      </CardHeader>

      {/* Chart */}
      <CardContent className="mt-4 sm:mt-6 px-2 sm:px-6">
        {hasData ? (
          <ChartContainer config={mixedBarChartConfig} className="aspect-auto h-[260px] sm:h-[300px] w-full">
            <BarChart
              accessibilityLayer
              data={datasets[activeChart]}
              layout="vertical"
              margin={{ left: 0, right: 12, top: 4, bottom: 4 }}
            >
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                tickMargin={8}
                axisLine={false}
                width={80}
                tick={{ fontSize: 11 }}
                tickFormatter={(value: string) => value.length > 12 ? value.slice(0, 12) + "…" : value}
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
                barSize={22}
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
