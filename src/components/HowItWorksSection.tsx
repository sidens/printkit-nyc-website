import { CalendarCheck, MapPin, Printer } from "lucide-react";

const steps = [
  {
    icon: CalendarCheck,
    title: "Request your dates online",
    description: "Choose your rental period and submit a request through our simple form.",
  },
  {
    icon: MapPin,
    title: "Pick up your PrintKit in Clinton Hill, Brooklyn",
    description: "Collect your complete kit at our convenient Brooklyn location.",
  },
  {
    icon: Printer,
    title: "Print, return, done",
    description: "Use the printer for your event or project, then return it when you're finished.",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="section-padding section-alt">
      <div className="container-narrow">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">How it works</h2>
          <p className="text-muted-foreground text-lg">Three simple steps to professional prints</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={index} className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-2">
                <step.icon className="w-7 h-7" />
              </div>
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className="text-sm font-medium text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                  Step {index + 1}
                </span>
              </div>
              <h3 className="text-xl font-semibold">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
