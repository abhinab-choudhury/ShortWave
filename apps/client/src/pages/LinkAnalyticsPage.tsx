import { AlertDeleteUrlBtn } from "@/components/AlertDeleteBtn";
import {
  InteractiveBarChartLabel,
  InteractiveBarChartMixed,
} from "@/components/InteractiveBarChart";
import { ChartLineInteractive } from "@/components/InteractiveLineChart";
import { useParams } from "react-router-dom";
import PageNotFound from "./PageNotFound";
import { IconCircleFilled } from "@tabler/icons-react";

const LinkAnalyticsPage = () => {
  const { campaignId, linkId } = useParams<{
    campaignId: string;
    linkId: string;
  }>();

  if (!campaignId || !linkId) {
    return <PageNotFound />;
  }

  return (
    <div className="min-h-screen w-full border border-slate-200 dark:border-slate-900 dark:bg-slate-900 overflow-y-scroll scrollbar-slim">
      <div className="p-2 md:p-10 mx-auto">
        <div className="flex flex-col justify-start items-start mb-6 gap-4">
          <div className="flex flex-row items-center gap-3">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Analytics
            </h1>

            <div
              className="flex flex-row align-middle items-center justify-between gap-2 px-4 py-1.5 rounded-2xl text-sm font-semibold
                bg-teal-500/10 backdrop-blur-lg border border-teal-500/30 shadow-sm
                text-teal-700 dark:text-teal-200
                dark:bg-teal-400/10 dark:border-teal-400/20
                transition-all duration-300 hover:scale-105 hover:shadow-md"
            >
              <IconCircleFilled className="w-3 h-3" />
              dbf0f4
            </div>
          </div>
          <div className="relative w-full flex gap-2 flex-row">
            <AlertDeleteUrlBtn campaignId={campaignId} urlId={linkId} />
          </div>
        </div>
        <div className="h-full min-h-[80vh] w-full">
          <ChartLineInteractive />
          <div className="md:flex gap-2">
            <InteractiveBarChartMixed className="my-2 md:w-[50%]" />
            <InteractiveBarChartLabel className="my-2 md:w-[50%]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkAnalyticsPage;
