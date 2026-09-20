export const DAY_RATE = 100;
export const SERVER_RATE = 35;
export const DEPOSIT = 200;
export const TAX_RATE = 0.08875;

export const MEDIA = {
  "4x6": { price: 100, prints: 400, stocked: true },
  "6x8": { price: 120, prints: 200, stocked: true },
  "5x7": { price: 160, prints: 200, stocked: false },
} as const;

export type PrintSize = keyof typeof MEDIA;

export type QuoteInput = {
  pickupDate: string;
  returnDate: string;
  withServer: boolean;
  size: PrintSize;
  kits: number;
};

export type Quote = {
  days: number;
  printer: number;
  server: number;
  media: number;
  subtotal: number;
  tax: number;
  total: number;
  deposit: number;
  dueAtPickup: number;
};

const parseYmd = (value: string) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;

  return { year, month, day };
};

// Converts a civil calendar date to a whole-day ordinal without timestamp math.
const civilDayNumber = (year: number, month: number, day: number) => {
  const adjustedYear = year - (month <= 2 ? 1 : 0);
  const era = Math.floor(adjustedYear / 400);
  const yearOfEra = adjustedYear - era * 400;
  const adjustedMonth = month + (month > 2 ? -3 : 9);
  const dayOfYear = Math.floor((153 * adjustedMonth + 2) / 5) + day - 1;
  const dayOfEra = yearOfEra * 365 + Math.floor(yearOfEra / 4) - Math.floor(yearOfEra / 100) + dayOfYear;
  return era * 146097 + dayOfEra;
};

export function calculateQuote({ pickupDate, returnDate, withServer, size, kits }: QuoteInput): Quote {
  const pickup = parseYmd(pickupDate);
  const returned = parseYmd(returnDate);
  const rawDays = pickup && returned
    ? civilDayNumber(returned.year, returned.month, returned.day) -
      civilDayNumber(pickup.year, pickup.month, pickup.day) +
      1
    : 0;
  const days = Math.max(0, rawDays);
  const printer = days * DAY_RATE;
  const server = withServer ? days * SERVER_RATE : 0;
  const media = kits * MEDIA[size].price;
  const subtotal = printer + server + media;
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = subtotal + tax;
  const deposit = DEPOSIT;
  const dueAtPickup = total + deposit;

  return { days, printer, server, media, subtotal, tax, total, deposit, dueAtPickup };
}
