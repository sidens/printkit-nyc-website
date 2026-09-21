import { describe, it, expect } from "vitest";
import { PRICING, formatPrice } from "./pricingData";
import { DAY_RATE, SERVER_RATE, DEPOSIT, MEDIA } from "./quote";

describe("published prices", () => {
  it("matches the prices advertised on the site", () => {
    expect(PRICING.baseRental.price).toBe(100);
    expect(PRICING.prepaidMediaKit.price).toBe(100);
    expect(PRICING.printServer.price).toBe(35);
    expect(PRICING.securityDeposit.price).toBe(200);
  });

  it("keeps the quote math in sync with the published prices", () => {
    expect(DAY_RATE).toBe(PRICING.baseRental.price);
    expect(SERVER_RATE).toBe(PRICING.printServer.price);
    expect(DEPOSIT).toBe(PRICING.securityDeposit.price);
    expect(MEDIA["4x6"].price).toBe(PRICING.prepaidMediaKit.price);
  });

  it("describes the media kit as 4×6 prints", () => {
    expect(PRICING.prepaidMediaKit.note).toBe("up to 400 4×6 prints");
    expect(MEDIA["4x6"].prints).toBe(400);
  });

  it("formats prices by unit", () => {
    expect(formatPrice(100, "day")).toBe("$100 per day");
    expect(formatPrice(100, "flat")).toBe("$100 flat");
    expect(formatPrice(200, "refundable")).toBe("$200 refundable");
  });
});
