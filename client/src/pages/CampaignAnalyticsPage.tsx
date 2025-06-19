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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import LinkCard, { LinkCardI } from '@/components/LinkCard';
import { Button } from '@/components/ui/button';
import { IconLink } from '@tabler/icons-react';

const CampaignAnalyticsPage = () => {
  const [linkList, setLinkList] = useState<LinkCardI[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [campaign, setCampaign] = useState('Advertise Insights');

  const campaignList = ['Resume Link', 'Advertise Insights', 'ABC Studios'];
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLinkList([
          {
            orginal_link: 'github.com/abhinab-choudhury',
            short_link: 'short.link/abhinab',
            created_at: '3 Dec 2025',
          },
          {
            orginal_link: 'github.com/abhinab-choudhury',
            short_link: 'short.link/abhinab',
            created_at: '3 Dec 2025',
          },
          {
            orginal_link: 'github.com/abhinab-choudhury',
            short_link: 'short.link/abhinab',
            created_at: '3 Dec 2025',
          },
        ]);
      } catch (error) {
        console.error('Failed to fetch links:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen w-full border border-slate-200 dark:border-slate-900 dark:bg-slate-900 overflow-y-scroll scrollbar-slim">
      <div className="p-2 md:p-10 max-w-7xl mx-auto">
        <div className="flex flex-col justify-start items-start mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Analytics
          </h1>
          <div className="relative flex gap-2 flex-col">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={'default'}>
                  {campaign || 'Select Campaign'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-lg">
                <DropdownMenuLabel className="text-xs uppercase text-slate-500 dark:text-slate-400 px-3 py-2">
                  Choose Campaign
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="border-t border-slate-200 dark:border-slate-700" />
                <DropdownMenuRadioGroup
                  value={campaign}
                  onValueChange={setCampaign}
                >
                  {campaignList.map((camp, index) => (
                    <DropdownMenuRadioItem
                      key={index}
                      value={camp}
                      className="px-8 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-sm"
                    >
                      {camp}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="border-0 dark:border p-5 bg-gray-100 dark:bg-slate-800 rounded-xl grid gap-4 lg:grid-cols-3">
          <ChartCard
            chatType="line"
            title="Revenue Growth"
            description="Monthly revenue trends"
          />
          <ChartCard
            chatType="area"
            title="User Engagement"
            description="Daily active users"
          />
          <ChartCard
            chatType="bar"
            title="Conversion Rate"
            description="Sales conversion metrics"
          />
        </div>

        <div className="h-full w-full rounded-lg bg-muted p-4 mt-10 dark:bg-slate-800">
          <h1 className="text-xl font-bold flex gap-2 text-slate-800 dark:text-white mt-4 mb-6">
            <IconLink />
            Links
          </h1>
          {linkList.length > 0 ? (
            linkList.map((linkData, index) => (
              <LinkCard
                key={index}
                orginal_link={linkData.orginal_link}
                short_link={linkData.short_link}
                created_at={linkData.created_at}
              />
            ))
          ) : (
            <div className="flex justify-center items-center text-gray-500 dark:text-slate-400">
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
  chatType,
  description,
}: {
  title: string;
  chatType: 'line' | 'area' | 'bar';
  description: string;
}) {
  const [chartType, setChartType] = useState<'line' | 'area' | 'bar'>(chatType);

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

export default CampaignAnalyticsPage;
