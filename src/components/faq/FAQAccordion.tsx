import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What exactly is included in a PrintKit?",
    answer:
      "Each PrintKit includes a DNP DS40 professional photo printer, a protective travel case, power and USB cables, and a quick-start setup guide. Nothing extra is required to get started.",
  },
  {
    question: "Do I need special software to use the printer?",
    answer:
      "No. If your setup can print, it can print to the DNP DS40. The printer works with Mac and Windows and is compatible with photo booth software, DSLR tethering, and standard print drivers.",
  },
  {
    question: "How fast does the printer print?",
    answer:
      "The DNP DS40 produces a 4×6 photo in approximately 8–9 seconds, making it well-suited for events and higher-volume use.",
  },
  {
    question: "How many prints can I make?",
    answer:
      "A standard media kit produces approximately 400 4×6 prints. You can pay per print after your rental or choose a prepaid media kit if you prefer predictable costs.",
  },
  {
    question: "How does print media billing work?",
    answer:
      "You can either pay $0.40 per print based on usage after return, or choose a prepaid media kit for up to 400 prints. We'll review usage together when the kit is returned.",
  },
  {
    question: "Why is PrintKit pickup-only?",
    answer:
      "Pickup-only helps keep pricing fair and flexible. By avoiding delivery windows and logistics, we're able to offer lower daily rates and simpler scheduling. Most renters are already setting up their own workflow, so pickup keeps things fast and straightforward.",
  },
  {
    question: "Where is pickup located?",
    answer:
      "Pickup is in Clinton Hill, Brooklyn. Evenings and weekends are preferred. The exact address is shared after your booking is confirmed.",
  },
  {
    question: "Is there a security deposit?",
    answer:
      "Yes. A $200 refundable security deposit is required for all rentals. The deposit is refunded within 48 hours of return, provided the kit is returned in working condition.",
  },
  {
    question: "What happens if something breaks or stops working?",
    answer:
      "Normal wear is expected. If something is damaged due to misuse or an accident, responsibility is capped at the cost of repair or replacement — whichever is lower. If you run into issues during your rental, email support is available.",
  },
  {
    question: "What is your cancellation policy?",
    answer:
      "Cancellations made 48 hours or more before pickup receive a full refund. Cancellations within 48 hours forfeit the daily rental fee, but the security deposit is always refunded.",
  },
  {
    question: "Can I add accessories later or change my rental?",
    answer:
      "Yes, as long as availability allows. Just reach out before pickup and we'll do our best to accommodate changes.",
  },
];

const FAQAccordion = () => {
  return (
    <section className="section-padding section-alt">
      <div className="container-narrow">
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="card-elevated px-6 border-none"
              >
                <AccordionTrigger className="text-left hover:no-underline py-5">
                  <span className="font-medium text-lg pr-4">{faq.question}</span>
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

export default FAQAccordion;
