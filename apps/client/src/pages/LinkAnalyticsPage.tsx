import { AlertDeleteUrlBtn } from "@/components/AlertDeleteBtn";
import {
  InteractiveBarChartLabel,
  InteractiveBarChartMixed,
} from "@/components/InteractiveBarChart";
import { ChartLineInteractive } from "@/components/InteractiveLineChart";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

const LinkAnalyticsPage = () => {
  const [linkList, setLinkList] = useState<string[]>([]);
  const [currentLink, setCurrentLink] = useState<string>();

  useEffect(() => {
    setLinkList([
      "github.com/abhinab-choudhury",
      "fiver.com/abhinab",
      "upwork.com/abhinab",
    ]);
    setCurrentLink(linkList[0]);
  }, [linkList]);
  return (
    <div className="min-h-screen w-full border border-slate-200 dark:border-slate-900 dark:bg-slate-900 overflow-y-scroll scrollbar-slim">
      <div className="p-2 md:p-10 mx-auto">
        <div className="flex flex-col justify-start items-start mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Analytics
          </h1>
          <div className="relative flex gap-2 flex-row">
            <Select value={currentLink}>
              <SelectTrigger className="w-[280px] dark:bg-gray-800 shadow-none">
                <SelectValue placeholder="Select Link" />
              </SelectTrigger>
              <SelectContent className="w-full dark:bg-gray-800">
                <SelectGroup>
                  <SelectLabel>Links</SelectLabel>
                  {linkList.map((link, index) => (
                    <SelectItem
                      value={link}
                      key={index}
                      className=" focus:bg-gray-400/30 dark:focus:bg-teal-800"
                    >
                      {link}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <AlertDeleteUrlBtn campaignId="" />
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
