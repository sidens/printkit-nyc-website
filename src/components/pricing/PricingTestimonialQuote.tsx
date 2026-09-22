import { testimonials } from "@/data/testimonials";

const PricingTestimonialQuote = () => {
  const testimonial = testimonials.find((t) => t.id === "admiration-2026-09");
  if (!testimonial) return null;

  return (
    <section className="bg-background pt-20 md:pt-28 px-6 md:px-8 lg:px-12 pb-0">
      <div className="container-narrow">
        <div className="max-w-2xl mx-auto text-center">
          <blockquote className="text-base text-foreground">
            {testimonial.pullQuote}
          </blockquote>
          <p className="text-xs text-muted-foreground mt-3">Sam K., Admiration</p>
        </div>
      </div>
    </section>
  );
};

export default PricingTestimonialQuote;
