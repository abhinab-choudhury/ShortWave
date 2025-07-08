import { IconBrandCampaignmonitor } from "@tabler/icons-react";
import CampaignCard, { CampaignCardI } from "@/components/CampaignCard";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useEffect, useState } from "react";

const AnalyticsPage = () => {
  const [linkList, setLinkList] = useState<CampaignCardI[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // const [campaign, setCampaign] = useState('Advertise Insights');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLinkList([
          {
            campaign_name: "Resume Links",
            page_link: "iamabhinab.xyz",
            created_at: "Dec 3, 2024",
          },
          {
            campaign_name: "Advertise Insights",
            page_link: "advertise-insights.in",
            created_at: "March 3, 2025",
          },
          {
            campaign_name: "ABC Studios",
            page_link: "abcstudios.in",
            created_at: "Feb 6, 2025",
          },
        ]);
      } catch (error) {
        console.error("Failed to fetch links:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen w-full border border-slate-200 dark:border-slate-900 dark:bg-slate-900 overflow-y-scroll scrollbar-slim">
      <div className="p-2 md:p-10 max-w-7xl mx-auto">
        <div className="flex flex-col justify-start items-start mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Analytics
          </h1>
        </div>

        <div className="flex flex-col p-4 gap-2 flex-1 border rounded-lg bg-gray-50 dark:bg-slate-900 min-h-[85vh] overflow-scroll scrollbar-slim">
          <h1 className="text-xl font-bold flex gap-2 text-slate-800 dark:text-white">
            <IconBrandCampaignmonitor />
            All Campaigns
          </h1>
          {isLoading ? (
            <div className="p-4 h-full w-full rounded-lg bg-gray-100 dark:bg-slate-800 animate-pulse">
              <div className="border rounded h-[82px] w-full bg-gray-300 dark:bg-slate-700 animate-pulse"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 h-full w-full">
              {linkList.length > 0 ? (
                linkList.map((linkData, index) => (
                  <CampaignCard
                    key={index}
                    campaign_name={linkData.campaign_name}
                    page_link={linkData.page_link}
                    created_at={linkData.created_at}
                  />
                ))
              ) : (
                <div className="flex justify-center items-center text-gray-500 dark:text-slate-400">
                  No links available.
                </div>
              )}
            </div>
          )}
          <div className="mt-auto">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    2
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
