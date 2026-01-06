import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RequestForm from "@/components/request/RequestForm";

const Request = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <RequestForm />
      </main>
      <Footer />
    </div>
  );
};

export default Request;
