import { Helmet } from "react-helmet-async";

const LocalBusinessSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "PrintKit NYC",
    description:
      "Professional photo printer rentals in Brooklyn. Rent a DNP DS40 for events, photo booths, and projects.",
    url: "https://printkitnyc.com",
    email: "hello@printkitnyc.com",
    areaServed: {
      "@type": "City",
      name: "New York City",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Brooklyn",
      addressRegion: "NY",
      addressCountry: "US",
      neighborhood: "Clinton Hill",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 40.6892,
      longitude: -73.9665,
    },
    priceRange: "$$",
    image: "https://printkitnyc.com/og-image.jpg",
    sameAs: [],
    serviceType: "Photo Printer Rental",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Printer Rental Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "DNP DS40 Printer Rental",
            description: "Professional photo printer rental for events and projects",
          },
          price: "75.00",
          priceCurrency: "USD",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: "75.00",
            priceCurrency: "USD",
            unitText: "day",
          },
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

export default LocalBusinessSchema;
