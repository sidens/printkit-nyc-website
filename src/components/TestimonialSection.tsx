import { Quote } from "lucide-react";
import { testimonials } from "@/data/testimonials";

const TestimonialSection = () => {
  const testimonial = testimonials[0];
  if (!testimonial) return null;

  return (
    <section className="section-padding section-alt" aria-labelledby="testimonial-heading">
      <div className="container-narrow">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-6">
            {testimonial.context}
          </p>
          <Quote className="w-8 h-8 text-primary/30 mx-auto mb-6" aria-hidden="true" />
          <figure>
            <blockquote className="text-lg md:text-2xl leading-relaxed text-balance">
              {testimonial.quote}
            </blockquote>
            <figcaption className="mt-6">
              <span className="font-medium">{testimonial.name}</span>
              <span className="text-muted-foreground">
                {" · "}
                {testimonial.companyUrl ? (
                  <a
                    href={testimonial.companyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {testimonial.company}
                  </a>
                ) : (
                  testimonial.company
                )}
              </span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
