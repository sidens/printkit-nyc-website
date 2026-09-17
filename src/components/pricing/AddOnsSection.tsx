import { Package, Server } from "lucide-react";
import addonsImage from "@/assets/addons-layout.jpg";
import { PRICING, formatPrice } from "@/lib/pricingData";

const addonMeta = [
  {
    icon: Package,
    key: "prepaidMediaKit" as const,
    description: "Up to 400 4×6 prints for one flat price",
  },
  {
    icon: Server,
    key: "printServer" as const,
    description: "Wireless printing from any device on the network",
  },
] as const;

const AddOnsSection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-narrow">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-start">
          <div>
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">Optional Add-Ons</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Nothing is required. Add only what helps your setup.
            </p>
            <div className="space-y-4">
              {addonMeta.map(({ icon: Icon, key, description }, index) => {
                const addon = PRICING[key];
                return (
                  <div
                    key={index}
                    className="card-elevated p-5 flex items-start gap-4"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-4 mb-1">
                        <h3 className="font-semibold">{addon.name}</h3>
                        <span className="text-primary font-semibold whitespace-nowrap">
                          {formatPrice(addon.price, addon.unit)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{description}</p>
                      {key === "prepaidMediaKit" && (
                        <p className="text-xs text-muted-foreground mt-1">
                          6×8 and 5×7 available on request — email us for a quote.
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="lg:sticky lg:top-24">
            <div className="card-elevated overflow-hidden">
              <img
                src={addonsImage}
                alt="PrintKit add-ons including cables, media box, and print server"
                className="w-full h-auto object-cover aspect-[4/3]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddOnsSection;
