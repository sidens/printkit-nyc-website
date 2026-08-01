import { Check, Printer } from "lucide-react";
import { PRICING } from "@/lib/pricingData";

const inclusions = [
  "DNP DS40 professional printer",
  "Protective travel case",
  "Power and USB cables",
  "Quick-start setup guide",
];

const DailyRentalSection = () => {
  return (
    <section className="section-padding section-alt">
      <div className="container-narrow">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">Daily Printer Rental</h2>
        </div>
        <div className="max-w-xl mx-auto">
          <div className="card-elevated p-8 md:p-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
              <Printer className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">PrintKit (DNP DS40 + travel case)</h3>
            <div className="mb-6">
              <span className="text-5xl md:text-6xl font-semibold">${PRICING.baseRental.price}</span>
              <span className="text-xl text-muted-foreground ml-2">per {PRICING.baseRental.unit}</span>
            </div>
            <div className="highlight-box rounded-lg p-4 mb-6">
              <p className="text-sm font-medium text-foreground">
                Pickup-only in Clinton Hill, Brooklyn
              </p>
            </div>
            <ul className="space-y-3 text-left max-w-xs mx-auto mb-6">
              {inclusions.map((item, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-muted-foreground text-sm">{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-muted-foreground italic">
              Designed for short-term use — events, projects, or DIY setups.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DailyRentalSection;
