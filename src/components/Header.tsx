const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container-narrow">
        <div className="flex items-center justify-between h-16 px-6">
          <a href="/" className="text-xl font-semibold tracking-tight">
            PrintKit <span className="text-muted-foreground font-normal">NYC</span>
          </a>
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#pricing"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </a>
            <a
              href="#availability"
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Check availability
            </a>
          </nav>
          <a
            href="#availability"
            className="md:hidden text-sm font-medium text-primary"
          >
            Book now
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
