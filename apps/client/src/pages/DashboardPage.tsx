import { useEffect } from "react"
import DashboardQuickInfoCard from "@/components/DashoardQuickInfoCard"
import CampaignCard, { type CampaignCardI } from "@/components/CampaignCard"
import CreateCampaign from "@/components/CreateCampaignBtn"
import { Link2, ListFilter, Megaphone, SlidersHorizontal, TentIcon, TrendingUp } from "lucide-react"
import { CardSkeleton } from "@/components/CardSkeleton"
import { Button } from "@/components/ui/button"
import { axiosInstance } from "@/lib/utils"
import { useQueries } from "@tanstack/react-query"
import { toast } from "@/components/ui/use-toast"

const DashboardPage = () => {
  const [recentLinks, dashboardStats] = useQueries({
    queries: [
      {
        queryKey: ["recentLinks"],
        queryFn: () => axiosInstance.get("/campaign/recent").then((res) => res.data),
      },
      {
        queryKey: ["dashboardStats"],
        queryFn: () => axiosInstance.get("/campaign/stats").then((res) => res.data),
      },
    ],
  })

  useEffect(() => {
    if (recentLinks.isError) {
      toast({
        variant: "default",
        title: "❌ failed to fetch recent links",
        description: recentLinks.error?.message,
      })
    }
    if (dashboardStats.isError) {
      toast({
        variant: "default",
        title: "❌ Failed to fetch Dashboard Stats",
        description: dashboardStats.error?.message,
      })
    }
  }, [recentLinks, dashboardStats])

  const StatCards = () => {
    if (dashboardStats.isPending) {
      return (
        <>
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </>
      )
    }

    const stats = dashboardStats.data?.data
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
          icon={<TrendingUp className="w-6 h-6 text-green-700 dark:text-green-300" />}
        />
        <DashboardQuickInfoCard
          title="Active Links"
          data={stats.active_links}
          className="group bg-gradient-to-br from-indigo-100 to-indigo-50 dark:from-slate-800 dark:to-slate-700 border-indigo-200 dark:border-slate-600"
          footer="Running this week"
          icon_styles="bg-indigo-200 dark:bg-indigo-600/20"
          icon={<Megaphone className="w-6 h-6 text-indigo-700 dark:text-indigo-300" />}
        />
      </>
    )
  }

  const CampaignCards = () => {
    return recentLinks.isPending ? (
      <>
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </>
    ) : recentLinks.data?.data?.links.length > 0 ? (
      recentLinks.data?.data?.links.map((link: CampaignCardI, index: number) => (
        <CampaignCard
          key={index}
          name={link.name}
          description={link.description}
          _id={link._id}
          createdAt={link.createdAt}
        />
      ))
    ) : (
      <div className="flex justify-center items-center col-span-full text-gray-500 dark:text-slate-400 min-h-[200px]">
        No links available.
      </div>
    )
  }

  return (
    <div className="flex flex-1">
      <div className="font-sans p-4 md:p-8 border bg-white dark:bg-slate-900 flex-col gap-2 flex-1 w-full max-h-screen overflow-scroll scrollbar-slim">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 dark:text-white">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <StatCards />
        </div>

        <div className="flex flex-col mt-5 md:flex-row items-start md:items-center justify-between mb-6 gap-3">
          <div className="flex gap-3 w-full md:w-fit">
            <Button variant="outline" className="dark:bg-gray-700 bg-transparent">
              Filter <ListFilter className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline" className="dark:bg-gray-700 bg-transparent">
              Display <SlidersHorizontal className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="flex gap-3 items-center w-full md:w-fit">
            <input
              className="h-10 px-3 border border-gray-300 dark:border-slate-600 rounded-md text-sm leading-6 w-full md:w-64 bg-white dark:bg-slate-800 dark:text-white placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              type="text"
              placeholder="Search..."
            />
            <CreateCampaign />
          </div>
        </div>

        <div className="flex flex-col gap-4 p-6 flex-1 border rounded-xl bg-gray-50 dark:bg-slate-900 h-auto">
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight flex gap-2 text-slate-800 dark:text-white">
            <TentIcon /> Recent Campaigns
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full w-full">
            <CampaignCards />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
