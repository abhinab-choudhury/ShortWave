import { CircleDot } from "lucide-react";
import LinkCard, { LinkCardI } from "@/components/LinkCard";
import { Button } from "@/components/ui/button";
import { IconLink } from "@tabler/icons-react";
import { AlertDeleteCampaignBtn } from "@/components/AlertDeleteBtn";
import CreateLinkBtn from "@/components/CreateLinkBtn";
import { useQueries } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/utils";
import { useParams } from "react-router-dom";
import { CardSkeleton } from "@/components/CardSkeleton";
import { ChartAreaInteractive } from "@/components/InteractiveAreaChart";
import ReloadBtn from "@/components/ReloadBtn";

const CampaignAnalyticsPage = () => {
  const { campaignId } = useParams();
  const [campaignLinks] = useQueries({
    queries: [
      {
        queryKey: ["campaignLink", campaignId],
        queryFn: () =>
          axiosInstance.get(`/campaign/${campaignId}/url`).then((res) => res.data.data),
      },
    ],
  });

  return (
    <div className="min-h-screen w-full bg-slate-50/50 dark:bg-slate-950 overflow-y-scroll scrollbar-slim">
      <div className="p-5 md:p-10 w-full mx-auto">
        <div className="flex flex-col justify-start items-start mb-8 gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Analytics</h1>
          <div className="flex gap-2 flex-row items-center">
            <Button variant="default" className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400 text-white dark:text-slate-950 rounded-lg font-medium shadow-sm">
              <CircleDot className="w-4 h-4 mr-2" />
              {campaignLinks.isPending ? "Loading..." : campaignLinks.data?.name || "unknown"}
            </Button>
            <AlertDeleteCampaignBtn campaignId={campaignId!} />
            <ReloadBtn />
          </div>
        </div>
        <ChartAreaInteractive campaignId={campaignId!} data={campaignLinks.data} />
        <div className="w-full rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800 p-6 mt-8 shadow-sm">
          <div className="flex flex-row items-center justify-between gap-3">
            <h2 className="text-lg font-semibold flex gap-2.5 items-center text-slate-800 dark:text-white">
              <div className="p-1.5 rounded-lg bg-teal-50 dark:bg-teal-500/10"><IconLink className="w-5 h-5 text-teal-600 dark:text-teal-400" /></div>
              Links
            </h2>
            <CreateLinkBtn campaignId={campaignId!} />
          </div>
          <div className="flex flex-row justify-start flex-wrap gap-3 w-full mt-5">
            {campaignLinks.isPending ? (
              <><CardSkeleton /><CardSkeleton /><CardSkeleton /></>
            ) : campaignLinks.data?.urls.length > 0 ? (
              campaignLinks.data.urls.map((linkData: { campaign_id: LinkCardI["campaign_id"]; original_url: LinkCardI["original_link"]; short_url: LinkCardI["short_link"]; createdAt: LinkCardI["created_at"]; }, index: number) => (
                <LinkCard key={index} campaign_id={campaignLinks.data?._id} original_link={linkData.original_url} short_link={linkData.short_url} created_at={linkData.createdAt} />
              ))
            ) : (
              <div className="flex flex-col justify-center items-center w-full text-slate-400 dark:text-slate-500 min-h-[100px] gap-2">
                <IconLink className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                <p className="text-sm font-medium">No links yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignAnalyticsPage;
