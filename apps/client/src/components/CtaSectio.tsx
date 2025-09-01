import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export function Cta() {
  return (
    <section className="relative py-16 bg-slate-50 dark:bg-slate-900 dark:border dark:border-teal-950">
      <div className="mx-auto max-w-3xl text-center px-6">
        <div
          className="mb-6 inline-flex h-12 w-12 items-center justify-center text-teal-600 dark:text-teal-400"
          aria-hidden="true"
        >
          <svg viewBox="0 0 136 217" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="h-12 w-12">
            <path d="M30.6 105.4c-3 .2-5.8.4-8.7.5-4.5.3-9 .6-13.6.8-1 .1-2 .1-3 0-3.9-.4-6.1-3.5-5.3-7.3.1-.4.2-.8.4-1.1 4.5-11.8 7.7-23.9 10.7-36.2 3.4-13.5 6.9-27 10.3-40.4.7-2.6 1.5-5.3 2.2-7.8 1-3.5 3-5.7 7.1-6.1 4-.4 7.9-1.1 11.9-1.4 18-1.1 36-2.9 54-5 4.5-.5 9-.9 13.6-1.2 1.6-.1 3.2 0 4.7.4 3.8.9 5.4 4.5 4 8.1-.5 1.1-1.2 2.1-1.9 3.1-1.8 2.8-3.7 5.7-5.6 8.5-4.6 7.8-9.1 15.6-13.8 23.4-4.8 7.8-9.6 15.6-14.2 23.4-1.4 2.2-2.8 4.5-4.2 6.7-.4.6-.8 1.3-1.4 2.3h2.2c8.3.1 16.7.1 25 .2.6 0 1.3.1 1.9.2 3.8.8 5.6 4.5 4.2 8.1-.5 1.3-1.2 2.5-2 3.5-4.1 5.4-8.3 10.8-12.5 16.3-1.9 2.6-3.6 5.3-5.1 8.1-8.1 15.4-16.1 31-24.1 46.6-8 15.9-16.1 31.9-24.3 47.8-.6 1.2-1.3 2.4-2.3 3.4-2.4 2.5-5.6 2.3-8.1 0-1.8-1.7-2.7-3.7-2.8-6.4-.3-4.5-.7-9.1-.6-13.6.3-16.4.9-32.8 1.2-49.1.2-11.1.2-22.2.3-33.3z" />
          </svg>
        </div>

        <h2 className="text-4xl md:text-5xl font-bold leading-tight">Now Free for Early Birds</h2>
        <p className="mt-4 text-sm md:text-base leading-relaxed text-muted-foreground">
          Everyone who signs up before the beta launch will get 6 months free.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6 lg:mt-12">
          <Button asChild className="bg-teal-600 hover:bg-teal-700 text-white">
            <Link to="/signin">Try for free</Link>
          </Button>
        </div>

        <p className="mt-6 text-sm md:text-base leading-relaxed text-muted-foreground">
          Already have an account?{" "}
          <Link to="/signin" className="text-teal-600 dark:text-teal-400 underline-offset-4 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </section>
  )
}
