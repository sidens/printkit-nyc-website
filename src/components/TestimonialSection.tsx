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
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {testimonials.map((testimonial) => (
            <figure
              key={testimonial.id}
              className="card-elevated p-8 h-full bg-card flex flex-col text-left"
            >
              <Quote className="w-6 h-6 text-primary/30 mb-4" aria-hidden="true" />
              <blockquote className="text-base md:text-lg leading-relaxed text-foreground">
                {testimonial.quote}
              </blockquote>
              <figcaption className="mt-auto">
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
                <p className="text-xs text-muted-foreground mt-1">{testimonial.context}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
