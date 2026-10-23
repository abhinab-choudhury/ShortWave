import { useQuery } from "@tanstack/react-query";
import { Plus, Sparkles, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { axiosInstance } from "@/lib/utils";
import CreateCampaign from "@/components/CreateCampaignBtn";
import CampaignCard from "@/components/CampaignCard";
import { CardSkeleton } from "@/components/CardSkeleton";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { Button } from "@/components/ui/button";

interface DashboardStats {
  total_links: number | string;
  crg: number | string;
  active_links: number | string;
}

interface RecentCampaign {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
}

const DashboardPage = () => {
  const dashboardStats = useQuery<{
    data: DashboardStats;
  }>({
    queryKey: ["dashboardStats"],
    queryFn: () => axiosInstance.get("/campaign/stats").then((res) => res.data),
  });

  const recentLinks = useQuery<{
    data: { links: RecentCampaign[] };
  }>({
    queryKey: ["recentLinks"],
    queryFn: () => axiosInstance.get("/campaign/recent").then((res) => res.data),
  });

  const stats = dashboardStats.data?.data;
  const campaigns = recentLinks.data?.data?.links ?? [];

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Overview"
        title="Dashboard"
        description="Campaigns, links, and a quick read on what's active right now."
        actions={<CreateCampaign />}
      />

      <section className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {dashboardStats.isPending ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : dashboardStats.isError ? (
          <div className="sm:col-span-2 xl:col-span-3">
            <ErrorState
              title="Couldn't load stats"
              description="Campaign totals are unavailable right now."
              onRetry={() => dashboardStats.refetch()}
            />
          </div>
        ) : (
          <>
            <StatCard
              label="Total links"
              value={stats?.total_links ?? 0}
              hint="Short links created across all campaigns"
              icon={<Plus className="size-4" aria-hidden="true" />}
              tone="primary"
            />
            <StatCard
              label="Click growth"
              value={typeof stats?.crg === "string" && stats.crg.includes("%") ? stats.crg : `${stats?.crg ?? 0}%`}
              hint="Day-over-day click growth"
              icon={<Sparkles className="size-4" aria-hidden="true" />}
              tone="sand"
            />
            <StatCard
              label="Active links"
              value={stats?.active_links ?? 0}
              hint="Currently within their scheduled window"
              icon={<BarChart3 className="size-4" aria-hidden="true" />}
              tone="blue"
            />
          </>
        )}
      </section>

      <section className="mt-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-[-0.01em]">
              Recent campaigns
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Jump straight into analytics for your newest groups.
            </p>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link to="/analytics">View all analytics</Link>
          </Button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {recentLinks.isPending ? (
            <>
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </>
          ) : recentLinks.isError ? (
            <div className="sm:col-span-2 xl:col-span-3">
              <ErrorState
                title="Couldn't load campaigns"
                description="Recent campaigns are unavailable right now."
                onRetry={() => recentLinks.refetch()}
              />
            </div>
          ) : campaigns.length === 0 ? (
            <div className="sm:col-span-2 xl:col-span-3">
              <EmptyState
                icon={<Plus className="size-5" />}
                title="Create your first campaign"
                description="Group short links together to track clicks by device, browser, location, and time."
                action={<CreateCampaign />}
              />
            </div>
          ) : (
            campaigns.map((campaign) => (
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
      </section>
    </PageContainer>
  );
};

export default DashboardPage;
