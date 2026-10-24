import { useCallback, useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ChartLine,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  UserRound,
} from "lucide-react";
import { Capacitor } from "@capacitor/core";
import { App as CapacitorApp } from "@capacitor/app";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { BrandMark } from "@/components/BrandMark";
import { ThemeMenu } from "@/components/ThemeMenu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import LoadingScreen from "@/components/LoadingScreen";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Analytics", href: "/analytics", icon: ChartLine },
  { label: "Settings", href: "/settings", icon: Settings },
] as const;

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function getInitials(email?: string, name?: string) {
  const source = name?.trim() || email?.split("@")[0] || "S";
  return source
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function NavigationLinks({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation();

  return (
    <nav aria-label="Primary" className="space-y-1">
      {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
        const active = isActivePath(location.pathname, href);
        return (
          <NavLink
            key={href}
            to={href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors",
              active
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon
              className={cn(
                "size-[1.15rem] shrink-0",
                active
                  ? "text-primary"
                  : "text-muted-foreground group-hover:text-foreground",
              )}
              aria-hidden="true"
            />
            {label}
          </NavLink>
        );
      })}
    </nav>
  );
}

function UserMenu({ compact = false }: { compact?: boolean }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logout();
      toast({
        title: "Signed out",
        description: "Your session ended safely.",
      });
      navigate(Capacitor.isNativePlatform() ? "/signin" : "/home", {
        replace: true,
      });
    } catch {
      toast({
        title: "Couldn't sign out",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Account menu"
          className={cn(
            "rounded-full transition-colors",
            compact ? "size-10" : "w-full",
          )}
        >
          {compact ? (
            <span className="mx-auto flex size-9 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
              {getInitials(user?.email, user?.name)}
            </span>
          ) : (
            <span className="flex min-h-14 items-center gap-3 rounded-xl px-2.5 py-2 text-left hover:bg-muted">
              {user?.profilePic ? (
                <img
                  src={user.profilePic}
                  alt=""
                  className="size-9 shrink-0 rounded-full object-cover"
                />
              ) : (
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                  {getInitials(user?.email, user?.name)}
                </span>
              )}
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-foreground">
                  {user?.name || "Your account"}
                </span>
                <span className="block truncate text-xs text-muted-foreground">
                  {user?.email}
                </span>
              </span>
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="w-60">
        <DropdownMenuLabel className="font-normal">
          <span className="block text-sm font-medium text-foreground">
            {user?.name || "Your account"}
          </span>
          <span className="mt-0.5 block truncate text-xs font-normal text-muted-foreground">
            {user?.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/settings" className="cursor-pointer">
            <UserRound className="size-4" />
            Account settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={isLoggingOut}
          onSelect={handleLogout}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="size-4" />
          {isLoggingOut ? "Signing out..." : "Sign out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="px-2">
        <BrandMark />
      </div>
      <div className="mt-7 flex-1 overflow-y-auto px-1">
        <p className="px-3 pb-2 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Workspace
        </p>
        <NavigationLinks onNavigate={onNavigate} />
      </div>
      <div className="space-y-3 border-t border-border/80 px-1 pt-3">
        <ThemeMenu />
        <UserMenu />
      </div>
    </div>
  );
}

function WebShell() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[16.5rem_minmax(0,1fr)]">
      <aside className="sticky top-0 hidden h-dvh border-r border-border/80 bg-sidebar px-4 py-5 lg:block">
        <SidebarContent />
      </aside>

      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/80 bg-background/90 px-4 backdrop-blur-xl lg:hidden">
        <BrandMark />
        <div className="flex items-center gap-1">
          <ThemeMenu compact />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMenuOpen(true)}
            aria-label="Open navigation"
          >
            <Menu className="size-5" />
          </Button>
        </div>
      </header>

      <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
        <DialogContent className="left-0 top-0 h-dvh w-[min(20rem,86vw)] max-w-none translate-x-0 translate-y-0 rounded-none border-y-0 border-l-0 border-r border-border bg-sidebar p-4 shadow-xl data-[state=closed]:slide-out-to-left-full data-[state=open]:slide-in-from-left-full">
          <DialogTitle className="sr-only">Navigation</DialogTitle>
          <DialogDescription className="sr-only">
            Move between dashboard, analytics, and settings.
          </DialogDescription>
          <SidebarContent onNavigate={() => setMenuOpen(false)} />
        </DialogContent>
      </Dialog>

      <main className="min-w-0">
        <Outlet />
      </main>
    </div>
  );
}

function NativeShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const segments = location.pathname.split("/").filter(Boolean);
  const isAnalyticsDetail =
    segments[0] === "analytics" && segments.length > 1;
  const hideTabs = isAnalyticsDetail;

  const title =
    segments[0] === "dashboard"
      ? "Dashboard"
      : segments[0] === "settings"
        ? "Settings"
        : segments[0] === "analytics"
          ? segments.length === 1
            ? "Analytics"
            : segments.length === 2
              ? "Campaign"
              : "Link"
          : "Shortwave";

  const goBack = useCallback(() => {
    const parts = location.pathname.split("/").filter(Boolean);
    if (parts[0] === "analytics" && parts.length === 3) {
      navigate(`/analytics/${parts[1]}`);
      return;
    }
    if (parts[0] === "analytics" && parts.length === 2) {
      navigate("/analytics");
      return;
    }
    if (parts[0] !== "dashboard") {
      navigate("/dashboard");
      return;
    }
    CapacitorApp.minimizeApp().catch(() => undefined);
  }, [location.pathname, navigate]);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    let disposed = false;
    let removeListener: (() => Promise<void>) | undefined;

    CapacitorApp.addListener("backButton", goBack).then((listener) => {
      if (disposed) {
        listener.remove();
      } else {
        removeListener = () => listener.remove();
      }
    });

    return () => {
      disposed = true;
      removeListener?.();
    };
  }, [goBack]);

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="pt-safe sticky top-0 z-30 border-b border-border/80 bg-background/92 backdrop-blur-xl">
        <div className="flex h-14 items-center justify-between gap-3 px-4">
          {isAnalyticsDetail ? (
            <button
              type="button"
              onClick={goBack}
              className="inline-flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-accent"
              aria-label="Go back"
            >
              <ArrowLeft className="size-5" />
            </button>
          ) : (
            <BrandMark showWordmark={false} />
          )}
          <p className="min-w-0 flex-1 truncate text-center text-sm font-semibold tracking-[-0.01em]">
            {title}
          </p>
          <div className="flex items-center gap-0.5">
            <ThemeMenu compact />
            <UserMenu compact />
          </div>
        </div>
      </header>

      <main
        className={cn(
          "min-w-0 flex-1",
          hideTabs
            ? "pb-safe"
            : "pb-[calc(4.5rem+var(--safe-area-inset-bottom,env(safe-area-inset-bottom,0px)))]",
        )}
      >
        <Outlet />
      </main>

      {hideTabs ? null : (
        <nav
          aria-label="Primary"
          className="pb-safe fixed inset-x-0 bottom-0 z-30 border-t border-border/80 bg-background/95 backdrop-blur-xl"
        >
          <div className="mx-auto flex h-[4.25rem] max-w-md items-stretch px-2">
            {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
              const active = isActivePath(location.pathname, href);
              return (
                <NavLink
                  key={href}
                  to={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-12 flex-1 flex-col items-center justify-center gap-1 rounded-xl text-[0.68rem] font-medium transition-colors",
                    active
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-7 w-12 items-center justify-center rounded-full transition-colors",
                      active ? "bg-accent" : "bg-transparent",
                    )}
                  >
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  {label}
                </NavLink>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}

export function DashboardLayout() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/signin", { replace: true });
    }
  }, [isLoading, navigate, user]);

  if (isLoading) return <LoadingScreen />;
  if (!user) return null;

  return Capacitor.isNativePlatform() ? <NativeShell /> : <WebShell />;
}

export default DashboardLayout;
