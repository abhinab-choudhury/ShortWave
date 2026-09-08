import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TrendingUp } from "lucide-react";
import { useState } from "react";

const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

function ChartCard({
  title,
  chatType,
  description,
}: {
  title: string;
  chatType: "line" | "area" | "bar";
  description: string;
}) {
  const [chartType, setChartType] = useState<"line" | "area" | "bar">(chatType);

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { left: 12, right: 12 },
    };

    switch (chartType) {
      case "area":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart {...commonProps}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Area
                type="monotone"
                dataKey="desktop"
                stroke="var(--chart-2)"
                fill="var(--chart-2)"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      case "bar":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart {...commonProps}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar
                dataKey="desktop"
                fill="var(--chart-2)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        );
      default:
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart {...commonProps}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Line
                dataKey="desktop"
                type="linear"
                stroke="var(--chart-2)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <Card className="flex flex-col justify-between transition-all duration-200 hover:shadow-lg overflow-hidden w-full">
      <CardHeader className="dark:bg-gray-900 border-gray-950 rounded-t-md p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
          <div className="flex flex-col gap-1 min-w-0 flex-1">
            <CardTitle className="text-base sm:text-lg leading-tight truncate">
              {title}
            </CardTitle>
            <CardDescription className="font-light text-xs sm:text-sm line-clamp-2">
              {description}
            </CardDescription>
          </div>
          <Select
            value={chartType}
            onValueChange={(value: "line" | "bar" | "area") =>
              setChartType(value)
            }
          >
            <SelectTrigger className="w-full sm:w-32 dark:bg-gray-800 h-9 text-sm shrink-0">
              <SelectValue placeholder="Chart Type" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-800">
              <SelectItem
                value="line"
                className="hover:dark:bg-gray-700 hover:bg-gray-500/40"
              >
                Line
              </SelectItem>
              <SelectItem
                value="area"
                className="hover:dark:bg-gray-700 hover:bg-gray-500/40"
              >
                Area
              </SelectItem>
              <SelectItem
                value="bar"
                className="hover:dark:bg-gray-700 hover:bg-gray-500/40"
              >
                Bar
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="dark:bg-gray-900 px-3 sm:px-6 pb-4">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[220px] sm:h-[260px] w-full"
        >
          {renderChart()}
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col dark:bg-gray-900 border-gray-950 rounded-b-md items-start gap-1.5 sm:gap-2 text-xs sm:text-sm px-4 sm:px-6 pb-4 sm:pb-6">
        <div className="flex gap-2 font-medium leading-none items-center flex-wrap">
          Trending up by 5.2% this month{" "}
          <TrendingUp className="h-4 w-4 shrink-0" />
        </div>
        <div className="leading-snug text-muted-foreground text-xs">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}

export default ChartCard;
