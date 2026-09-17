import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="section-alt border-t border-border">
      <div className="container-narrow px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-lg font-semibold">
              PrintKit <span className="text-muted-foreground font-normal">NYC</span>
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Professional photo printer rentals in Brooklyn
            </p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-sm text-muted-foreground">
              Clinton Hill, Brooklyn · New York City
            </p>
            <a
              href="mailto:hello@printkitnyc.com"
              className="text-sm text-primary hover:underline"
            >
              hello@printkitnyc.com
            </a>
          </div>
        </div>
        <nav className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </Link>
          <Link to="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            FAQ
          </Link>
          <Link to="/request" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
            Check availability
          </Link>
        </nav>
        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} PrintKit NYC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
