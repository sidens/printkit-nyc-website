import { ShieldCheck } from "lucide-react";

const DepositSection = () => {
  return (
    <section className="section-padding section-alt">
      <div className="container-narrow">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold mb-6">Security Deposit</h2>
          <div className="card-elevated p-8 md:p-10 text-left">
            <div className="text-center mb-6">
              <span className="text-4xl md:text-5xl font-semibold">$200</span>
              <span className="text-lg text-muted-foreground ml-2">refundable</span>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-6 text-center">
              A $200 refundable security deposit is required for all rentals. The deposit 
              is refunded within 48 hours of return, provided the kit is returned in working condition.
            </p>
            <div className="highlight-box rounded-lg p-4">
              <p className="text-sm text-foreground text-center">
                <strong>Note:</strong> Normal wear is expected. Responsibility for damage is 
                capped at repair or replacement cost — whichever is lower.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DepositSection;
