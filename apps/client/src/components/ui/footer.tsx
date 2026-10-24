import { Link } from "react-router-dom";
import { BrandMark } from "@/components/BrandMark";

const FOOTER_LINKS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/analytics", label: "Analytics" },
  { to: "/settings", label: "Settings" },
];

const Footer = () => {
  return (
    <footer className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-10 border-b border-border/70 pb-10 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <BrandMark to="/home" />
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Short links, organised campaigns, and analytics that stay close
              to the work.
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-3">
            {FOOTER_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {label}
              </Link>
            ))}
            <a
              href="https://github.com/abhinab-choudhury/ShortWave"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              GitHub
            </a>
          </nav>
        </div>

        <div className="flex flex-col gap-2 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright &copy; {new Date().getFullYear()} Shortwave.</p>
          <p>A focused tool for shorter links and longer context.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
