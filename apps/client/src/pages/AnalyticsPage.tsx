import { useQuery } from "@tanstack/react-query";
import { BarChart3 } from "lucide-react";
import { axiosInstance } from "@/lib/utils";
import CampaignCard from "@/components/CampaignCard";
import { CardSkeleton } from "@/components/CardSkeleton";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import CreateCampaign from "@/components/CreateCampaignBtn";

interface CampaignCardI {
  name: string;
  description: string;
  _id: string;
  createdAt: string;
}

const AnalyticsPage = () => {
  const campaigns = useQuery<{ data: CampaignCardI[] }>({
    queryKey: ["campaigns"],
    queryFn: () => axiosInstance.get("/campaign").then((res) => res.data),
  });

  const items = campaigns.data?.data ?? [];

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Analytics"
        title="All campaigns"
        description="Pick a campaign to see daily clicks, devices, browsers, and locations."
        actions={<CreateCampaign />}
      />

      <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {campaigns.isPending ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : campaigns.isError ? (
          <div className="sm:col-span-2 xl:col-span-3">
            <ErrorState
              title="Couldn't load campaigns"
              description="Campaign list is unavailable right now."
              onRetry={() => campaigns.refetch()}
            />
          </div>
        ) : items.length === 0 ? (
          <div className="sm:col-span-2 xl:col-span-3">
            <EmptyState
              icon={<BarChart3 className="size-5" />}
              title="No campaigns yet"
              description="Create a campaign and add your first short link to start collecting clicks."
              action={<CreateCampaign />}
            />
          </div>
        ) : (
          items.map((campaign) => (
            <CampaignCard
              key={campaign._id}
              name={campaign.name}
              description={campaign.description}
              _id={campaign._id}
              createdAt={campaign.createdAt}
            />
          ))
        )}
      </div>
    </PageContainer>
  );
};

export default AnalyticsPage;
