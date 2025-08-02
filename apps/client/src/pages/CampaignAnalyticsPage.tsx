import { CircleDot } from "lucide-react";
import LinkCard, { LinkCardI } from "@/components/LinkCard";
import { Button } from "@/components/ui/button";
import { IconLink } from "@tabler/icons-react";
import AlertDeleteBtn from "@/components/AlertDeleteBtn";
import ChartCard from "@/components/AnalyticsChartCard";
import CreateLinkBtn from "@/components/CreateLinkBtn";
import { useQueries } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/utils";
import { useParams } from "react-router-dom";
import { CardSkeleton } from "@/components/CardSkeleton";

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
    <div className="min-h-screen w-full border border-slate-200 dark:border-slate-900 dark:bg-slate-900 overflow-y-scroll scrollbar-slim">
      <div className="p-2 md:p-10 w-full mx-auto">
        <div className="flex flex-col justify-start items-start mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Analytics
          </h1>
          <div className="relative flex gap-2 flex-row justify-between">
            <Button variant={"default"}>
              <CircleDot className="w-4 h-4 mr-2 bg-transparent" />
              {campaignLinks.isPending
                ? "Loading..."
                : campaignLinks.data?.name || "unknown"}
            </Button>
            <AlertDeleteBtn campaignId={campaignId!} />
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
          <div className="flex flex-row items-center align-middle justify-between gap-3">
            <h1 className="text-xl font-bold flex gap-2 text-slate-800 dark:text-white mt-4 mb-6">
              <IconLink />
              Links
            </h1>
            <CreateLinkBtn campaignId={campaignId!} />
          </div>
          <div className="flex flex-row justify-start flex-wrap gap-x-3 w-full">
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
                    _id: LinkCardI["link_id"];
                    campaign_id: LinkCardI["campaign_id"];
                    original_url: LinkCardI["original_link"];
                    short_url: LinkCardI["short_link"];
                    createdAt: LinkCardI["created_at"];
                  },
                  index: number,
                ) => (
                  <LinkCard
                    key={index}
                    link_id={linkData._id}
                    campaign_id={linkData.campaign_id}
                    original_link={linkData.original_url}
                    short_link={linkData.short_url}
                    created_at={linkData.createdAt}
                  />
                ),
              )
            ) : (
              <div className="flex justify-center items-center text-gray-500 dark:text-slate-400">
                No links available.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignAnalyticsPage;
