import Header from "@/components/Header";
import SkipLink from "@/components/SkipLink";
import Footer from "@/components/Footer";
import FAQHero from "@/components/faq/FAQHero";
import FAQAccordion from "@/components/faq/FAQAccordion";
import FAQCTASection from "@/components/faq/FAQCTASection";
import SEO from "@/components/SEO";
import FAQPageSchema from "@/components/FAQPageSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

const FAQ = () => {
  return (
    <div className="min-h-dvh flex flex-col">
      <SEO
        title="FAQ | PrintKit NYC - Photo Printer Rental Questions"
        description="Answers to common questions about renting a professional photo printer in NYC. Learn about equipment, pricing, pickup, and policies."
        path="/faq"
        ogTitle="Frequently Asked Questions | PrintKit NYC"
        ogDescription="Everything you need to know about renting a professional photo printer in Brooklyn."
      />
      <FAQPageSchema />
      <BreadcrumbSchema items={[{ name: "Home", path: "/" }, { name: "FAQ", path: "/faq" }]} />
      <SkipLink />
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        <FAQHero />
        <FAQAccordion />
        <FAQCTASection />
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
