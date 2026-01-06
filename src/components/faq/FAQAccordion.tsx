import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import wcmplusImage from "@/assets/wcmplus-server.jpg";
import airprintImage from "@/assets/airprint-ipad.jpg";

const generalFaqs = [
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
];

const equipmentFaqs = [
  {
    question: "What is the WCMPlus Print Server?",
    answer:
      "WCMPlus is an optional print server that connects the DNP DS40 to your network and enables wireless printing, including AirPrint from Apple devices. It's commonly used in photo booth and event setups where printing directly from an iPad or iPhone is preferred.",
  },
  {
    question: "What does the WCMPlus enable that a direct USB connection does not?",
    answer:
      "With WCMPlus, the printer can receive print jobs over the network instead of requiring a physical USB connection. This allows supported devices — including iPads, iPhones, and Macs — to send prints wirelessly using AirPrint or standard network printing.",
  },
  {
    question: "Do I need the WCMPlus Print Server?",
    answer:
      "Not always. If you're printing from a single laptop connected via USB, you likely don't need it. The WCMPlus is most useful if you want to print wirelessly from an iPad, support multiple devices, or simplify a photo booth workflow.",
  },
  {
    question: "Can I print from an iPad or iPhone?",
    answer:
      "Yes — when the WCMPlus Print Server is included, the DS40 supports AirPrint from Apple devices, allowing compatible apps to send print jobs without installing drivers or connecting cables.",
  },
  {
    question: "Is the WCMPlus required for photo strip printing?",
    answer:
      "No. Photo strip layouts are handled by your photo booth software or app. The WCMPlus only affects how print jobs are sent to the printer, not the print layout itself.",
  },
  {
    question: "Will this work with my photo booth app?",
    answer:
      "Most photo booth apps that support AirPrint or standard printer output will work with the DS40 when paired with WCMPlus. If your app can print via AirPrint or to a network printer, it should be compatible. If you're unsure, feel free to ask before booking.",
  },
];

const policyFaqs = [
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
