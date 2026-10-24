import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export function Cta() {
  const { user } = useAuth();

  return (
    <section className="bg-foreground text-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1fr_auto] lg:items-end lg:px-10">
        <div>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-primary">
            Ready when you are
          </p>
          <h2 className="mt-5 max-w-2xl font-display text-4xl leading-[1.02] tracking-[-0.03em] text-balance text-background sm:text-5xl lg:text-6xl">
            Make the next link count.
          </h2>
          <p className="mt-5 max-w-lg text-sm leading-6 text-background/65 sm:text-base sm:leading-7">
            Sign in, create a campaign, and let the click data tell you what
            happened. Shortwave stays out of the way.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="bg-background text-foreground hover:bg-background/90"
          >
            <Link to={user ? "/dashboard" : "/signin"}>
              {user ? "Open dashboard" : "Get started"}
              <ArrowRight className="ml-2 size-4" aria-hidden="true" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="ghost"
            className="border border-background/25 text-background hover:bg-background/10 hover:text-background"
          >
            <Link to="/signin">Sign in</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
