import React from "react";
import { Link } from "react-router-dom";
import { BrandMark } from "@/components/BrandMark";
import { ThemeMenu } from "@/components/ThemeMenu";
import { Toaster } from "../ui/toaster";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="relative min-h-dvh overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 paper-grid opacity-60" />
      <div className="relative z-10 mx-auto grid min-h-dvh w-full max-w-7xl lg:grid-cols-[1.05fr_0.95fr]">
        <div className="hidden flex-col justify-between border-r border-border/70 px-10 py-8 lg:flex xl:px-16">
          <div className="flex items-center justify-between">
            <BrandMark to="/home" />
            <ThemeMenu compact />
          </div>

          <div className="max-w-lg py-16">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Link intelligence
            </p>
            <h1 className="mt-5 font-display text-5xl leading-[1.02] tracking-[-0.03em] text-balance xl:text-6xl">
              Every link is a small story about your audience.
            </h1>
            <p className="mt-6 max-w-md text-pretty text-base leading-7 text-muted-foreground">
              Shortwave keeps the links short and the context long: campaigns,
              click trends, devices, browsers, and locations in one calm
              workspace.
            </p>
            <div className="mt-9 grid gap-3 text-sm text-muted-foreground">
              {[
                "Organise links into focused campaigns",
                "See clicks by day, device, browser, and country",
                "Customise and export QR cards",
              ].map((item) => (
                <p key={item} className="flex items-center gap-3">
                  <span className="size-1.5 rounded-full bg-primary" />
                  {item}
                </p>
              ))}
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Secure, passwordless sign-in. Built for short links.
          </p>
        </div>

        <div className="flex min-w-0 flex-col px-4 py-5 sm:px-8 lg:px-10">
          <div className="flex items-center justify-between lg:hidden">
            <BrandMark to="/home" />
            <ThemeMenu compact />
          </div>
          <div className="flex flex-1 items-center justify-center py-10">
            <div className="w-full max-w-md">{children}</div>
          </div>
          <p className="text-center text-xs text-muted-foreground lg:hidden">
            <Link to="/home" className="underline-offset-4 hover:underline">
              Back to home
            </Link>
          </p>
        </div>
      </div>
      <Toaster />
    </main>
  );
};

export default AuthLayout;
