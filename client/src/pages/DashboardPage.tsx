import CampaignCard, { CampaignCardProps } from '@/components/CampaignCard';
import { useEffect, useState } from 'react';
import isEqual from 'lodash/isEqual';
import {
  Link2,
  ListFilter,
  Megaphone,
  PlusCircle,
  SlidersHorizontal,
  TrendingUp,
} from 'lucide-react';
import { IconBrandCampaignmonitor } from '@tabler/icons-react';

export async function getLink(): Promise<CampaignCardProps[]> {
  return [
    {
      campaign_name: 'Resume Links',
      page_link: 'iamabhinab.xyz',
      created_at: 'Dec 3, 2024',
    },
    {
      campaign_name: 'Advertise Insights',
      page_link: 'advertise-insights.in',
      created_at: 'March 3, 2025',
    },
    {
      campaign_name: 'ABC Studios',
      page_link: 'abcstudios.in',
      created_at: 'Feb 6, 2025',
    },
  ];
}

const DashboardPage = () => {
  const [linkList, setLinkList] = useState<CampaignCardProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const cachedDate: string | null = localStorage.getItem('dashboardLink');
      try {
        if (cachedDate) {
          const parshedData = JSON.parse(cachedDate);
          if (isEqual(parshedData, linkList)) {
            setLinkList(parshedData);
            setIsLoading(false);

            return;
          }
        }
        const data = await getLink();
        setLinkList(data);
        localStorage.setItem('dashboardLink', JSON.stringify(data));
      } catch (error) {
        console.error('Failed to fetch links:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  });

  return (
    <div className="flex flex-1">
      <div className="p-2 md:p-10 border bg-white dark:bg-slate-900 flex-col gap-2 flex-1 w-full max-h-screen overflow-scroll scrollbar-slim">
        <h1 className="text-2xl font-bold">Links</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {/* Card 1: Total Shortened Links */}
          <div className="group bg-gradient-to-br from-teal-100 to-teal-50 dark:from-slate-800 dark:to-slate-700 p-5 rounded-2xl shadow-md border border-teal-200 dark:border-slate-600 transition hover:shadow-lg hover:-translate-y-1 duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-teal-800 dark:text-teal-300">
                  Total Links Created
                </p>
                <h2 className="text-3xl font-bold text-teal-900 dark:text-white mt-1">
                  1,200
                </h2>
              </div>
              <div className="bg-teal-200 dark:bg-teal-600/20 p-3 rounded-full">
                <Link2 className="w-6 h-6 text-teal-700 dark:text-teal-300" />
              </div>
            </div>
            <p className="mt-3 text-xs text-teal-700/70 dark:text-slate-400">
              +102 this week
            </p>
          </div>

          {/* Card 2: Click Growth Rate */}
          <div className="group bg-gradient-to-br from-green-100 to-green-50 dark:from-slate-800 dark:to-slate-700 p-5 rounded-2xl shadow-md border border-green-200 dark:border-slate-600 transition hover:shadow-lg hover:-translate-y-1 duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-300">
                  Click Rate Growth
                </p>
                <h2 className="text-3xl font-bold text-green-900 dark:text-white mt-1">
                  +83.9%
                </h2>
              </div>
              <div className="bg-green-200 dark:bg-green-600/20 p-3 rounded-full">
                <TrendingUp className="w-6 h-6 text-green-700 dark:text-green-300" />
              </div>
            </div>
            <p className="mt-3 text-xs text-green-700/70 dark:text-slate-400">
              Since yesterday
            </p>
          </div>

          {/* Card 3: Active Campaigns */}
          <div className="group bg-gradient-to-br from-indigo-100 to-indigo-50 dark:from-slate-800 dark:to-slate-700 p-5 rounded-2xl shadow-md border border-indigo-200 dark:border-slate-600 transition hover:shadow-lg hover:-translate-y-1 duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-indigo-800 dark:text-indigo-300">
                  Active Campaigns
                </p>
                <h2 className="text-3xl font-bold text-indigo-900 dark:text-white mt-1">
                  25
                </h2>
              </div>
              <div className="bg-indigo-200 dark:bg-indigo-600/20 p-3 rounded-full">
                <Megaphone className="w-6 h-6 text-indigo-700 dark:text-indigo-300" />
              </div>
            </div>
            <p className="mt-3 text-xs text-indigo-700/70 dark:text-slate-400">
              Running this week
            </p>
          </div>
        </div>
        <div className="flex flex-col mt-5 md:flex-row items-start md:items-center justify-between mb-6 gap-3">
          {/* Filter + Display Buttons */}
          <div className="flex gap-2 w-full md:w-fit">
            <button className="flex items-center gap-2 px-3 py-2 h-10 border border-primary rounded-md text-sm text-primary hover:bg-primary hover:text-white transition">
              Filter
              <ListFilter className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-2 px-3 py-2 h-10 border border-primary rounded-md text-sm text-primary hover:bg-primary hover:text-white transition">
              Display
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Search + Create Button */}
          <div className="flex gap-2 items-center w-full md:w-fit">
            <input
              className="h-10 px-3 border border-gray-300 dark:border-slate-600 rounded-md text-sm w-full md:w-64 bg-white dark:bg-slate-800 dark:text-white placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              type="text"
              placeholder="Search..."
            />
            <button className="h-10 px-4 py-2 rounded-md border border-primary bg-primary text-muted hover:bg-primary/90 active:scale-95 transition">
              <PlusCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="flex flex-col p-4 gap-2 flex-1 border rounded-lg bg-gray-50 dark:bg-slate-900 min-h-[23rem] h-auto">
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
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
