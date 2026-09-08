import { cn } from "@/lib/utils";
import { Link, LinkProps, useLocation } from "react-router-dom";
import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { useSidebar } from "@/hooks/useSidebar";
import { SidebarProvider } from "@/providers/SidebarProvider";
import { ThemeToggle } from "./theme-toggle";

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as React.ComponentProps<"div">)} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <>
      <motion.div
        className={cn(
          "h-full px-4 py-4 hidden md:flex md:flex-col bg-neutral-100 dark:bg-slate-800 w-75 shrink-0",
          className,
        )}
        animate={{
          width: animate ? (open ? "300px" : "70px") : "300px",
        }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        {...props}
      >
        {children}
      </motion.div>
    </>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  const location = useLocation();

  // Always close the drawer when the active tab changes
  useEffect(() => {
    setOpen(false);
  }, [location.pathname, setOpen]);

  return (
    <>
      <div
        className={cn(
          "flex h-12 w-full shrink-0 items-center justify-between gap-3 px-4 md:hidden bg-neutral-100 dark:bg-slate-800",
        )}
        {...props}
      >
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-neutral-800 dark:text-neutral-200 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
        >
          <IconMenu2 className="h-5 w-5" />
        </button>

        <span className="text-sm font-semibold tracking-tight text-teal-600 dark:text-teal-400">
          ShortWave
        </span>

        <ThemeToggle />
      </div>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-90 backdrop-blur-sm md:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className={cn(
                "fixed h-full w-[80%] max-w-[300px] inset-y-0 left-0 bg-white dark:bg-slate-900 p-5 sm:p-6 z-100 flex flex-col justify-between overflow-y-auto shadow-2xl",
                className,
              )}
            >
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="absolute right-3 top-3 z-50 flex h-9 w-9 items-center justify-center rounded-lg text-neutral-800 dark:text-slate-200 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
              >
                <IconX className="h-5 w-5" />
              </button>
              {children}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links;
  className?: string;
  props?: LinkProps;
}) => {
  const location = useLocation();
  const { setOpen } = useSidebar();

  const isActive =
    location.pathname === link.href ||
    location.pathname.startsWith(link.href + "/");
  return (
    <Link
      to={link.href}
      onClick={() => setOpen(false)}
      className={cn(
        "flex items-center justify-start gap-2 group/sidebar py-2 px-3 rounded-md transition-colors",
        isActive
          ? "bg-gray-200 dark:bg-teal-800"
          : "hover:bg-gray-100 dark:hover:bg-slate-700",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "p-2 rounded-full transition-colors",
          isActive
            ? "bg-gray-300 dark:bg-teal-600 text-white"
            : "text-neutral-100 dark:text-slate-300",
        )}
      >
        {link.icon}
      </div>

      <span className="text-neutral-700 dark:text-slate-200 text-sm group-hover/sidebar:translate-x-1 transition-all duration-150 whitespace-pre inline-block p-0! m-0!">
        {link.label}
      </span>
    </Link>
  );
};
