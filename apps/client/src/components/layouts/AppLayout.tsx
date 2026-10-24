import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { BrandMark } from "@/components/BrandMark";
import { ThemeMenu } from "@/components/ThemeMenu";
import { Button } from "@/components/ui/button";
import Footer from "../ui/footer";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  return (
    <main className="relative w-full">
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/88 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-10">
          <BrandMark to="/home" />
          <nav
            aria-label="Marketing"
            className="ml-auto hidden items-center gap-7 text-sm text-muted-foreground md:flex"
          >
            <a href="#features" className="transition-colors hover:text-foreground">
              Features
            </a>
            <a href="#workflow" className="transition-colors hover:text-foreground">
              How it works
            </a>
            <Link to="/signin" className="transition-colors hover:text-foreground">
              Sign in
            </Link>
          </nav>
          <div className="ml-auto flex items-center gap-1 md:ml-0">
            <ThemeMenu compact />
            <Button asChild size="sm">
              <Link to={user ? "/dashboard" : "/signin"}>
                {user ? "Open dashboard" : "Get started"}
              </Link>
            </Button>
          </div>
        </div>
      </header>
      {children}
      <Footer />
    </main>
  );
};

export default AppLayout;
