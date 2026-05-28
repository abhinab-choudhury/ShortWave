import React from "react";
import { Toaster } from "../ui/toaster";
import ShortwaveLogo from "/shortwave_logo.png";
import { Link } from "react-router-dom";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="relative p-6 sm:p-8 min-h-screen flex flex-col overflow-hidden bg-gradient-to-br from-slate-50 via-teal-50/30 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/4 -right-1/4 h-[600px] w-[600px] rounded-full bg-teal-400/10 blur-3xl dark:bg-teal-500/5" />
        <div className="absolute -bottom-1/4 -left-1/4 h-[500px] w-[500px] rounded-full bg-sky-400/10 blur-3xl dark:bg-sky-500/5" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center flex-1 gap-8">
        {/* Logo */}
        <Link to="/home" className="flex items-center gap-2.5 group">
          <img
            width={40}
            height={40}
            src={ShortwaveLogo}
            alt="Shortwave Logo"
            className="transition-transform duration-300 group-hover:scale-110"
          />
          <span className="text-2xl font-bold tracking-tight text-teal-600 dark:text-teal-400">
            ShortWave
          </span>
        </Link>

        {children}
      </div>
      <Toaster />
    </main>
  );
};

export default AuthLayout;
