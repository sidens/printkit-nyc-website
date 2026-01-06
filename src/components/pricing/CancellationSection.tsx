import { CalendarX, CalendarCheck } from "lucide-react";

const CancellationSection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-narrow">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">Cancellation Policy</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="card-elevated p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">48+ hours before pickup</h3>
              <p className="text-muted-foreground text-sm">
                Full refund — no questions asked
              </p>
            </div>
            <div className="card-elevated p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent text-accent-foreground mb-4">
                <CalendarX className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">Within 48 hours</h3>
              <p className="text-muted-foreground text-sm">
                Daily rental fee forfeited, but security deposit always refunded
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CancellationSection;
