import React from "react";
import Footer from "../ui/footer";
import { Link } from "react-router-dom";
import ShortwaveLogo from "/shortwave_logo.png";
import { ThemeToggle } from "../ui/theme-toggle";
import { useAuth } from "@/hooks/useAuth";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  return (
    <main className="relative w-full">
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl top-0 sticky z-50 border-b border-slate-200/60 dark:border-slate-700/50">
        <div className="mx-auto flex h-16 max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:px-8">
          <Link
            className="flex gap-2.5 items-center text-teal-600 dark:text-teal-400 group"
            to="/home"
          >
            <img
              width={36}
              height={36}
              src={ShortwaveLogo}
              alt="Shortwave Logo"
              className="transition-transform duration-300 group-hover:scale-110"
            />
            <span className="text-xl font-bold tracking-tight">ShortWave</span>
          </Link>

          <div className="flex gap-3 ml-auto items-center">
            <ThemeToggle />
            <Link
              className="inline-flex items-center rounded-lg bg-teal-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-teal-700 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] dark:bg-teal-500 dark:hover:bg-teal-400"
              to={user ? "/dashboard" : "/signin"}
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>
      {children}
      <Footer />
    </main>
  );
};

export default AppLayout;
