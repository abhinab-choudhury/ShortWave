"use client";

import { useEffect, useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconLayoutDashboard,
  IconSettings,
  IconChartCovariate,
} from "@tabler/icons-react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { axiosInstance, cn } from "@/lib/utils";
import { toast } from "../ui/use-toast";
import ShortwaveLogo from "/shortwave_logo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Moon, Sun, User } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import { Capacitor } from "@capacitor/core";

export function DashboardLayout() {
  const location = useLocation();

  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: (
        <IconLayoutDashboard className="text-slate-500 dark:text-slate-400 h-5 w-5 shrink-0" />
      ),
    },
    {
      label: "Analytics",
      href: "/analytics",
      icon: (
        <IconChartCovariate className="text-slate-500 dark:text-slate-400 h-5 w-5 shrink-0" />
      ),
    },
    {
      label: "Settings",
      href: "/settings",
      icon: (
        <IconSettings className="text-slate-500 dark:text-slate-400 h-5 w-5 shrink-0" />
      ),
    },
  ];
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { setTheme } = useTheme();
  const { user, refreshUser, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post("/auth/logout");
      if (response.status == 200) {
        toast({
          title: "Logged Out Successfull",
          description: "You're all set. Come back soon!",
        });
        await refreshUser();
        navigate(Capacitor.isNativePlatform() ? "/signin" : "/home");
      }
    } catch (error) {
      console.log("Error : ", error);
      toast({
        title: "Logout Unsuccessful",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isActive = (href: string) =>
    location.pathname === href || location.pathname.startsWith(href + "/");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/signin", { replace: true });
    }
  }, [navigate, user, authLoading]);

  return (
    <div
      className={cn(
        "relative flex flex-col md:flex-row w-full h-screen flex-1 mx-auto border border-slate-200 dark:border-slate-800 overflow-hidden",
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10 bg-white dark:bg-slate-900 pt-4 md:pt-8 overflow-visible border-r border-slate-200/60 dark:border-slate-800">
          <div className="flex flex-col flex-1">
            <Logo />
            <div className="mt-8 flex flex-col gap-1 h-fit">
              {links.map((link, idx) => (
                <div key={idx} className="relative">
                  {isActive(link.href) && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute left-0 top-0 bottom-0 w-0.75 rounded-r-full bg-teal-500 dark:bg-teal-400"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.4,
                      }}
                    />
                  )}
                  <SidebarLink link={link} />
                </div>
              ))}
              <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <ThemeButton setTheme={setTheme} />
                <button
                  disabled={isLoading ? true : false}
                  onClick={handleLogout}
                  className="flex items-center justify-start gap-2 group/sidebar w-full py-2 px-3 cursor-pointer rounded-lg transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-950/30 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400"
                >
                  <div className="rounded-lg p-1.5 bg-slate-100 dark:bg-slate-800 transition-colors group-hover/sidebar:bg-red-100 dark:group-hover/sidebar:bg-red-950/50">
                    <IconArrowLeft className="h-4 w-4 shrink-0" />
                  </div>
                  <div className="text-sm font-medium whitespace-pre inline-block p-0! m-0!">
                    Logout
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-auto w-full border-t border-slate-100 dark:border-slate-800 pt-3">
            <Link
              to="#"
              className="flex items-center justify-start gap-3 group/sidebar py-2 px-3 rounded-lg transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <div className="shrink-0">
                {user?.profilePic ? (
                  <img
                    src={user.profilePic || "/placeholder.svg"}
                    alt="Avatar"
                    className="h-9 w-9 rounded-full ring-2 ring-slate-200 dark:ring-slate-700 shadow-sm object-cover"
                  />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-linear-to-br from-teal-400 to-teal-600 flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                )}
              </div>

              <span className="w-full truncate text-slate-700 dark:text-slate-300 text-sm font-medium">
                <span>{user?.email || "User"}</span>
              </span>
            </Link>
          </div>
        </SidebarBody>
      </Sidebar>

      <Outlet />
    </div>
  );
}

function ThemeButton({
  setTheme,
}: {
  setTheme: (t: "dark" | "light" | "system") => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Toggle theme"
          className="flex w-full items-center justify-start gap-2 group/sidebar py-2 px-3 cursor-pointer rounded-lg transition-all duration-200 hover:bg-teal-50 dark:hover:bg-teal-500/10 text-teal-700 dark:text-teal-300"
        >
          <div className="rounded-lg p-1.5 bg-teal-50 dark:bg-teal-500/15 text-teal-600 dark:text-teal-300 transition-colors group-hover/sidebar:bg-teal-100 dark:group-hover/sidebar:bg-teal-500/25">
            <Sun className="h-4 w-4 dark:hidden" />
            <Moon className="hidden h-4 w-4 dark:block" />
          </div>
          <div className="text-sm font-medium whitespace-pre inline-block p-0! m-0!">
            Theme
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={4}
        className="z-[60] dark:bg-gray-800"
      >
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const Logo = () => {
  return (
    <Link to="/home" className="relative z-20 flex min-w-0 items-center gap-2.5 py-1">
      <img
        width={30}
        height={30}
        src={ShortwaveLogo || "/placeholder.svg"}
        alt="Shortwave Logo"
        className="h-7.5 w-7.5 shrink-0"
      />

      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="
          whitespace-nowrap
          font-sans
          text-xl
          font-bold
          tracking-tight
          text-teal-600
          dark:text-teal-400
        "
      >
        ShortWave
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      to="/"
      className="font-normal flex space-x-2 items-center text-sm text-gray-950 py-1 relative z-20"
    >
      <img
        width={30}
        height={30}
        src={ShortwaveLogo || "/placeholder.svg"}
        alt="Shortwave Logo"
      />
    </Link>
  );
};

export default DashboardLayout;