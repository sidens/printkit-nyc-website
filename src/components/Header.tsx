import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container-narrow">
        <div className="flex items-center justify-between h-16 px-6">
          <Link to="/" className="text-xl font-semibold tracking-tight">
            PrintKit <span className="text-muted-foreground font-normal">NYC</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/pricing"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
            <Link
              to="/faq"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              FAQ
            </Link>
            {isHome ? (
              <a
                href="#availability"
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Check availability
              </a>
            ) : (
              <Link
                to="/request"
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Request dates
              </Link>
            )}
          </nav>
          <Link
            to="/request"
            className="md:hidden text-sm font-medium text-primary"
          >
            Book now
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
