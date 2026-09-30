import { DAY_RATE, SERVER_RATE, DEPOSIT, TAX_RATE, MEDIA, type PrintSize } from "./quote";

// Rates are defined once in quote.ts (the /request estimator). Everything here derives from them,
// so the pricing page, the FAQ, the JSON-LD schema and the estimator can't drift apart.

export const PRICING = {
  baseRental: { name: "Daily Printer Rental", price: DAY_RATE, unit: "day", currency: "USD" },
  prepaidMediaKit: {
    name: "Prepaid Media Kit",
    price: MEDIA["4x6"].price,
    unit: "flat",
    currency: "USD",
    note: `up to ${MEDIA["4x6"].prints} 4×6 prints`,
  },
  printServer: { name: "WCMPlus Print Server", price: SERVER_RATE, unit: "day", currency: "USD" },
  securityDeposit: { name: "Refundable Security Deposit", price: DEPOSIT, unit: "refundable", currency: "USD" },
} as const;

/** "8.875%" */
export const TAX_RATE_LABEL = `${Number((TAX_RATE * 100).toFixed(3))}%`;

/** Unstocked sizes (MEDIA[size].stocked === false) must be confirmed this many days before pickup. */
export const SPECIAL_ORDER_LEAD_DAYS = 7;

/** "6x8" -> "6×8" */
export const sizeLabel = (size: PrintSize) => size.replace("x", "×");

export const formatPrice = (price: number, unit: string) => {
  const priceText = price % 1 === 0 ? `$${price}` : `$${price.toFixed(2)}`;
  if (unit === "flat") return `${priceText} flat`;
  if (unit === "refundable") return `${priceText} refundable`;
  return `${priceText} per ${unit}`;
};
