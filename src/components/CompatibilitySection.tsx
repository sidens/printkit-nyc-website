import { Monitor, Camera, Laptop, Settings } from "lucide-react";
import printAction from "@/assets/print-action.jpg";

const compatItems = [
  { icon: Monitor, label: "Mac & Windows" },
  { icon: Camera, label: "DSLR tethering" },
  { icon: Laptop, label: "Photo booth software" },
  { icon: Settings, label: "Any system that can print to a driver" },
];

const CompatibilitySection = () => {
  return (
    <section className="section-padding section-alt">
      <div className="container-narrow">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="card-elevated overflow-hidden">
              <img
                src={printAction}
                alt="Photo print ejecting from the DNP DS40 printer in action"
                className="w-full h-auto object-cover aspect-[4/3]"
              />
            </div>
          </div>
          <div className="order-1 lg:order-2 space-y-6">
            <h2 className="text-3xl md:text-4xl font-semibold">Works with your setup</h2>
            <p className="text-lg text-muted-foreground">
              The PrintKit integrates seamlessly with your existing workflow.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {compatItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border"
                >
                  <item.icon className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              ))}
            </div>
            <p className="text-muted-foreground italic">
              "If your setup can print, it can print to a PrintKit."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompatibilitySection;
