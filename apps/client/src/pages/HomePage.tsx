import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import AppLayout from "@/components/layouts/AppLayout";
import { useAuth } from "@/hooks/useAuth";

const Home = () => {
  const { user } = useAuth();

  return (
    <AppLayout>
      {/* Hero Section */}
      <section className="relative py-12 px-6 sm:px-10 lg:py-18 lg:px-20 bg-gradient-to-b from-white to-teal-50 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Text Column */}
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <Badge
                variant="outline"
                className="bg-white/70 dark:bg-slate-700/40 backdrop-blur-md border-teal-500 text-teal-700 dark:text-teal-400"
              >
                Free URL Shortener
                <ArrowUpRight className="ml-2 size-4" />
              </Badge>
              <h1 className="my-6 text-pretty text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white lg:text-6xl">
                Shorten, Share & Analyze Your Links. All in One Place
              </h1>
              <p className="text-muted-foreground mb-8 max-w-xl text-base lg:text-lg">
                ShortWave makes URL management effortless. Track clicks, monitor
                campaigns, and gain valuable insights with our privacy-friendly
                analytics — for free.
              </p>
              <div className="flex w-full flex-col justify-center gap-3 sm:flex-row lg:justify-start">
                <Button
                  asChild
                  size="lg"
                  className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700"
                >
                  {user ? (
                    <Link to="/dashboard">Dashboard</Link>
                  ) : (
                    <Link to="/signin">Get Started</Link>
                  )}
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-teal-600 text-teal-600 hover:bg-teal-50 dark:border-teal-400 dark:text-teal-400 dark:hover:bg-slate-800"
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
              <div className="mt-10 flex flex-col flex-wrap items-center justify-center gap-4 lg:justify-start">
                <p className="font-medium text-muted-foreground lg:text-left">
                  Built with open-source technologies
                </p>
                <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
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
                        "group flex aspect-square h-12 items-center justify-center rounded-xl bg-white dark:bg-slate-800 p-0 shadow-sm hover:shadow-md transition",
                      )}
                    >
                      <img
                        src={`https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/${tech}.svg`}
                        alt={`${tech} logo`}
                        className="h-6"
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
                className="max-h-[26rem] w-full rounded-2xl border shadow-xl object-cover"
              />
              <div className="absolute -bottom-4 right-4 bg-teal-600 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-md">
                Real-time Tracking
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Analytics Section */}
      <section className="bg-teal-100/50 dark:bg-slate-800 dark:text-teal-950">
        <div className="mx-auto max-w-screen-xl">
          <div className="mx-auto">
            <div className="agrid-rows-[repeat(2,_minmax(1px,fit-content))] grid grid-cols-1 gap-10 text-center sm:mx-auto sm:max-w-sm md:pb-20 md:h-[68rem] md:max-w-full md:grid-cols-2 md:grid-rows-5 md:text-left">
              <div className="row-span-3 bg-teal-200 md:px-8 rounded-xl p-10">
                <img
                  className="h mx-auto object-contain md:ml-0 rounded-md my-10"
                  src="/hero-image.png"
                />
                <div>
                  <h3 className="text-4xl">Intuitive Dashboard</h3>
                  <p className="mt-6 text-base">
                    Experience a clean, powerful dashboard that puts all your
                    link management tools at your fingertips with real-time
                    updates.
                  </p>
                  <button className="mt-4 rounded-lg bg-teal-700 px-6 py-2 text-white transition hover:translate-y-1">
                    Learn more
                  </button>
                </div>
              </div>

              <div className="row-span-2 bg-teal-200 md:flex md:flex-col rounded-xl md:justify-center md:px-8 p-10">
                <div>
                  <h3 className="text-4xl">Interactive Graph Views</h3>
                  <p className="mt-6 text-base">
                    Visualize your data with beautiful, interactive charts that
                    reveal patterns and insights at a glance.
                  </p>
                  <button className="mt-4 rounded-lg bg-teal-700 px-6 py-2 text-white transition hover:translate-y-1">
                    Learn more
                  </button>
                </div>
              </div>

              <div className="row-span-3 bg-teal-200 md:flex md:flex-col md:justify-center rounded-xl md:px-8 p-10">
                <img
                  className="mx-auto object-contain md:ml-0 border rounded-md my-10"
                  src="/hero-image.png"
                />
                <div>
                  <h3 className="text-4xl">QR Code Integration</h3>
                  <p className="mt-6 text-base">
                    Generate beautiful, customizable QR codes instantly for any
                    shortened link, perfect for offline campaigns.
                  </p>
                  <button className="mt-4 rounded-lg bg-teal-700 px-6 py-2 text-white transition hover:translate-y-1">
                    Learn more
                  </button>
                </div>
              </div>

              <div className="row-span-2 bg-teal-200 md:flex md:flex-col md:justify-center rounded-xl md:px-8 p-10">
                <div>
                  <h3 className="text-4xl">Clean UI/UX</h3>
                  <p className="mt-6 text-base">
                    Polished and Clean UI/UX, with best user experience
                  </p>
                  <button className="mt-4 rounded-lg bg-teal-700 px-6 py-2 text-white transition hover:translate-y-1">
                    Learn more
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="relative bg-teal-50 dark:bg-slate-900 py-16 text-teal-900 dark:text-white">
        <div className="mx-auto max-w-3xl text-center px-6">
          <div className="mb-6 inline-flex h-12 w-12 text-teal-600 dark:text-teal-400">
            <svg
              viewBox="0 0 136 217"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M30.6 105.4c-3 .2-5.8.4-8.7.5-4.5.3-9 .6-13.6.8-1 .1-2 .1-3 0-3.9-.4-6.1-3.5-5.3-7.3.1-.4.2-.8.4-1.1 4.5-11.8 7.7-23.9 10.7-36.2 3.4-13.5 6.9-27 10.3-40.4.7-2.6 1.5-5.3 2.2-7.8 1-3.5 3-5.7 7.1-6.1 4-.4 7.9-1.1 11.9-1.4 18-1.1 36-2.9 54-5 4.5-.5 9-.9 13.6-1.2 1.6-.1 3.2 0 4.7.4 3.8.9 5.4 4.5 4 8.1-.5 1.1-1.2 2.1-1.9 3.1-1.8 2.8-3.7 5.7-5.6 8.5-4.6 7.8-9.1 15.6-13.8 23.4-4.8 7.8-9.6 15.6-14.2 23.4-1.4 2.2-2.8 4.5-4.2 6.7-.4.6-.8 1.3-1.4 2.3h2.2c8.3.1 16.7.1 25 .2.6 0 1.3.1 1.9.2 3.8.8 5.6 4.5 4.2 8.1-.5 1.3-1.2 2.5-2 3.5-4.1 5.4-8.3 10.8-12.5 16.3-1.9 2.6-3.6 5.3-5.1 8.1-8.1 15.4-16.1 31-24.1 46.6-8 15.9-16.1 31.9-24.3 47.8-.6 1.2-1.3 2.4-2.3 3.4-2.4 2.5-5.6 2.3-8.1 0-1.8-1.7-2.7-3.7-2.8-6.4-.3-4.5-.7-9.1-.6-13.6.3-16.4.9-32.8 1.2-49.1.2-11.1.2-22.2.3-33.3z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            Now Free for Early Birds
          </h2>
          <p className="mt-4 text-lg font-medium text-slate-700 dark:text-slate-300">
            Everyone who signs up before the beta launch, will get 6 months free
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6 lg:mt-12">
            <button className="rounded-lg border-2 border-teal-600 bg-teal-600 px-6 py-2 font-medium text-white transition hover:bg-teal-700">
              Try for free
            </button>
            <button className="rounded-lg border-2 border-teal-600 px-6 py-2 font-medium text-teal-600 hover:bg-teal-50 dark:border-teal-400 dark:text-teal-400 dark:hover:bg-slate-800">
              Choose a Plan
            </button>
          </div>

          <p className="mt-6 text-base text-slate-600 dark:text-slate-400">
            Already have an account?{" "}
            <a
              href="#"
              title=""
              className="text-teal-600 dark:text-teal-400 hover:underline"
            >
              Log in
            </a>
          </p>
        </div>
      </section>
    </AppLayout>
  );
};

export default Home;
