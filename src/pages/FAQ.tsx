import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FAQHero from "@/components/faq/FAQHero";
import FAQAccordion from "@/components/faq/FAQAccordion";
import FAQCTASection from "@/components/faq/FAQCTASection";

const FAQ = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <FAQHero />
        <FAQAccordion />
        <FAQCTASection />
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
