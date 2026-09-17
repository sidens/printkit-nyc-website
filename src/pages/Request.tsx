import Header from "@/components/Header";
import SkipLink from "@/components/SkipLink";
import Footer from "@/components/Footer";
import RequestForm from "@/components/request/RequestForm";
import SEO from "@/components/SEO";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

const Request = () => {
  return (
    <div className="min-h-dvh flex flex-col">
      <SEO
        title="Request Dates | PrintKit NYC - Book Your Rental"
        description="Check availability and request your photo printer rental dates. We reply within 1–2 business days. Pickup in Clinton Hill, Brooklyn."
        path="/request"
        ogTitle="Book Your Photo Printer Rental | PrintKit NYC"
        ogDescription="Request rental dates for your event or project. We reply within 1–2 business days."
      />
      <BreadcrumbSchema items={[{ name: "Home", path: "/" }, { name: "Request Dates", path: "/request" }]} />
      <SkipLink />
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        <RequestForm />
      </main>
      <Footer />
    </div>
  );
};

export default Request;
