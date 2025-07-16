import { CircleDot } from "lucide-react";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LinkCard, { LinkCardI } from "@/components/LinkCard";
import { Button } from "@/components/ui/button";
import { IconLink } from "@tabler/icons-react";
import AlertDeleteBtn from "@/components/AlertDeleteBtn";
import ChartCard from "@/components/AnalyticsChartCard";
import CreateLinkBtn from "@/components/CreateLinkBtn";

const CampaignAnalyticsPage = () => {
  const [linkList, setLinkList] = useState<LinkCardI[]>([]);
  // const [isLoading, setIsLoading] = useState<boolean>(true);
  const [campaign, setCampaign] = useState("Advertise Insights");

  const campaignList = ["Resume Link", "Advertise Insights", "ABC Studios"];
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLinkList([
          {
            orginal_link: "github.com/abhinab-choudhury",
            short_link: "short.link/abhinab",
            created_at: "11th Nov 2024",
          },
          {
            orginal_link: "github.com/hkirat",
            short_link: "short.link/hkirat",
            created_at: "2nd Dec 2023",
          },
          {
            orginal_link: "github.com/XBastile",
            short_link: "short.link/xbastile",
            created_at: "5th Dec 2025",
          },
          {
            orginal_link: "github.com/XBastille/DeepFX-Studio",
            short_link: "short.link/deepfx",
            created_at: "23rd Oct 2025",
          },
        ]);
      } catch (error) {
        console.error("Failed to fetch links:", error);
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
          <div className="relative flex gap-2 flex-row justify-between">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={"default"}>
                  <CircleDot className="w-4 h-4 mr-2 bg-transparent" />
                  {campaign || "Select Campaign"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-lg">
                <DropdownMenuLabel className="text-xs uppercase text-slate-500 dark:text-slate-400 px-3 py-2">
                  Choose Campaign
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="border-t border-slate-200 dark:border-slate-700" />
                <DropdownMenuRadioGroup
                  value={campaign}
                  onValueChange={setCampaign}
                >
                  {campaignList.map((camp, index) => (
                    <DropdownMenuRadioItem
                      key={index}
                      value={camp}
                      className="px-8 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-sm"
                    >
                      {camp}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <AlertDeleteBtn />
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
            <CreateLinkBtn />
          </div>
          <div className="flex flex-row justify-start flex-wrap gap-x-3 w-full">
            {linkList.length > 0 ? (
              linkList.map((linkData, index) => (
                <LinkCard
                  key={index}
                  orginal_link={linkData.orginal_link}
                  short_link={linkData.short_link}
                  created_at={linkData.created_at}
                />
              ))
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
