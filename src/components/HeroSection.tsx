import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-printer.jpg";

const HeroSection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-narrow">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight text-balance">
              Rent a Pro Photo Printer in NYC
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg">
              Industrial-grade prints for events, projects, and everything in between. 
              Pickup-only. Simple setup. No hassle.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button variant="hero" size="xl" asChild>
                <Link to="/request">Check availability</Link>
              </Button>
              <Button variant="heroOutline" size="xl" asChild>
                <Link to="/pricing">View pricing</Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="card-elevated overflow-hidden">
              <img
                src={heroImage}
                alt="DNP DS40 professional photo printer powered on, ready for rental"
                className="w-full h-auto object-cover aspect-[4/3]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
