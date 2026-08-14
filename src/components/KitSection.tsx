import { Check } from "lucide-react";
import kitImage from "@/assets/dnp-ds40-angle.jpg";

const kitItems = [
  "DNP DS40 professional photo printer",
  "Protective travel case",
  "Power and USB cables",
  "Quick-start setup guide",
  "Setup help and troubleshooting by email during your rental",
];

const KitSection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-narrow">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="card-elevated overflow-hidden">
              <img
                src={kitImage}
                alt="Complete PrintKit rental including DNP printer, protective case, cables, and setup guide"
                className="w-full h-auto object-cover aspect-[4/3]"
              />
            </div>
          </div>
          <div className="order-1 lg:order-2 space-y-6">
            <h2 className="text-3xl md:text-4xl font-semibold">What's included</h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to start printing, packaged and ready to go.
            </p>
            <ul className="space-y-4">
              {kitItems.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KitSection;
