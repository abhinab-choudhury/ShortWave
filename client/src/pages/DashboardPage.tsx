import CampaignCard, { CampaignCardI } from "@/components/CampaignCard";
import {
  ChevronLeft,
  ChevronRight,
  Link2,
  ListFilter,
  Megaphone,
  PlusCircle,
  SlidersHorizontal,
  TentIcon,
  TrendingUp,
} from "lucide-react";
import DashboardQuickInfoCard from "@/components/DashoardQuickInfoCard";
import { CardSkeleton } from "@/components/CardSkeleton";
import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/lib/utils";
import { useQueries } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

// eslint-disable-next-line react-refresh/only-export-components
export async function getData() {
  return [
    {
      campaign_name: "Resume Links",
      page_link: "iamabhinab.xyz",
      created_at: "Dec 3, 2024",
    },
    {
      campaign_name: "Advertise Insights",
      page_link: "advertise-insights.in",
      created_at: "March 3, 2025",
    },
    {
      campaign_name: "ABC Studios",
      page_link: "abcstudios.in",
      created_at: "Feb 6, 2025",
    },
  ];
}

const DashboardPage = () => {
  // const [linkList, setLinkList] = useState<CampaignCardI[]>([]);
  // const [isLoading, setIsLoading] = useState<boolean>(true);

  const data = useQueries({
    queries: [
      {
        queryKey: ["recentLinks"],
        queryFn: () =>
          axiosInstance.get("/campaign/recent").then((res) => res.data),
      },
      {
        queryKey: ["dashboardStats"],
        queryFn: () =>
          axiosInstance.get("/campaign/stats").then((res) => res.data),
      },
    ],
  });

  const recentLinks = data[0];
  const dashboardStats = data[1];

  if (recentLinks.error) {
    toast({
      variant: "default",
      title: "❌ Failed to fetch Recent Links",
      description: recentLinks.error?.message,
    });
  }
  if (dashboardStats.error) {
    toast({
      variant: "default",
      title: "❌ Failed to fetch Dashboard Status",
      description: recentLinks.error?.message,
    });
  }

  return (
    <div className="flex flex-1">
      <div className="p-2 md:p-10 border bg-white dark:bg-slate-900 flex-col gap-2 flex-1 w-full max-h-screen overflow-scroll scrollbar-slim">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {dashboardStats.isPending ? (
            <>
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </>
          ) : (
            <>
              {/* Card 1: Total Shortened Links */}
              <DashboardQuickInfoCard
                className="group bg-gradient-to-br from-teal-100 to-teal-50 dark:from-slate-800 dark:to-slate-700 border-teal-200 dark:border-slate-600"
                title="Total Links Created"
                data="45"
                footer="+10 this week"
                icon_styles="bg-teal-200 dark:bg-teal-600/20"
                icon={
                  <Link2 className="w-6 h-6 text-teal-700 dark:text-teal-300" />
                }
              />

              {/* Card 2: Click Growth Rate */}
              <DashboardQuickInfoCard
                title="Click Rate Growth"
                data="+83.9%"
                className="group bg-gradient-to-br from-green-100 to-green-50 dark:from-slate-800 dark:to-slate-700 border-green-200 dark:border-slate-600"
                footer="Since yesterday"
                icon_styles="bg-green-200 dark:bg-green-600/20"
                icon={
                  <TrendingUp className="w-6 h-6 text-green-700 dark:text-green-300" />
                }
              />

              {/* Card 3: Active Campaigns */}
              <DashboardQuickInfoCard
                title="Active Campaigns"
                data="25"
                className="group bg-gradient-to-br from-indigo-100 to-indigo-50 dark:from-slate-800 dark:to-slate-700 border-indigo-200 dark:border-slate-600"
                footer="Running this week
            "
                icon_styles="bg-indigo-200 dark:bg-indigo-600/20"
                icon={
                  <Megaphone className="w-6 h-6 text-indigo-700 dark:text-indigo-300" />
                }
              />
            </>
          )}
        </div>
        <div className="flex flex-col mt-5 md:flex-row items-start md:items-center justify-between mb-6 gap-3">
          {/* Filter + Display Buttons */}
          <div className="flex gap-2 w-full md:w-fit">
            <Button variant={"outline"}>
              Filter
              <ListFilter className="w-4 h-4 ml-2" />
            </Button>
            <Button variant={"outline"}>
              Display
              <SlidersHorizontal className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Search + Create Button */}
          <div className="flex gap-2 items-center w-full md:w-fit">
            <input
              className="h-10 px-3 border border-gray-300 dark:border-slate-600 rounded-md text-sm w-full md:w-64 bg-white dark:bg-slate-800 dark:text-white placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              type="text"
              placeholder="Search..."
            />
            <button className="h-10 px-4 py-2 rounded-md border border-primary bg-primary text-muted hover:bg-primary/90 active:scale-95 transition">
              <PlusCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="flex flex-col p-4 gap-2 flex-1 border rounded-lg bg-gray-50 dark:bg-slate-900 min-h-[23rem] h-auto">
          <h1 className="text-xl font-bold flex gap-2 text-slate-800 dark:text-white">
            <TentIcon />
            Recent Campaigns
          </h1>

          {recentLinks.isPending ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 h-full w-full">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 h-full w-full">
              {recentLinks.data && recentLinks.data.length > 0 ? (
                recentLinks.data.map(
                  (linkData: CampaignCardI, index: number) => (
                    <CampaignCard
                      key={index}
                      campaign_name={linkData.campaign_name}
                      page_link={linkData.page_link}
                      created_at={linkData.created_at}
                    />
                  ),
                )
              ) : (
                <div className="flex justify-center items-center col-span-full text-gray-500 dark:text-slate-400 min-h-[200px]">
                  No links available.
                </div>
              )}
            </div>
          )}
          <Button
            variant="outline"
            className="w-fit mx-auto flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Show More
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
