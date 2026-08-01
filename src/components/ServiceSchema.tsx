import { Helmet } from "react-helmet-async";
import { PRICING } from "@/lib/pricingData";

const ServiceSchema = () => {
  const base = PRICING.baseRental;
  const media = PRICING.printMedia;
  const prepaid = PRICING.prepaidMediaKit;
  const server = PRICING.printServer;
  const deposit = PRICING.securityDeposit;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "DNP DS40 Photo Printer Rental",
    description:
      "Rent a professional DNP DS40 photo printer in NYC for events, photo booths, projects, and DIY setups. Pickup in Clinton Hill, Brooklyn.",
    provider: {
      "@type": "LocalBusiness",
      name: "PrintKit NYC",
      url: "https://printkitnyc.com",
      areaServed: {
        "@type": "City",
        name: "New York City",
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Brooklyn",
        addressRegion: "NY",
        addressCountry: "US",
      },
    },
    areaServed: {
      "@type": "City",
      name: "New York City",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Photo Printer Rental Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Daily Printer Rental",
            description: "DNP DS40 professional printer with protective travel case, power and USB cables, and quick-start guide",
          },
          price: base.price.toFixed(2),
          priceCurrency: base.currency,
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: base.price.toFixed(2),
            priceCurrency: base.currency,
            unitText: base.unit,
          },
          availability: "https://schema.org/InStock",
          eligibleRegion: {
            "@type": "City",
            name: "New York City",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "Print Media (paper + ribbon)",
            description: "Billed after return based on usage",
          },
          price: media.price.toFixed(2),
          priceCurrency: media.currency,
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: media.price.toFixed(2),
            priceCurrency: media.currency,
            unitText: media.unit,
          },
          availability: "https://schema.org/InStock",
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "Prepaid Media Kit",
            description: "Up to 400 prints — no usage tracking needed",
          },
          price: prepaid.price.toFixed(2),
          priceCurrency: prepaid.currency,
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: prepaid.price.toFixed(2),
            priceCurrency: prepaid.currency,
            unitText: "kit",
          },
          availability: "https://schema.org/InStock",
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "WCMPlus Print Server",
            description: "Wireless printing from any device on the network",
          },
          price: server.price.toFixed(2),
          priceCurrency: server.currency,
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: server.price.toFixed(2),
            priceCurrency: server.currency,
            unitText: server.unit,
          },
          availability: "https://schema.org/InStock",
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Refundable Security Deposit",
            description: "Required for all rentals; refunded within 48 hours of return in working condition",
          },
          price: deposit.price.toFixed(2),
          priceCurrency: deposit.currency,
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: deposit.price.toFixed(2),
            priceCurrency: deposit.currency,
            unitText: "refundable deposit",
          },
          availability: "https://schema.org/InStock",
        },
      ],
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

export default ServiceSchema;
