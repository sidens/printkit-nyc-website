import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PricingHero from "@/components/pricing/PricingHero";
import DailyRentalSection from "@/components/pricing/DailyRentalSection";
import AddOnsSection from "@/components/pricing/AddOnsSection";
import DepositSection from "@/components/pricing/DepositSection";
import CancellationSection from "@/components/pricing/CancellationSection";
import PickupDetailsSection from "@/components/pricing/PickupDetailsSection";
import PricingCTASection from "@/components/pricing/PricingCTASection";
import SEO from "@/components/SEO";
import ServiceSchema from "@/components/ServiceSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

const Pricing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Pricing | PrintKit NYC - Photo Printer Rental Rates"
        description="Simple daily pricing for DNP DS40 printer rental. $100/day base rate, optional media kits, and add-ons. No hidden fees. Pickup in Brooklyn."
        path="/pricing"
        ogTitle="Photo Printer Rental Pricing | PrintKit NYC"
        ogDescription="Transparent daily rates for professional photo printer rental in NYC. $100/day plus optional add-ons."
      />
      <ServiceSchema />
      <BreadcrumbSchema items={[{ name: "Home", path: "/" }, { name: "Pricing", path: "/pricing" }]} />
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
