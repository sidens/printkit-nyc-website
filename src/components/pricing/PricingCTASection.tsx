import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const PricingCTASection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-narrow">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">Check availability</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Request your dates and we'll confirm availability before payment.
          </p>
          <Button variant="hero" size="xl" asChild>
            <Link to="/request">Request your dates</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PricingCTASection;
