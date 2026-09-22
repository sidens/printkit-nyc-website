import { Quote } from "lucide-react";
import { testimonials } from "@/data/testimonials";

const TestimonialSection = () => {
  if (testimonials.length === 0) return null;

  return (
    <section className="section-padding section-alt" aria-labelledby="testimonial-heading">
      <div className="container-narrow">
        <h2 id="testimonial-heading" className="text-3xl md:text-4xl font-semibold mb-10">
          What renters say
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial) => (
            <figure
              key={testimonial.id}
              className="flex flex-col text-left"
            >
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-4">
                {testimonial.context}
              </p>
              <Quote className="w-6 h-6 text-primary/30 mb-4" aria-hidden="true" />
              <blockquote className="text-base md:text-lg leading-relaxed text-foreground">
                {testimonial.quote}
              </blockquote>
              <figcaption className="mt-6">
                <span className="font-medium">{testimonial.name}</span>
                {testimonial.company && (
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
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
