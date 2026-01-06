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
