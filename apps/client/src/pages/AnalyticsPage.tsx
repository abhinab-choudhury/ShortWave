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
    console.log("User Campaigns : ", userCampaigns);
    if (userCampaigns.length == 0) {
      return (
        <div className="flex justify-center items-center col-span-full text-gray-500 dark:text-slate-400 min-h-[200px]">
          No links available.
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
    <div className="min-h-screen w-full border border-slate-200 dark:border-slate-900 dark:bg-slate-900 overflow-y-scroll scrollbar-slim">
      <div className="p-2 md:p-10 mx-auto">
        <div className="flex flex-col justify-start items-start mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Analytics
          </h1>
        </div>

        <div className="flex flex-col p-4 gap-2 flex-1 border rounded-lg bg-gray-50 dark:bg-slate-900 min-h-[85vh]">
          <h1 className="text-xl font-bold flex gap-2 text-slate-800 dark:text-white my-5">
            <IconBrandCampaignmonitor />
            All Campaigns
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Cards />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
