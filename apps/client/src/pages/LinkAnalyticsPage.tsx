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
    <div className="min-h-screen w-full bg-slate-50/50 dark:bg-slate-950 overflow-y-scroll scrollbar-slim">
      <div className="p-5 md:p-10 mx-auto">
        <div className="flex flex-col justify-start items-start mb-8 gap-3">
          <div className="flex flex-row items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Analytics</h1>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-semibold bg-teal-500/10 backdrop-blur-sm border border-teal-500/20 text-teal-700 dark:text-teal-300 dark:bg-teal-400/10 dark:border-teal-400/20 transition-all duration-300 hover:scale-105 hover:shadow-sm">
              <IconCircleFilled className="w-2.5 h-2.5" />
              {shortUrl}
            </div>
          </div>
          <div className="flex gap-2 flex-row">
            <AlertDeleteUrlBtn campaignId={campaignId} shortUrl={shortUrl} />
            <ReloadBtn />
          </div>
        </div>
        <div className="space-y-6">
          <ChartLineInteractive campaignId={campaignId} shortUrl={shortUrl} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InteractiveBarChartMixed campaignId={campaignId} shortUrl={shortUrl} className="" />
            <InteractiveBarChartLabel campaignId={campaignId} shortUrl={shortUrl} className="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkAnalyticsPage;
