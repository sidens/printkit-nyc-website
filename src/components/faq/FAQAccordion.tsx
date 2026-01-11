import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import wcmplusImage from "@/assets/wcm-plus-product.jpg";
import airprintImage from "@/assets/airprint-ipad.jpg";
import { generalFaqs, equipmentFaqs, policyFaqs } from "@/lib/faqData";

interface FAQSectionProps {
  title: string;
  faqs: { question: string; answer: string }[];
  startIndex: number;
}

const FAQSection = ({ title, faqs, startIndex }: FAQSectionProps) => (
  <div className="space-y-4">
    <h3 className="text-xl font-semibold text-foreground mb-6">{title}</h3>
    <Accordion type="single" collapsible className="space-y-3">
      {faqs.map((faq, index) => (
        <AccordionItem
          key={startIndex + index}
          value={`item-${startIndex + index}`}
          className="card-elevated px-6 border-none"
        >
          <AccordionTrigger className="text-left hover:no-underline py-5">
            <span className="font-medium text-base pr-4">{faq.question}</span>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </div>
);

const FAQAccordion = () => {
  return (
    <section className="section-padding section-alt">
      <div className="container-narrow">
        <div className="max-w-3xl mx-auto space-y-12">
          {/* General Questions */}
          <FAQSection title="General Questions" faqs={generalFaqs} startIndex={0} />

          {/* Equipment Details */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground">Equipment Details</h3>
            
            {/* Images Row */}
            <div className="grid gap-4 sm:grid-cols-2 mb-6">
              <div className="card-elevated overflow-hidden">
                <img
                  src={wcmplusImage}
                  alt="WCMPlus Print Server enabling wireless printing from iPad to DS40 printer"
                  className="w-full h-auto object-cover aspect-[4/3]"
                  loading="lazy"
                />
                <div className="p-3 bg-muted/50">
                  <p className="text-xs text-muted-foreground text-center">
                    WCMPlus Print Server
                  </p>
                </div>
              </div>
              <div className="card-elevated overflow-hidden">
                <img
                  src={airprintImage}
                  alt="iPad printing wirelessly to DNP DS40 via AirPrint"
                  className="w-full h-auto object-cover aspect-[4/3]"
                  loading="lazy"
                />
                <div className="p-3 bg-muted/50">
                  <p className="text-xs text-muted-foreground text-center">
                    AirPrint from Apple Devices
                  </p>
                </div>
              </div>
            </div>

            <Accordion type="single" collapsible className="space-y-3">
              {equipmentFaqs.map((faq, index) => (
                <AccordionItem
                  key={`equipment-${index}`}
                  value={`equipment-${index}`}
                  className="card-elevated px-6 border-none"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-5">
                    <span className="font-medium text-base pr-4">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Policies & Logistics */}
          <FAQSection title="Policies & Logistics" faqs={policyFaqs} startIndex={100} />
        </div>
      </div>
    </section>
  );
};

export default FAQAccordion;
