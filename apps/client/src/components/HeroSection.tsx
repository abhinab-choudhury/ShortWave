import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { Link } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"

export function Hero() {
  const { user } = useAuth();

  return (
    <section className="relative py-12 px-6 sm:px-10 lg:py-18 lg:px-20 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          {/* Text */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <Badge
              variant="outline"
              className="bg-background/80 backdrop-blur-sm border-teal-600 text-teal-700 dark:text-teal-400"
            >
              Free URL Shortener
              <ArrowUpRight className="ml-2 size-4" aria-hidden="true" />
            </Badge>

            <h1 className="my-6 max-w-2xl text-balance text-4xl md:text-5xl font-bold tracking-tight leading-tight">
              Shorten, Share & <span className="text-teal-600 dark:text-teal-400">Analyze</span> Your Links.
              <br className="hidden sm:block" /> All in One Place.
            </h1>

            <p className="text-sm md:text-base leading-relaxed text-muted-foreground mb-8 max-w-xl">
              ShortWave makes URL management effortless. Track clicks, monitor campaigns, and gain valuable insights
              with privacy-friendly analytics — for free.
            </p>

            <div className="flex w-full flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <Button asChild size="lg" className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white">
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
                className="w-full sm:w-auto border-teal-600 text-teal-600 hover:bg-teal-50 dark:border-teal-400 dark:text-teal-400 dark:hover:bg-accent/20 bg-transparent"
              >
                <Link to="https://github.com/abhinab-choudhury/ShortWave" target="_blank">
                  GitHub
                  <ArrowRight className="size-4 ml-1" aria-hidden="true" />
                </Link>
              </Button>
            </div>

            <div className="mt-8 text-center lg:text-left">
              <p className="font-medium text-muted-foreground">Built with open-source technologies</p>
              <div className="mt-3 flex flex-wrap gap-2 justify-center lg:justify-start">
                {["shadcn-ui-icon", "typescript-icon", "react-icon", "tailwind-icon"].map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex h-10 items-center rounded-md border dark:bg-gray-700 px-3 text-sm shadow-2xs"
                  >
                    <img
                      src={`https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/${tech}.svg`}
                      alt={`${tech.replace("-", " ")} logo`}
                      className="h-5"
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
    <div className="relative mx-auto w-full max-w-2xl rounded-2xl shadow-sm border bg-white">
      <div className="flex items-center justify-between px-4 py-2 rounded-t-2xl border-b bg-slate-400/10">
        <div className="flex gap-2" aria-hidden="true">
          <span className="h-3 w-3 rounded-full bg-red-500" />
          <span className="h-3 w-3 rounded-full bg-yellow-400" />
          <span className="h-3 w-3 rounded-full bg-green-500" />
        </div>
      </div>

      <div className="rounded-b-2xl overflow-hidden">
        <img
          src={"/hero-image.png"}
          alt="Dashboard preview"
          className="w-full h-auto"
        />
        <div className="absolute bottom-4 right-4 bg-teal-600 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow">
          Real-time Tracking
        </div>
      </div>
    </div>
  )
}