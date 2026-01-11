import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import KitSection from "@/components/KitSection";
import PricingSection from "@/components/PricingSection";
import PrintQualitySection from "@/components/PrintQualitySection";
import CompatibilitySection from "@/components/CompatibilitySection";
import PickupSection from "@/components/PickupSection";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Pro Photo Printer Rental in NYC | PrintKit NYC"
        description="Rent a professional DNP DS40 photo printer in NYC. Pickup in Brooklyn. Simple daily pricing, optional media, no hassle."
        path="/"
        ogTitle="Pro Photo Printer Rental in NYC | PrintKit NYC"
        ogDescription="Industrial-grade photo printing for events, projects, and more. Pickup in Clinton Hill, Brooklyn."
      />
      <Header />
      <main className="flex-1">
        <HeroSection />
        <HowItWorksSection />
        <KitSection />
        <PricingSection />
        <PrintQualitySection />
        <CompatibilitySection />
        <PickupSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
