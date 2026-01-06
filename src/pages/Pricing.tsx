import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PricingHero from "@/components/pricing/PricingHero";
import DailyRentalSection from "@/components/pricing/DailyRentalSection";
import AddOnsSection from "@/components/pricing/AddOnsSection";
import DepositSection from "@/components/pricing/DepositSection";
import CancellationSection from "@/components/pricing/CancellationSection";
import PickupDetailsSection from "@/components/pricing/PickupDetailsSection";
import PricingCTASection from "@/components/pricing/PricingCTASection";

const Pricing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <PricingHero />
        <DailyRentalSection />
        <AddOnsSection />
        <DepositSection />
        <CancellationSection />
        <PickupDetailsSection />
        <PricingCTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
