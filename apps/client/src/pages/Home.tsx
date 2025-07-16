import AppLayout from "@/components/layouts/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const Home = () => {
  const { user } = useAuth();

  return (
    <AppLayout>
      {/* Hero Section */}
      <section className="py-24 px-20 bg-gradient-to-br from-white to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Text Column */}
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <Badge
                variant="outline"
                className="bg-white/70 dark:bg-slate-700/40 backdrop-blur-md"
              >
                Free URL Shortener
                <ArrowUpRight className="ml-2 size-4" />
              </Badge>
              <h1 className="my-6 text-pretty text-4xl font-extrabold tracking-tight lg:text-6xl">
                Shorten, Share & Analyze Your Links. All in One Place
              </h1>
              <p className="text-muted-foreground mb-8 max-w-xl text-base lg:text-xl">
                ShortWave makes URL management effortless. Track clicks, monitor
                campaigns, and gain valuable insights with our privacy-friendly
                analytics — for free.
              </p>
              <div className="flex w-full flex-col justify-center gap-3 sm:flex-row lg:justify-start">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  {user ? (
                    <Link to={"/dashboard"}>Dashboard</Link>
                  ) : (
                    <Link to={"/signin"}>Get Started</Link>
                  )}
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  <a
                    href="https://github.com/abhinab-choudhury/ShortWave"
                    target="_blank"
                  >
                    GitHub
                    <ArrowRight className="size-4 ml-1" />
                  </a>
                </Button>
              </div>
              <div className="mt-8 flex flex-col flex-wrap items-center justify-center gap-4 lg:justify-start">
                <p className="font-medium text-muted-foreground lg:text-left">
                  Built with open-source technologies
                </p>
                <div className="flex flex-wrap gap-2 justify-start">
                  {[
                    "shadcn-ui-icon",
                    "typescript-icon",
                    "react-icon",
                    "tailwind-icon",
                  ].map((tech, i) => (
                    <a
                      key={i}
                      href="#"
                      className={cn(
                        buttonVariants({ variant: "secondary" }),
                        "group dark:bg-white flex aspect-square h-12 items-center justify-center p-0",
                      )}
                    >
                      <img
                        src={`https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/${tech}.svg`}
                        alt={`${tech} logo`}
                        className="h-6 transition-all"
                      />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Visual Column */}
            <div className="relative w-full flex justify-center">
              <img
                src="/hero-image.png"
                alt="ShortWave Dashboard Preview"
                className="max-h-[28rem] w-full rounded-xl border shadow-xl object-cover"
              />
              <div className="absolute -bottom-3 right-4 bg-teal-500 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-md">
                Real-time Tracking
              </div>
            </div>
          </div>
        </div>
      </section>
    </AppLayout>
  );
};

export default Home;
