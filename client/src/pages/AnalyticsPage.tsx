import { TrendingUp } from 'lucide-react';
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from 'recharts';
import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { DashboardLinkData, getLink } from './DashboardPage';
import { isEqual } from 'lodash';
import LinkCard from '@/components/LinkCard';

const AnalyticsPage = () => {
  const [linkList, setLinkList] = useState<DashboardLinkData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const cachedDate: string | null = localStorage.getItem('dashboardLink');
      try {
        if (cachedDate) {
          const parshedData = JSON.parse(cachedDate);
          if (isEqual(parshedData, linkList)) {
            setLinkList(parshedData);
            setIsLoading(false);

            return;
          }
        }
        const data = await getLink();
        setLinkList(data);
        localStorage.setItem('dashboardLink', JSON.stringify(data));
      } catch (error) {
        console.error('Failed to fetch links:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  });

  return (
    <div className="min-h-screen w-[100%] border border-neutral-200 dark:border-gray-800 bg-gray-50 dark:bg-inherit overflow-y-scroll scrollbar-slim">
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Analytics
            </h1>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <ChartCard
            title="Revenue Growth"
            description="Monthly revenue trends"
          />
          <ChartCard title="User Engagement" description="Daily active users" />
          <ChartCard
            title="Conversion Rate"
            description="Sales conversion metrics"
          />
        </div>

        <div className="h-full w-full rounded-lg bg-gray-100p-2 mt-10">
          {linkList.length > 0 ? (
            linkList.map((linkData, index) => (
              <LinkCard
                key={index}
                image={linkData.image}
                orginal_link={linkData.orginal_link}
                short_link={linkData.short_link}
                created_at={linkData.created_at}
              />
            ))
          ) : (
            <div className="flex justify-center align-middle items-center text-gray-500">
              No links available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const chartData = [
  { month: 'January', desktop: 186 },
  { month: 'February', desktop: 305 },
  { month: 'March', desktop: 237 },
  { month: 'April', desktop: 73 },
  { month: 'May', desktop: 209 },
  { month: 'June', desktop: 214 },
];

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

function ChartCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const [chartType, setChartType] = useState<'line' | 'area' | 'bar'>('line');

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { left: 12, right: 12 },
    };

    switch (chartType) {
      case 'area':
        return (
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
              stroke="var(--color-desktop)"
              fill="var(--color-desktop)"
              fillOpacity={0.2}
            />
          </AreaChart>
        );
      case 'bar':
        return (
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
              fill="var(--color-desktop)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        );
      default:
        return (
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
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        );
    }
  };

  return (
    <Card className="transition-all duration-200 hover:shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Select
            value={chartType}
            onValueChange={(value: any) => setChartType(value)}
          >
            <SelectTrigger className="w-28">
              <SelectValue placeholder="Chart Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="line">Line</SelectItem>
              <SelectItem value="area">Area</SelectItem>
              <SelectItem value="bar">Bar</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>{renderChart()}</ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}

export default AnalyticsPage;
