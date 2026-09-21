import { describe, it, expect } from "vitest";
import { calculateQuote, DAY_RATE, SERVER_RATE, DEPOSIT, TAX_RATE, MEDIA } from "./quote";

const base = {
  pickupDate: "2026-09-23",
  returnDate: "2026-09-25",
  withServer: false,
  size: "4x6" as const,
  kits: 0,
};

describe("calculateQuote", () => {
  it("counts both the pickup and return day", () => {
    expect(calculateQuote(base).days).toBe(3);
    expect(calculateQuote({ ...base, returnDate: "2026-09-23" }).days).toBe(1);
  });

  it("counts days across a month boundary", () => {
    expect(
      calculateQuote({ ...base, pickupDate: "2026-09-30", returnDate: "2026-10-02" }).days,
    ).toBe(3);
  });

  it("charges the printer only when there are no add-ons", () => {
    const quote = calculateQuote(base);
    expect(quote.printer).toBe(3 * DAY_RATE);
    expect(quote.server).toBe(0);
    expect(quote.media).toBe(0);
    expect(quote.subtotal).toBe(300);
  });

  it("adds the print server per day", () => {
    const quote = calculateQuote({ ...base, withServer: true });
    expect(quote.server).toBe(3 * SERVER_RATE);
    expect(quote.subtotal).toBe(300 + 105);
  });

  it.each(Object.keys(MEDIA) as (keyof typeof MEDIA)[])("prices %s media kits", (size) => {
    for (let kits = 0; kits <= 4; kits += 1) {
      const quote = calculateQuote({ ...base, size, kits });
      expect(quote.media).toBe(kits * MEDIA[size].price);
    }
  });

  it("applies tax to the subtotal and rounds to cents", () => {
    const quote = calculateQuote({ ...base, withServer: true, kits: 1 });
    expect(quote.subtotal).toBe(505);
    expect(quote.tax).toBe(Math.round(505 * TAX_RATE * 100) / 100);
    expect(quote.total).toBe(quote.subtotal + quote.tax);
  });

  it("never taxes the refundable deposit", () => {
    const quote = calculateQuote(base);
    expect(quote.deposit).toBe(DEPOSIT);
    expect(quote.tax).toBe(Math.round(quote.subtotal * TAX_RATE * 100) / 100);
    expect(quote.dueAtPickup).toBe(quote.total + DEPOSIT);
  });

  it("returns zero days for empty, malformed or reversed dates", () => {
    expect(calculateQuote({ ...base, pickupDate: "", returnDate: "" }).days).toBe(0);
    expect(calculateQuote({ ...base, pickupDate: "23/09/2026" }).days).toBe(0);
    expect(calculateQuote({ ...base, pickupDate: "2026-13-01" }).days).toBe(0);
    expect(
      calculateQuote({ ...base, pickupDate: "2026-09-25", returnDate: "2026-09-23" }).days,
    ).toBe(0);
  });

  it("charges nothing for the rental when there are no dates", () => {
    const quote = calculateQuote({ ...base, pickupDate: "", returnDate: "", kits: 0 });
    expect(quote.printer).toBe(0);
    expect(quote.subtotal).toBe(0);
    expect(quote.total).toBe(0);
  });
});
