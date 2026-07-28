import { verificationInputSchema, verificationUpdateSchema } from "@/lib/validators/verification";

const validVerification = {
  workerId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  verifierName: "Pak RT Rudy",
  verifierRole: "ketua_rt",
  statement: "Dia pekerja yang rajin dan jujur.",
  rating: 8.5,
};

describe("verificationInputSchema", () => {
  it("accepts a valid verification input", () => {
    const parsed = verificationInputSchema.safeParse(validVerification);
    expect(parsed.success).toBe(true);
  });

  it("accepts input without statement and rating", () => {
    const { statement, rating, ...rest } = validVerification;
    const parsed = verificationInputSchema.safeParse(rest);
    expect(parsed.success).toBe(true);
  });

  it("accepts null statement", () => {
    const parsed = verificationInputSchema.safeParse({ ...validVerification, statement: null });
    expect(parsed.success).toBe(true);
  });

  it("rejects rating above 10", () => {
    const parsed = verificationInputSchema.safeParse({ ...validVerification, rating: 11 });
    expect(parsed.success).toBe(false);
  });

  it("rejects negative rating", () => {
    const parsed = verificationInputSchema.safeParse({ ...validVerification, rating: -1 });
    expect(parsed.success).toBe(false);
  });

  it("coerces rating from string", () => {
    const parsed = verificationInputSchema.safeParse({ ...validVerification, rating: "7.5" });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.rating).toBe(7.5);
  });

  it("rejects verifierName shorter than 2 chars", () => {
    const parsed = verificationInputSchema.safeParse({ ...validVerification, verifierName: "R" });
    expect(parsed.success).toBe(false);
  });

  it("rejects verifierRole shorter than 2 chars", () => {
    const parsed = verificationInputSchema.safeParse({ ...validVerification, verifierRole: "M" });
    expect(parsed.success).toBe(false);
  });

  it("accepts rating exactly 0", () => {
    const parsed = verificationInputSchema.safeParse({ ...validVerification, rating: 0 });
    expect(parsed.success).toBe(true);
  });

  it("accepts rating exactly 10", () => {
    const parsed = verificationInputSchema.safeParse({ ...validVerification, rating: 10 });
    expect(parsed.success).toBe(true);
  });
});

describe("verificationUpdateSchema", () => {
  it("allows updating only rating", () => {
    const parsed = verificationUpdateSchema.safeParse({ rating: 9 });
    expect(parsed.success).toBe(true);
  });
});
