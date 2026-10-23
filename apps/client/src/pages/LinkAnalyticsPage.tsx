import { useParams } from "react-router-dom";
import {
  InteractiveBarChartLabel,
  InteractiveBarChartMixed,
} from "@/components/InteractiveBarChart";
import { ChartLineInteractive } from "@/components/InteractiveLineChart";
import { AlertDeleteUrlBtn } from "@/components/AlertDeleteBtn";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import PageNotFound from "./PageNotFound";
import ReloadBtn from "@/components/ReloadBtn";

const LinkAnalyticsPage = () => {
  const { campaignId, shortUrl } = useParams<{
    campaignId: string;
    shortUrl: string;
  }>();

  if (!campaignId || !shortUrl) return <PageNotFound />;

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Link analytics"
        title="Per-link performance"
        description="Daily clicks by device and audience breakdown for this short link."
        back={{ to: `/analytics/${campaignId}`, label: "Back to campaign" }}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <ReloadBtn />
            <AlertDeleteUrlBtn campaignId={campaignId} shortUrl={shortUrl} />
          </div>
        }
      />

      <div className="mt-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
          <span className="font-mono">{shortUrl}</span>
        </div>
      </div>

      <div className="mt-6 grid gap-6">
        <ChartLineInteractive campaignId={campaignId} shortUrl={shortUrl} />
        <div className="grid gap-6 lg:grid-cols-2">
          <InteractiveBarChartMixed
            campaignId={campaignId}
            shortUrl={shortUrl}
          />
          <InteractiveBarChartLabel
            campaignId={campaignId}
            shortUrl={shortUrl}
          />
        </div>
      </div>
    </PageContainer>
  );
};

export default LinkAnalyticsPage;
