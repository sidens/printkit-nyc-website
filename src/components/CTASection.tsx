import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section id="availability" className="section-padding bg-background">
      <div className="container-narrow">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">Check availability</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Pickup-only. Transparent pricing. No upsells.
          </p>
          <Button variant="hero" size="xl" asChild>
            <Link to="/request">Request your dates</Link>
          </Button>
          <p className="text-sm text-muted-foreground mt-6">
            We'll reply by text message (or email) within 1–2 business days with availability and next steps.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
