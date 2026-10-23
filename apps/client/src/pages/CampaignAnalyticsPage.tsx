import { useQuery } from "@tanstack/react-query";
import { Link2 } from "lucide-react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "@/lib/utils";
import CreateLinkBtn from "@/components/CreateLinkBtn";
import { AlertDeleteCampaignBtn } from "@/components/AlertDeleteBtn";
import LinkCard from "@/components/LinkCard";
import { CardSkeleton } from "@/components/CardSkeleton";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { ChartAreaInteractive } from "@/components/InteractiveAreaChart";
import ReloadBtn from "@/components/ReloadBtn";

interface LinkRecord {
  campaign_id: string;
  original_url: string;
  short_url: string;
  createdAt: string;
}

interface CampaignRecord {
  _id: string;
  name: string;
  urls?: LinkRecord[];
}

const CampaignAnalyticsPage = () => {
  const { campaignId } = useParams();

  const campaignLinks = useQuery<CampaignRecord>({
    queryKey: ["campaignLink", campaignId],
    queryFn: () =>
      axiosInstance
        .get(`/campaign/${campaignId}/url`)
        .then((res) => res.data.data),
    enabled: Boolean(campaignId),
  });

  const urls = campaignLinks.data?.urls ?? [];

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Campaign"
        title={campaignLinks.data?.name || "Campaign analytics"}
        description="Daily clicks and every short link created for this campaign."
        back={{ to: "/analytics", label: "Back to campaigns" }}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <ReloadBtn />
            <CreateLinkBtn campaignId={campaignId!} />
            <AlertDeleteCampaignBtn campaignId={campaignId!} />
          </div>
        }
      />

      <div className="mt-8">
        {campaignLinks.isError ? (
          <ErrorState
            title="Couldn't load campaign"
            description="Campaign details are unavailable right now."
            onRetry={() => campaignLinks.refetch()}
          />
        ) : (
          <ChartAreaInteractive
            campaignId={campaignId!}
            data={campaignLinks.data}
          />
        )}
      </div>

      <section className="mt-10">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-[-0.01em]">Links</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Copy, share as a QR card, or open per-link analytics.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {campaignLinks.isPending ? (
            <>
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </>
          ) : urls.length === 0 ? (
            <div className="md:col-span-2 xl:col-span-3">
              <EmptyState
                icon={<Link2 className="size-5" />}
                title="No short links yet"
                description="Add your first destination URL to start tracking clicks for this campaign."
                action={<CreateLinkBtn campaignId={campaignId!} />}
              />
            </div>
          ) : (
            urls.map((link) => (
              <LinkCard
                key={link.short_url}
                campaign_id={campaignLinks.data?._id || campaignId!}
                original_link={link.original_url}
                short_link={link.short_url}
                created_at={link.createdAt}
              />
            ))
          )}
        </div>
      </section>
    </PageContainer>
  );
};

export default CampaignAnalyticsPage;
