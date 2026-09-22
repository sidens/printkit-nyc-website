export interface Testimonial {
  id: string;
  quote: string;
  pullQuote: string;
  name: string;
  company?: string;
  companyUrl?: string;
  context: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "admiration-2026-09",
    quote:
      "Printing can be one of the hardest and most frustrating parts of running a fashion week collection studio. PrintKit's turnkey kit made it seamless. We printed headshots, wardrobe boards, and model boards throughout the rental, and the setup worked flawlessly from start to finish. Having a fully ready-to-go kit like this is the only way I want to handle printing going forward. Couldn't recommend PrintKit more.",
    pullQuote:
      "PrintKit's turnkey kit made it seamless. The setup worked flawlessly from start to finish.",
    name: "Sam K.",
    company: "Admiration",
    companyUrl: "https://admiration.co",
    context: "Fashion week studio · Week-long rental",
  },
  {
    id: "eastview-2026-09",
    quote:
      "PrintKit NYC provided us with exactly what we needed: a high-speed, high-quality printer for souvenir photos at a charity golf outing fundraiser. Getting the prints in the donors' hands early helped them exceed their target donations. Everyone was thrilled with the results!",
    pullQuote:
      "Getting the prints in donors' hands early helped them exceed their fundraising target.",
    name: "East View Photography",
    context: "Charity golf fundraiser · 3-day rental",
  },
];
