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
          axiosInstance
            .get(`/campaign/${campaignId}/url`)
            .then((res) => res.data.data),
      },
    ],
  });

  return (
    <div className="min-h-screen w-full bg-slate-50/50 dark:bg-slate-950 overflow-y-auto overflow-x-hidden scrollbar-slim">
      <div className="p-4 sm:p-6 md:p-8 lg:p-10 w-full mx-auto max-w-[1600px]">
        <div className="flex flex-col justify-start items-start mb-6 sm:mb-8 gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Analytics
          </h1>
          <div className="flex flex-wrap gap-2 items-center w-full">
            <Button
              variant="default"
              className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400 text-white dark:text-slate-950 rounded-lg font-medium shadow-sm h-9 sm:h-10 text-xs sm:text-sm px-3 sm:px-4 max-w-full truncate"
            >
              <CircleDot className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 shrink-0" />
              <span className="truncate">
                {campaignLinks.isPending
                  ? "Loading..."
                  : campaignLinks.data?.name || "unknown"}
              </span>
            </Button>
            <div className="flex gap-2 shrink-0">
              <AlertDeleteCampaignBtn campaignId={campaignId!} />
              <ReloadBtn />
            </div>
          </div>
        </div>
        <ChartAreaInteractive
          campaignId={campaignId!}
          data={campaignLinks.data}
        />
        <div className="w-full rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800 p-4 sm:p-6 mt-6 sm:mt-8 shadow-sm">
          <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3">
            <h2 className="text-base sm:text-lg font-semibold flex gap-2 sm:gap-2.5 items-center text-slate-800 dark:text-white">
              <div className="p-1 sm:p-1.5 rounded-lg bg-teal-50 dark:bg-teal-500/10 shrink-0">
                <IconLink className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 dark:text-teal-400" />
              </div>
              Links
            </h2>
            <div className="shrink-0 self-start xs:self-auto">
              <CreateLinkBtn campaignId={campaignId!} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 w-full mt-4 sm:mt-5">
            {campaignLinks.isPending ? (
              <>
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
              </>
            ) : campaignLinks.data?.urls.length > 0 ? (
              campaignLinks.data.urls.map(
                (
                  linkData: {
                    campaign_id: LinkCardI["campaign_id"];
                    original_url: LinkCardI["original_link"];
                    short_url: LinkCardI["short_link"];
                    createdAt: LinkCardI["created_at"];
                  },
                  index: number,
                ) => (
                  <LinkCard
                    key={index}
                    campaign_id={campaignLinks.data?._id}
                    original_link={linkData.original_url}
                    short_link={linkData.short_url}
                    created_at={linkData.createdAt}
                  />
                ),
              )
            ) : (
              <div className="flex flex-col justify-center items-center w-full col-span-full text-slate-400 dark:text-slate-500 min-h-[120px] sm:min-h-[140px] gap-2 py-6">
                <IconLink className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                <p className="text-sm font-medium">No links yet</p>
                <p className="text-xs text-slate-400 dark:text-slate-600">
                  Create your first short link
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignAnalyticsPage;
