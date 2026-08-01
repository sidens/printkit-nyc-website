import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PRICING, formatPrice } from "@/lib/pricingData";

const pricingItems = [
  { label: PRICING.baseRental.name, value: `$${PRICING.baseRental.price}`, unit: "/ day" },
  { label: PRICING.printMedia.name, value: `$${PRICING.printMedia.price.toFixed(2)}`, unit: "per print", note: "(or prepaid kit available)" },
  { label: PRICING.securityDeposit.name, value: `$${PRICING.securityDeposit.price}`, unit: "refundable" },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="section-padding section-alt">
      <div className="container-narrow">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">Simple, transparent pricing</h2>
          <p className="text-muted-foreground text-lg">No hidden fees. No surprises.</p>
        </div>
        <div className="max-w-2xl mx-auto">
          <div className="card-elevated p-8 md:p-10">
            <div className="space-y-6">
              {pricingItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-baseline justify-between py-4 border-b border-border last:border-0"
                >
                  <div>
                    <span className="text-lg font-medium">{item.label}</span>
                    {item.note && (
                      <span className="block text-sm text-muted-foreground mt-1">{item.note}</span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-2xl md:text-3xl font-semibold">{item.value}</span>
                    {item.unit && (
                      <span className="text-muted-foreground ml-1">{item.unit}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-border text-center">
              <Button variant="outline" asChild>
                <Link to="/pricing">See full pricing details</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
