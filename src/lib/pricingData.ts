export const PRICING = {
  baseRental: { name: "Daily Printer Rental", price: 100, unit: "day", currency: "USD" },
  prepaidMediaKit: { name: "Prepaid Media Kit", price: 100, unit: "flat", currency: "USD", note: "up to 400 prints" },
  printServer: { name: "WCMPlus Print Server", price: 35, unit: "day", currency: "USD" },
  securityDeposit: { name: "Refundable Security Deposit", price: 200, unit: "refundable", currency: "USD" },
} as const;

export const formatPrice = (price: number, unit: string) => {
  const priceText = price % 1 === 0 ? `$${price}` : `$${price.toFixed(2)}`;
  if (unit === "flat") return `${priceText} flat`;
  if (unit === "refundable") return `${priceText} refundable`;
  return `${priceText} per ${unit}`;
};
