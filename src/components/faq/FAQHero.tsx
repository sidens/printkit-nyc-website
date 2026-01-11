import { HelpCircle } from "lucide-react";
import faqHero from "@/assets/faq-hero.jpg";

const FAQHero = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-narrow">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary">
              <HelpCircle className="w-7 h-7" />
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg">
              Everything you need to know about renting a PrintKit. Can't find your answer? 
              Reach out and we'll help.
            </p>
          </div>
          <div className="relative">
            <div className="card-elevated overflow-hidden">
              <img
                src={faqHero}
                alt="PrintKit printer detail"
                className="w-full h-auto object-cover aspect-[4/3]"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQHero;
