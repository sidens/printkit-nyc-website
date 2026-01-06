import { MapPin, Clock, CheckCircle } from "lucide-react";

const details = [
  {
    icon: MapPin,
    text: "All rentals are pickup-only",
  },
  {
    icon: MapPin,
    text: "Pickup is in Clinton Hill, Brooklyn",
  },
  {
    icon: Clock,
    text: "Evenings and weekends preferred",
  },
  {
    icon: CheckCircle,
    text: "Exact address shared after booking confirmation",
  },
];

const PickupDetailsSection = () => {
  return (
    <section className="section-padding section-alt">
      <div className="container-narrow">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-8">Pickup Details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {details.map((detail, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border"
              >
                <detail.icon className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm text-left">{detail.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PickupDetailsSection;
