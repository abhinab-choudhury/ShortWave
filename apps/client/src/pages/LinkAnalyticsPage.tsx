import { AlertDeleteUrlBtn } from "@/components/AlertDeleteBtn";
import { InteractiveBarChartLabel, InteractiveBarChartMixed } from "@/components/InteractiveBarChart";
import { ChartLineInteractive } from "@/components/InteractiveLineChart";
import { useParams } from "react-router-dom";
import PageNotFound from "./PageNotFound";
import { IconCircleFilled } from "@tabler/icons-react";
import ReloadBtn from "@/components/ReloadBtn";

const LinkAnalyticsPage = () => {
  const { campaignId, shortUrl } = useParams<{ campaignId: string; shortUrl: string }>();
  if (!campaignId || !shortUrl) return <PageNotFound />;

  return (
    <div className="min-h-screen w-full bg-slate-50/50 dark:bg-slate-950 overflow-y-auto overflow-x-hidden scrollbar-slim">
      <div className="p-4 sm:p-6 md:p-8 lg:p-10 mx-auto max-w-[1600px]">
        <div className="flex flex-col justify-start items-start mb-6 sm:mb-8 gap-3">
          <div className="flex flex-col xs:flex-row xs:items-center gap-2 sm:gap-3 w-full">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white shrink-0">Analytics</h1>
            <div className="flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-teal-500/10 backdrop-blur-sm border border-teal-500/20 text-teal-700 dark:text-teal-300 dark:bg-teal-400/10 dark:border-teal-400/20 transition-all duration-300 hover:shadow-sm max-w-full">
              <IconCircleFilled className="w-2 h-2 sm:w-2.5 sm:h-2.5 shrink-0" />
              <span className="truncate font-mono text-xs sm:text-sm">{shortUrl}</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <AlertDeleteUrlBtn campaignId={campaignId} shortUrl={shortUrl} />
            <ReloadBtn />
          </div>
        </div>
        <div className="space-y-4 sm:space-y-6">
          <ChartLineInteractive campaignId={campaignId} shortUrl={shortUrl} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
            <InteractiveBarChartMixed campaignId={campaignId} shortUrl={shortUrl} className="" />
            <InteractiveBarChartLabel campaignId={campaignId} shortUrl={shortUrl} className="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkAnalyticsPage;
