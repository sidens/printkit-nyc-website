import { ShieldCheck } from "lucide-react";
import { PRICING, TAX_RATE_LABEL } from "@/lib/pricingData";

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
              <span className="text-4xl md:text-5xl font-semibold">${PRICING.securityDeposit.price}</span>
              <span className="text-lg text-muted-foreground ml-2">refundable</span>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-6 text-center">
              A ${PRICING.securityDeposit.price} refundable security deposit is required for all rentals. The deposit 
              is refunded within five business days of the kit coming back, minus anything owed. Allow up
              to another week for it to reach your card or account.
            </p>
            <div className="border-t border-border pt-6 mb-6 space-y-3">
              <h3 className="font-semibold text-center">Agreement, payment, and tax</h3>
              <p className="text-sm text-muted-foreground leading-relaxed text-center">
                After availability is confirmed, we'll send a rental agreement for you to sign.
                Once it is signed, we'll send an itemized invoice, payable by card, or by cash, PayPal or Venmo. Payment clears before pickup.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed text-center">
                NYC sales tax ({TAX_RATE_LABEL}) is added to the rental and optional add-ons. The refundable
                security deposit is excluded from sales tax.
              </p>
            </div>
            <div className="highlight-box rounded-lg p-4">
              <p className="text-sm text-foreground text-center">
                <strong>Note:</strong> Normal wear is expected and never charged. Damage is billed at repair cost, or replacement if it
                can't reasonably be repaired. The deposit isn't a cap on what's owed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DepositSection;
