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

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
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
