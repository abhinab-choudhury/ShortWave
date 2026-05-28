import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { Link } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"

export function Hero() {
  const { user } = useAuth();

  return (
    <section className="relative py-16 px-6 sm:px-10 lg:py-24 lg:px-20 bg-gradient-to-b from-white via-teal-50/20 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 overflow-hidden">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-20 -right-32 h-[500px] w-[500px] rounded-full bg-teal-300/15 blur-3xl dark:bg-teal-500/5" />
        <div className="absolute -bottom-20 -left-32 h-[400px] w-[400px] rounded-full bg-cyan-300/10 blur-3xl dark:bg-cyan-500/5" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Text */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <Badge
              variant="outline"
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-400 px-3 py-1 text-xs font-medium"
            >
              Free URL Shortener
              <ArrowUpRight className="ml-1.5 size-3.5" aria-hidden="true" />
            </Badge>

            <h1 className="my-6 max-w-2xl text-balance text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold tracking-tight leading-[1.15]">
              Shorten, Share & <span className="bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">Analyze</span> Your Links.
              <br className="hidden sm:block" /> All in One Place.
            </h1>

            <p className="text-sm md:text-base leading-relaxed text-slate-500 dark:text-slate-400 mb-8 max-w-xl">
              ShortWave makes URL management effortless. 
            </p>

            <div className="flex w-full flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <Button asChild size="lg" className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white font-semibold shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] dark:bg-teal-500 dark:hover:bg-teal-400 dark:text-slate-950">
                {user ? (
                  <Link to="/dashboard">Dashboard</Link>
                ) : (
                  <Link to="/signin">Get Started</Link>
                )}
              </Button>
              <Button
                asChild size="lg" variant="outline"
                className="w-full sm:w-auto border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 bg-transparent transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Link to="https://github.com/abhinab-choudhury/ShortWave" target="_blank">
                  GitHub
                  <ArrowRight className="size-4 ml-1" aria-hidden="true" />
                </Link>
              </Button>
            </div>

            <div className="mt-10 text-center lg:text-left">
              <p className="text-xs font-medium uppercase tracking-widest text-slate-400 dark:text-slate-500">Built with open-source technologies</p>
              <div className="mt-3 flex flex-wrap gap-2 justify-center lg:justify-start">
                {["shadcn-ui-icon", "typescript-icon", "react-icon", "tailwind-icon"].map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex h-9 items-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-sm shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105"
                  >
                    <img
                      src={`https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/${tech}.svg`}
                      alt={`${tech.replace("-", " ")} logo`}
                      className="h-4 w-4"
                    />
                  </span>
                ))}
              </div>
            </div>
          </div>

          <DashboardPreview />
        </div>
      </div>
    </section>
  )
}

function DashboardPreview() {
  return (
    <div className="relative mx-auto w-full max-w-2xl rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden transition-transform duration-500 hover:scale-[1.02]">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
        <div className="flex gap-2" aria-hidden="true">
          <span className="h-3 w-3 rounded-full bg-red-400" />
          <span className="h-3 w-3 rounded-full bg-amber-400" />
          <span className="h-3 w-3 rounded-full bg-emerald-400" />
        </div>
        <div className="text-[10px] font-medium text-slate-400 dark:text-slate-500">shortwave.app</div>
        <div className="w-14" />
      </div>

      <div className="relative">
        <img src={"/hero-image.png"} alt="Dashboard preview" className="w-full h-auto" />
        <div className="absolute bottom-4 right-4 bg-teal-600 text-white text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-md backdrop-blur-sm">
          Real-time Tracking
        </div>
      </div>
    </div>
  )
}