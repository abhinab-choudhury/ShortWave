import { cn } from "@/lib/utils";
import { Link, LinkProps, useLocation } from "react-router-dom";
import React, { useEffect } from "react";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { useSidebar } from "@/hooks/useSidebar";
import { SidebarProvider } from "@/providers/SidebarProvider";

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

export const SidebarBody = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <>
      <DesktopSidebar className={className} {...props}>
        {children}
      </DesktopSidebar>
      <MobileSidebar>{children}</MobileSidebar>
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <aside
      className={cn(
        "hidden h-full w-[300px] shrink-0 flex-col bg-neutral-100 px-4 py-4 dark:bg-slate-800 md:flex",
        className,
      )}
      {...props}
    >
      {children}
    </aside>
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
          "flex h-12 w-full shrink-0 items-center gap-3 bg-neutral-100 px-4 dark:bg-slate-800 md:hidden",
          className,
        )}
        {...props}
      >
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-neutral-800 transition-colors hover:bg-black/5 dark:text-neutral-200 dark:hover:bg-white/10"
        >
          <IconMenu2 className="h-5 w-5" />
        </button>
      </div>
      <div
        aria-hidden={!open}
        className={cn(
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setOpen(false)}
      />

      <div
        aria-hidden={!open}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-full w-[80%] max-w-[300px] flex-col justify-between overflow-y-auto bg-white p-5 transition-transform duration-300 ease-in-out dark:bg-slate-900 sm:p-6 md:hidden",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="absolute right-3 top-3 z-50 flex h-9 w-9 items-center justify-center rounded-lg text-neutral-800 transition-colors hover:bg-black/5 dark:text-slate-200 dark:hover:bg-white/10"
        >
          <IconX className="h-5 w-5" />
        </button>
        {children}
      </div>
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