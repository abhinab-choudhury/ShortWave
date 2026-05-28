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
    <div className="flex h-[300px] items-center justify-center rounded-lg border bg-gray-200/30 dark:bg-gray-800/30 backdrop-blur-md">
      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
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
        "flex flex-col justify-between dark:bg-gray-800 shadow-sm",
        props.className
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
          countryData.map((data, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-5 py-3 dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="text-sm font-medium text-slate-700 dark:text-slate-200">
                {data.country}
              </div>

              <div className="text-sm font-semibold text-teal-600 dark:text-teal-400">
                {data.visitors.toLocaleString()}{" "}
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
        "flex flex-col dark:bg-gray-800 shadow-sm",
        props.className
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
