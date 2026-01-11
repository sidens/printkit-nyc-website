# Photo Booth Printer Rental

A modern, responsive website for renting professional DNP DS40 photo booth printers with WCM Plus wireless connectivity.

## Features

- **Professional Equipment**: DNP DS40 dye-sublimation printer with lab-quality 4x6 and 2x6 photobooth strip prints
- **Wireless Printing**: WCM Plus server enables AirPrint from any Apple device
- **Complete Kit Rental**: Everything included - printer, media, wireless server, cables, and carrying case
- **Easy Booking**: Integrated request form powered by Formspree

## Pages

- **Home** (`/`) - Main landing page with equipment details, how it works, and pricing overview
- **Pricing** (`/pricing`) - Detailed pricing, add-ons, and rental terms
- **FAQ** (`/faq`) - Frequently asked questions
- **Request** (`/request`) - Rental request form

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components
- React Router
- Formspree (form submissions)

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Deployment

The site is configured for static hosting (GitHub Pages compatible) with client-side routing support via `404.html`.
