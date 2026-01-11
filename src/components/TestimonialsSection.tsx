import { Helmet } from "react-helmet-async";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah M.",
    role: "Wedding Planner",
    content:
      "PrintKit made our photo booth setup so easy. The DS40 printed beautiful photos all night, and guests loved taking home instant prints. Will definitely rent again!",
    rating: 5,
    date: "2024-11-15",
  },
  {
    name: "Marcus T.",
    role: "Event Photographer",
    content:
      "Professional quality prints at a fraction of the cost of buying. Pickup in Brooklyn was super convenient, and the kit had everything I needed. Great for client events.",
    rating: 5,
    date: "2024-10-22",
  },
  {
    name: "Jessica L.",
    role: "Birthday Party Host",
    content:
      "Rented for my daughter's sweet 16. The printer was easy to use and the print quality was amazing. Our guests were impressed! Simple pricing, no hidden fees.",
    rating: 5,
    date: "2024-12-03",
  },
];

const ReviewSchema = () => {
  const aggregateRating = {
    "@type": "AggregateRating",
    ratingValue: "5",
    reviewCount: testimonials.length.toString(),
    bestRating: "5",
    worstRating: "1",
  };

  const reviews = testimonials.map((t) => ({
    "@type": "Review",
    author: {
      "@type": "Person",
      name: t.name,
    },
    datePublished: t.date,
    reviewBody: t.content,
    reviewRating: {
      "@type": "Rating",
      ratingValue: t.rating.toString(),
      bestRating: "5",
      worstRating: "1",
    },
  }));

  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "PrintKit NYC",
    aggregateRating,
    review: reviews,
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: rating }).map((_, i) => (
      <Star
        key={i}
        className="w-4 h-4 fill-primary text-primary"
        aria-hidden="true"
      />
    ))}
  </div>
);

const TestimonialsSection = () => {
  return (
    <section className="section-padding section-alt">
      <ReviewSchema />
      <div className="container-narrow">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            What Renters Say
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Trusted by event planners, photographers, and party hosts across NYC.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <article
              key={index}
              className="card-elevated p-6 space-y-4"
              itemScope
              itemType="https://schema.org/Review"
            >
              <StarRating rating={testimonial.rating} />
              <blockquote
                className="text-foreground leading-relaxed"
                itemProp="reviewBody"
              >
                "{testimonial.content}"
              </blockquote>
              <footer className="pt-2 border-t border-border">
                <p
                  className="font-medium text-foreground"
                  itemProp="author"
                  itemScope
                  itemType="https://schema.org/Person"
                >
                  <span itemProp="name">{testimonial.name}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  {testimonial.role}
                </p>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
