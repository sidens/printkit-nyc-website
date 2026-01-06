import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";

const FAQCTASection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-narrow">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">Still have questions?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            We're happy to help. Reach out anytime and we'll get back to you within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="xl" asChild>
              <Link to="/request">Request your dates</Link>
            </Button>
            <Button variant="heroOutline" size="xl" asChild>
              <a href="mailto:hello@printkitnyc.com">
                <Mail className="w-5 h-5 mr-2" />
                Email us
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQCTASection;
