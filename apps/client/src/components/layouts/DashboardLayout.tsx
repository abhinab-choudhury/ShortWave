import { useEffect, useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconLayoutDashboard,
  IconSettings,
  IconChartCovariate,
} from "@tabler/icons-react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { axiosInstance, cn } from "@/lib/utils";
import { toast } from "../ui/use-toast";
import ShortwaveLogo from "/shortwave_logo.png";
import { ThemeToggle } from "../ui/theme-toggle";
import { useAuth } from "@/hooks/useAuth";
import { User } from "lucide-react";

export function DashboardLayout() {
  const links = [
    {
      label: "Dashboard",
      href: "dashboard",
      icon: (
        <IconLayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Analytics",
      href: "analytics",
      icon: (
        <IconChartCovariate className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Settings",
      href: "settings",
      icon: (
        <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];
  const animate = false;
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { user, refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post("/auth/logout");
      if (response.status == 200) {
        toast({
          title: "Logged Out Successfull",
          description: "You’re all set. Come back soon!",
        });
        await refreshUser();
        navigate("/home");
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

  useEffect(() => {
    if (!user) {
      navigate("/signin");
    }
  }, [navigate, user]);
  return (
    <div
      className={cn(
        "relative rounded-md flex flex-col md:flex-row  w-full h-screen flex-1 mx-auto border border-neutral-200 dark:border-gray-700 overflow-hidden",
      )}
    >
      <Sidebar open={open} setOpen={setOpen} animate={animate}>
        <SidebarBody className="justify-between gap-10 dark:bg-slate-800 pt-8 overflow-hidden">
          <div className="flex flex-col flex-1">
            <Logo />
            <div className="mt-8 flex flex-col gap-2 h-fit">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
              <button
                disabled={isLoading ? true : false}
                onClick={handleLogout}
                className="flex items-center justify-start gap-2 group/sidebar py-2 px-3 cursor-pointer rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                <div className="border border-gray-300 dark:border-slate-600 rounded-full p-2 bg-white dark:bg-slate-800 transition-colors">
                  <IconArrowLeft className="text-neutral-700 dark:text-slate-200 h-5 w-5 flex-shrink-0" />
                </div>
                <div className="text-neutral-700 dark:text-slate-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0">
                  Logout
                </div>
              </button>
            </div>
          </div>

          <div className="mt-auto w-full">
            <Link
              to="#"
              onClick={() => setOpen(!open)}
              className="flex items-center justify-start gap-2 group/sidebar py-2 px-3 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-slate-700"
            >
              <div className="p-2 rounded-full transition-colors text-neutral-500 dark:text-slate-300">
                {user?.profilePic ? (
                  <img
                    src={user.profilePic}
                    alt="Avatar"
                    className="-p-2 h-10 w-14 border rounded-full border-transparent shadow-sm object-cover dark:border-white"
                  />
                ) : (
                  <User className="h-8 w-8 rounded-full shadow-none object-cover" />
                )}
              </div>

              <motion.span
                animate={{
                  display: animate
                    ? open
                      ? "inline-block"
                      : "none"
                    : "inline-block",
                  opacity: animate ? (open ? 1 : 0) : 1,
                }}
                className="w-full truncate text-neutral-700 dark:text-slate-200 text-sm group-hover/sidebar:translate-x-1 transition-all duration-150 whitespace-pre inline-block !p-0 !m-0"
              >
                <span>{user?.email || "User"}</span>
              </motion.span>
            </Link>
          </div>
        </SidebarBody>
      </Sidebar>

      <Outlet />
    </div>
  );
}
export const Logo = () => {
  return (
    <div className="flex gap-3 justify-between mt-12 md:m-0">
      <Link
        to="/home"
        className="font-normal flex space-x-2 items-center text-sm text-gray-950 py-1 relative z-20"
      >
        <div className="flex gap-3">
          <img
            width={30}
            height={30}
            src={ShortwaveLogo}
            alt="Shortwave Logo"
          />
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-medium text-teal-600 text-xl dark:text-white whitespace-pre"
          >
            ShortWave
          </motion.span>
        </div>
      </Link>
      <ThemeToggle />
    </div>
  );
};
export const LogoIcon = () => {
  return (
    <Link
      to="/"
      className="font-normal flex space-x-2 items-center text-sm text-gray-950 py-1 relative z-20"
    >
      <img width={30} height={30} src={ShortwaveLogo} alt="Shortwave Logo" />
    </Link>
  );
};

export default DashboardLayout;
