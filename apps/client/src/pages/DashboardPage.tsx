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
          className="group bg-gradient-to-br from-teal-50 to-white dark:from-slate-800/80 dark:to-slate-800/40 border-teal-100 dark:border-slate-700"
          title="Total Links Created"
          data={stats.total_links}
          footer="+10 this week"
          icon_styles="bg-teal-100 dark:bg-teal-500/15"
          icon={<Link2 className="w-5 h-5 text-teal-600 dark:text-teal-400" />}
        />
        <DashboardQuickInfoCard
          title="Click Rate Growth"
          data={stats.crg}
          className="group bg-gradient-to-br from-emerald-50 to-white dark:from-slate-800/80 dark:to-slate-800/40 border-emerald-100 dark:border-slate-700"
          footer="Since yesterday"
          icon_styles="bg-emerald-100 dark:bg-emerald-500/15"
          icon={<TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
        />
        <DashboardQuickInfoCard
          title="Active Links"
          data={stats.active_links}
          className="group bg-gradient-to-br from-indigo-50 to-white dark:from-slate-800/80 dark:to-slate-800/40 border-indigo-100 dark:border-slate-700"
          footer="Running this week"
          icon_styles="bg-indigo-100 dark:bg-indigo-500/15"
          icon={<Megaphone className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
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
      <div className="flex flex-col justify-center items-center col-span-full text-slate-400 dark:text-slate-500 min-h-[200px] gap-2">
        <TentIcon className="w-10 h-10 text-slate-300 dark:text-slate-600" />
        <p className="text-sm font-medium">No campaigns yet</p>
        <p className="text-xs text-slate-400 dark:text-slate-600">Create your first campaign to get started</p>
      </div>
    )
  }

  return (
    <div className="flex flex-1">
      <div className="font-sans p-5 md:p-8 lg:p-10 bg-slate-50/50 dark:bg-slate-950 flex-col gap-2 flex-1 w-full max-h-screen overflow-scroll scrollbar-slim">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">Overview of your link management activity</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          <StatCards />
        </div>

        <div className="flex flex-col mt-8 md:flex-row items-start md:items-center justify-between mb-6 gap-3">
          <div className="flex gap-2.5 w-full md:w-fit">
            <Button variant="outline" className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200">
              Filter <ListFilter className="w-4 h-4 ml-2 text-slate-400" />
            </Button>
            <Button variant="outline" className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200">
              Display <SlidersHorizontal className="w-4 h-4 ml-2 text-slate-400" />
            </Button>
          </div>

          <div className="flex gap-2.5 items-center w-full md:w-fit">
            <input
              className="h-10 px-3.5 border border-slate-200 dark:border-slate-700 rounded-lg text-sm leading-6 w-full md:w-64 bg-white dark:bg-slate-800 dark:text-white placeholder:text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 dark:focus:border-teal-400 transition-all duration-200"
              type="text"
              placeholder="Search campaigns..."
            />
            <CreateCampaign />
          </div>
        </div>

        <div className="flex flex-col gap-5 p-6 flex-1 border border-slate-200/60 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900/50 h-auto shadow-sm">
          <h2 className="text-lg md:text-xl font-semibold tracking-tight flex gap-2.5 items-center text-slate-800 dark:text-white">
            <div className="p-1.5 rounded-lg bg-teal-50 dark:bg-teal-500/10">
              <TentIcon className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            </div>
            Recent Campaigns
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full w-full">
            <CampaignCards />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
