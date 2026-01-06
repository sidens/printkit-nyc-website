import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

const PricingCTASection = () => {
  const navigate = useNavigate();

  const handleRequestClick = () => {
    navigate("/request");
    window.scrollTo(0, 0);
  };

  return (
    <section className="section-padding bg-background">
      <div className="container-narrow">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">Check availability</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Request your dates and we'll confirm availability before payment.
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
