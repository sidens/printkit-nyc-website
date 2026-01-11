import pricingHero from "@/assets/dnp-ds40-angle.jpg";

const PricingHero = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-narrow">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight">
              Pricing
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg">
              Simple daily pricing. Add only what you need.
            </p>
          </div>
          <div className="relative">
            <div className="card-elevated overflow-hidden">
              <img
                src={pricingHero}
                alt="DNP DS40 professional photo printer detail view"
                className="w-full h-auto object-cover aspect-[16/9]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingHero;
