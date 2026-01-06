import { Button } from "@/components/ui/button";

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
            <a href="mailto:hello@printkitnyc.com?subject=PrintKit Rental Inquiry">
              Request your dates
            </a>
          </Button>
          <p className="text-sm text-muted-foreground mt-6">
            We'll respond within 24 hours with availability and next steps.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
