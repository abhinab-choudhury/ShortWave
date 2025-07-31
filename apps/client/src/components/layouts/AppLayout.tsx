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
      <header className="bg-white dark:bg-slate-800 top-0 sticky z-10">
        <div className="mx-auto flex h-16 max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:px-8">
          <Link
            className="flex gap-2 items-center text-teal-600 dark:text-teal-300"
            to="/home"
          >
            <img
              width={40}
              height={40}
              src={ShortwaveLogo}
              alt="Shortwave Logo"
            />
            <span className="text-xl font-bold">ShortWave</span>
          </Link>

          <div className="flex gap-2 ml-auto">
            <div className="sm:flex sm:gap-4">
              <ThemeToggle />
            </div>
            <div className="sm:flex sm:gap-4">
              <Link
                className="block rounded-md bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700 dark:hover:bg-teal-500"
                to={user ? "/dashboard" : "/signin"}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>
      {children}
      <Footer />
    </main>
  );
};

export default AppLayout;
