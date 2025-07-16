import { useEffect, useState } from "react";
import DashboardQuickInfoCard from "@/components/DashoardQuickInfoCard";
import CampaignCard, { CampaignCardI } from "@/components/CampaignCard";
import {
  ChevronLeft,
  ChevronRight,
  Link2,
  ListFilter,
  Megaphone,
  PlusCircle,
  SlidersHorizontal,
  TentIcon,
  TrendingUp,
} from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardSkeleton } from "@/components/CardSkeleton";
import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/lib/utils";
import { useQueries } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";

const DashboardPage = () => {
  const [recentLinks, dashboardStats] = useQueries({
    queries: [
      {
        queryKey: ["recentLinks"],
        queryFn: () =>
          axiosInstance.get("/campaign/recent").then((res) => res.data),
      },
      {
        queryKey: ["dashboardStats"],
        queryFn: () =>
          axiosInstance.get("/campaign/stats").then((res) => res.data),
      },
    ],
  });

  useEffect(() => {
    if (recentLinks.isError) {
      toast({
        variant: "default",
        title: "❌ failed to fetch recent links",
        description: recentLinks.error?.message,
      });
    }
    if (dashboardStats.isError) {
      toast({
        variant: "default",
        title: "❌ Failed to fetch Dashboard Stats",
        description: dashboardStats.error?.message,
      });
    }
  }, [recentLinks, dashboardStats]);

  const StatCards = () => {
    if (dashboardStats.isPending) {
      return (
        <>
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </>
      );
    }

    const stats = dashboardStats.data?.data;
    return (
      <>
        <DashboardQuickInfoCard
          className="group bg-gradient-to-br from-teal-100 to-teal-50 dark:from-slate-800 dark:to-slate-700 border-teal-200 dark:border-slate-600"
          title="Total Links Created"
          data={stats.total_links}
          footer="+10 this week"
          icon_styles="bg-teal-200 dark:bg-teal-600/20"
          icon={<Link2 className="w-6 h-6 text-teal-700 dark:text-teal-300" />}
        />
        <DashboardQuickInfoCard
          title="Click Rate Growth"
          data={stats.crg}
          className="group bg-gradient-to-br from-green-100 to-green-50 dark:from-slate-800 dark:to-slate-700 border-green-200 dark:border-slate-600"
          footer="Since yesterday"
          icon_styles="bg-green-200 dark:bg-green-600/20"
          icon={
            <TrendingUp className="w-6 h-6 text-green-700 dark:text-green-300" />
          }
        />
        <DashboardQuickInfoCard
          title="Active Campaigns"
          data={stats.active_campaigns}
          className="group bg-gradient-to-br from-indigo-100 to-indigo-50 dark:from-slate-800 dark:to-slate-700 border-indigo-200 dark:border-slate-600"
          footer="Running this week"
          icon_styles="bg-indigo-200 dark:bg-indigo-600/20"
          icon={
            <Megaphone className="w-6 h-6 text-indigo-700 dark:text-indigo-300" />
          }
        />
      </>
    );
  };

  const CampaignCards = () => {
    if (recentLinks.isPending) {
      return (
        <>
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </>
      );
    }

    const links = recentLinks.data?.data?.links ?? [];

    if (links.length === 0) {
      return (
        <div className="flex justify-center items-center col-span-full text-gray-500 dark:text-slate-400 min-h-[200px]">
          No links available.
        </div>
      );
    }
    return links.map((link: CampaignCardI, index: number) => (
      <CampaignCard
        key={index}
        name={link.name}
        description={link.description}
        _id={link._id}
        createdAt={link.createdAt}
      />
    ));
  };

  return (
    <div className="flex flex-1">
      <div className="p-2 md:p-10 border bg-white dark:bg-slate-900 flex-col gap-2 flex-1 w-full max-h-screen overflow-scroll scrollbar-slim">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <StatCards />
        </div>

        <div className="flex flex-col mt-5 md:flex-row items-start md:items-center justify-between mb-6 gap-3">
          <div className="flex gap-2 w-full md:w-fit">
            <Button variant="outline">
              Filter <ListFilter className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline">
              Display <SlidersHorizontal className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="flex gap-2 items-center w-full md:w-fit">
            <input
              className="h-10 px-3 border border-gray-300 dark:border-slate-600 rounded-md text-sm w-full md:w-64 bg-white dark:bg-slate-800 dark:text-white placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              type="text"
              placeholder="Search..."
            />
            <CreateCampaign />
          </div>
        </div>

        <div className="flex flex-col p-4 gap-2 flex-1 border rounded-lg bg-gray-50 dark:bg-slate-900 min-h-[23rem] h-auto">
          <h1 className="text-xl font-bold flex gap-2 text-slate-800 dark:text-white">
            <TentIcon /> Recent Campaigns
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 h-full w-full">
            <CampaignCards />
          </div>

          <Button
            variant="outline"
            className="w-fit mx-auto flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Show More
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

function CreateCampaign() {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);

  const handleSubmit = async () => {
    console.log("Clicked");
    setIsSending(true);
    try {
      const response = await axiosInstance.post("/campaign", {
        name,
        description,
      });
      if (response.status == 201) {
        toast({
          variant: "default",
          title: "New event created successfully",
        });
      }
    } catch (err) {
      console.log("Error : ", err);
      toast({
        variant: "destructive",
        title: "Failed to create a new event!!!!",
      });
    } finally {
      setName("");
      setDescription("");
      setIsSending(false);
    }
  };

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="default">
            <PlusCircle className="text-white" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Campaign</DialogTitle>
            <DialogDescription>
              Create a new campaign, where you group all your related links.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="campaign_name">Name</Label>
              <Input
                id="campaign_name"
                name="name"
                value={name}
                onChange={(event) => setName(event.currentTarget.value)}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="campaign_description">Description</Label>
              <Textarea
                className="h-20 resize-none"
                id="campaign_description"
                name="description"
                value={description}
                onChange={(event) => setDescription(event.currentTarget.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSubmit} disabled={isSending} type="submit">
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

export default DashboardPage;
