import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Do I need special software?",
    answer:
      "No. The DNP DS40 works with any software that can send print jobs to a standard printer driver. This includes photo booth software, Lightroom, Photoshop, and basic image viewers. If your computer can print, it can use the PrintKit.",
  },
  {
    question: "How many prints per roll?",
    answer:
      "Each media roll produces approximately 400 4×6 prints. If you need more capacity, additional media kits can be rented or purchased separately.",
  },
  {
    question: "What happens if something breaks?",
    answer:
      "Contact us immediately via email or phone. We'll troubleshoot with you and, if needed, arrange a replacement or alternative solution. The refundable deposit covers accidental damage, so you're protected.",
  },
  {
    question: "What size table do I need?",
    answer:
      "The printer is compact—about the size of a small microwave. A standard 2-foot by 3-foot table works well. Make sure you have access to a power outlet nearby.",
  },
  {
    question: "Why is PrintKit pickup-only?",
    answer:
      "Pickup keeps our pricing fair and straightforward. It eliminates delivery fees, avoids scheduling complications, and lets us personally walk you through the kit. Plus, it makes returns simple—just drop it back off when you're done.",
  },
];

const FAQSection = () => {
  return (
    <section className="section-padding section-alt">
      <div className="container-narrow">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">Frequently asked questions</h2>
          <p className="text-muted-foreground text-lg">
            Everything you need to know before booking
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="card-elevated px-6 border-none"
              >
                <AccordionTrigger className="text-left hover:no-underline py-5">
                  <span className="font-medium text-lg">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
