import { formatPriceInput, parsePriceInput } from "@/lib/utils/currency";

describe("formatPriceInput", () => {
  it("groups digits with id-ID separators and Rupiah prefix", () => {
    expect(formatPriceInput("150000")).toBe("Rp 150.000");
  });

  it("groups millions", () => {
    expect(formatPriceInput("1500000")).toBe("Rp 1.500.000");
  });

  it("strips non-digit characters", () => {
    expect(formatPriceInput("Rp 1.500.000")).toBe("Rp 1.500.000");
    expect(formatPriceInput("abc1.500")).toBe("Rp 1.500");
  });

  it("returns empty string when no digits present", () => {
    expect(formatPriceInput("")).toBe("");
    expect(formatPriceInput("abc")).toBe("");
    expect(formatPriceInput("Rp ")).toBe("");
  });
});

describe("parsePriceInput", () => {
  it("parses a formatted input back to a number", () => {
    expect(parsePriceInput("Rp 1.500.000")).toBe(1500000);
    expect(parsePriceInput("150.000")).toBe(150000);
  });

  it("returns null when no digits present", () => {
    expect(parsePriceInput("")).toBeNull();
    expect(parsePriceInput("Rp ")).toBeNull();
  });
});
