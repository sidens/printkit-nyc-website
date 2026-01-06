import { Zap, Clock, Sparkles } from "lucide-react";
import samplePrints from "@/assets/sample-prints.jpg";

const features = [
  {
    icon: Sparkles,
    title: "Lab-quality 4×6 prints",
    description: "Professional dye-sublimation technology for vibrant, long-lasting prints.",
  },
  {
    icon: Clock,
    title: "8–9 seconds per print",
    description: "Fast enough to keep up with any event or high-volume project.",
  },
  {
    icon: Zap,
    title: "Dry instantly",
    description: "Smudge-resistant prints ready to hand out immediately.",
  },
];

const PrintQualitySection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-narrow">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-semibold mb-4">Print quality & speed</h2>
              <p className="text-lg text-muted-foreground">
                The DNP DS40 delivers professional results, fast enough for any event.
              </p>
            </div>
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="card-elevated overflow-hidden">
              <img
                src={samplePrints}
                alt="Sample 4x6 photo prints fanned out showing vibrant colors and professional quality"
                className="w-full h-auto object-cover aspect-[4/3]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrintQualitySection;
