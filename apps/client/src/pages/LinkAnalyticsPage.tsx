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
      <div className="p-2 md:p-10 max-w-7xl mx-auto">
        <div className="flex flex-col justify-start items-start mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Analytics
          </h1>
          <div className="relative flex gap-2 flex-col">
            <Select value={currentLink}>
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Select Link" />
              </SelectTrigger>
              <SelectContent className="w-full">
                <SelectGroup>
                  <SelectLabel>Links</SelectLabel>
                  {linkList.map((link, index) => (
                    <SelectItem value={link} key={index}>
                      {link}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="border rounded-xl h-full min-h-[80vh] w-full"></div>
      </div>
    </div>
  );
};

export default LinkAnalyticsPage;
