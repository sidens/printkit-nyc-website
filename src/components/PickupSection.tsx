import { MapPin } from "lucide-react";

const PickupSection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-narrow">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
            <MapPin className="w-7 h-7" />
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">Pickup location</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Pickup in Clinton Hill, Brooklyn (NYC). Evenings and weekends preferred. 
            Exact address shared after booking confirmation.
          </p>
          <div className="highlight-box rounded-lg p-6 inline-block">
            <p className="font-medium text-foreground">
              Clinton Hill, Brooklyn · New York City
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PickupSection;
