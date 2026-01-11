import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RequestForm from "@/components/request/RequestForm";
import SEO from "@/components/SEO";

const Request = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Request Dates | PrintKit NYC - Book Your Rental"
        description="Check availability and request your photo printer rental dates. Quick response, easy booking process. Pickup in Clinton Hill, Brooklyn."
        path="/request"
        ogTitle="Book Your Photo Printer Rental | PrintKit NYC"
        ogDescription="Request rental dates for your event or project. Fast response and simple booking."
      />
      <Header />
      <main className="flex-1">
        <RequestForm />
      </main>
      <Footer />
    </div>
  );
};

export default Request;
