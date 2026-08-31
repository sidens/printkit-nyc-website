import { Link } from "react-router-dom";
import { trackCtaClick } from "@/lib/analytics";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container-narrow">
        <div className="flex items-center justify-between h-16 px-6">
          <Link to="/" className="text-xl font-semibold tracking-tight">
            PrintKit <span className="text-muted-foreground font-normal">NYC</span>
          </Link>
          <nav className="flex items-center gap-8">
            <Link
              to="/pricing"
              className="hidden md:inline text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
            <Link
              to="/faq"
              className="hidden md:inline text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              FAQ
            </Link>
            <Link
              to="/request"
              onClick={() => trackCtaClick("header_check_availability", "/request")}
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Check availability
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
