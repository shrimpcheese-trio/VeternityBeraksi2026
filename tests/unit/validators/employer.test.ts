import { employerInputSchema, employerUpdateSchema } from "@/lib/validators/employer";

const validEmployer = {
  employerId: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
  companyName: "PT Maju Bersama",
  city: "Bandung",
  phone: "081234567890",
};

describe("employerInputSchema", () => {
  it("accepts a valid employer input", () => {
    const parsed = employerInputSchema.safeParse(validEmployer);
    expect(parsed.success).toBe(true);
  });

  it("accepts input without phone", () => {
    const { phone, ...rest } = validEmployer;
    const parsed = employerInputSchema.safeParse(rest);
    expect(parsed.success).toBe(true);
  });

  it("accepts null phone", () => {
    const parsed = employerInputSchema.safeParse({ ...validEmployer, phone: null });
    expect(parsed.success).toBe(true);
  });

  it("rejects non-UUID employerId", () => {
    const parsed = employerInputSchema.safeParse({ ...validEmployer, employerId: "bad-id" });
    expect(parsed.success).toBe(false);
  });

  it("rejects companyName shorter than 2 chars", () => {
    const parsed = employerInputSchema.safeParse({ ...validEmployer, companyName: "A" });
    expect(parsed.success).toBe(false);
  });

  it("rejects city shorter than 3 chars", () => {
    const parsed = employerInputSchema.safeParse({ ...validEmployer, city: "AB" });
    expect(parsed.success).toBe(false);
  });
});

describe("employerUpdateSchema", () => {
  it("allows partial update with only city", () => {
    const parsed = employerUpdateSchema.safeParse({ city: "Jakarta Pusat" });
    expect(parsed.success).toBe(true);
  });
});
