import { IconBrandCampaignmonitor } from "@tabler/icons-react";
import CampaignCard, { CampaignCardI } from "@/components/CampaignCard";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { CardSkeleton } from "@/components/CardSkeleton";

const AnalyticsPage = () => {
  const campaigns = useQuery({
    queryKey: ["campaigns"],
    queryFn: () => axiosInstance.get("/campaign").then((res) => res.data),
  });
  const Cards = () => {
    if (campaigns.isPending) {
      return (
        <>
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </>
      );
    }

    const userCampaigns = campaigns.data.data ?? [];
    if (userCampaigns.length == 0) {
      return (
        <div className="flex flex-col justify-center items-center col-span-full text-slate-400 dark:text-slate-500 min-h-[200px] gap-2">
          <IconBrandCampaignmonitor className="w-10 h-10 text-slate-300 dark:text-slate-600" />
          <p className="text-sm font-medium">No campaigns yet</p>
          <p className="text-xs">Create your first campaign to see analytics</p>
        </div>
      );
    }

    return userCampaigns.map((link: CampaignCardI, index: number) => (
      <CampaignCard
        key={index}
        name={link.name}
        description={link.description}
        _id={link._id}
        createdAt={link.createdAt}
      />
    ));
  };

  if (campaigns.isError) {
    toast({
      variant: "default",
      title: "❌ failed to fetch recent links",
      description: campaigns.error?.message,
    });
  }

  return (
    <div className="min-h-screen w-full bg-slate-50/50 dark:bg-slate-950 overflow-y-auto overflow-x-hidden scrollbar-slim">
      <div className="p-4 sm:p-6 md:p-8 lg:p-10 mx-auto max-w-[1600px]">
        <div className="flex flex-col justify-start items-start mb-6 sm:mb-8 gap-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Track performance across all your campaigns
          </p>
        </div>

        <div className="flex flex-col p-4 sm:p-6 gap-4 sm:gap-5 flex-1 border border-slate-200/60 dark:border-slate-800 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900/50 min-h-[60vh] sm:min-h-[80vh] shadow-sm">
          <h2 className="text-base sm:text-lg font-semibold flex gap-2 sm:gap-2.5 items-center text-slate-800 dark:text-white">
            <div className="p-1 sm:p-1.5 rounded-lg bg-teal-50 dark:bg-teal-500/10 shrink-0">
              <IconBrandCampaignmonitor className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 dark:text-teal-400" />
            </div>
            All Campaigns
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
            <Cards />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
