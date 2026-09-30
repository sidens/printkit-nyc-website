import { describe, it, expect } from "vitest";
import { allFaqs, homepageFaqs } from "./faqData";
import { MEDIA } from "./quote";
import { SPECIAL_ORDER_LEAD_DAYS } from "./pricingData";

const text = allFaqs.map((f) => `${f.question} ${f.answer}`).join("\n");

describe("FAQ copy", () => {
  it("has no duplicate questions", () => {
    const questions = allFaqs.map((f) => f.question);
    expect(new Set(questions).size).toBe(questions.length);
  });

  it("never says there is only one printer", () => {
    expect(text).not.toMatch(/\b(one|only|single|1)\s+(printer|unit)\b/i);
  });

  it("quotes every media size at its current price", () => {
    for (const { price, prints } of Object.values(MEDIA)) {
      expect(text).toContain(`$${price} for ${prints} prints`);
    }
  });

  it("gives the lead time whenever a size isn't stocked", () => {
    if (Object.values(MEDIA).some((m) => !m.stocked)) {
      expect(text).toContain(`at least ${SPECIAL_ORDER_LEAD_DAYS} days before pickup`);
    }
  });

  it("only recommends 6×8 over 5×7 while it's cheaper for the same prints", () => {
    expect(MEDIA["6x8"].prints).toBe(MEDIA["5x7"].prints);
    expect(MEDIA["6x8"].price).toBeLessThan(MEDIA["5x7"].price);
  });

  it("matches the rental agreement on deposit timing and damage", () => {
    expect(text).toContain("five business days");
    expect(text).not.toMatch(/48 hours of return|whichever is lower|capped at/i);
  });

  it("leaves no unfilled template values", () => {
    expect(text).not.toMatch(/undefined|NaN|\$\{/);
  });

  it("builds the homepage selection from the main FAQ", () => {
    expect(homepageFaqs).toHaveLength(5);
    for (const f of homepageFaqs) expect(allFaqs).toContain(f);
  });
});
