import { Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { testimonials } from "@/data/testimonials";

const PricingCTASection = () => {
  const navigate = useNavigate();
  const testimonial = testimonials.find((t) => t.id === "eastview-2026-09");

  const handleRequestClick = () => {
    navigate("/request");
    window.scrollTo(0, 0);
  };

  return (
    <section className="section-padding bg-background">
      <div className="container-narrow">
        <div className="max-w-2xl mx-auto text-center">
          {testimonial && (
            <div className="mb-10 max-w-xl mx-auto card-elevated p-6 md:p-8 text-left">
              <Quote className="w-5 h-5 text-primary/30 mb-3" aria-hidden="true" />
              <blockquote className="text-base md:text-lg leading-relaxed text-foreground">
                {testimonial.pullQuote}
              </blockquote>
              <p className="text-xs text-muted-foreground mt-3">{testimonial.name}{testimonial.company ? `, ${testimonial.company}` : ""}</p>
            </div>
          )}
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">Check availability</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Request your dates first. Once availability is confirmed, we'll send the rental
            agreement, followed by payment details. Payment is due before pickup.
          </p>
          <Button variant="hero" size="xl" onClick={handleRequestClick}>
            Request your dates
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PricingCTASection;
