import { agreementInputSchema, agreementUpdateSchema, agreementPatchSchema } from "@/lib/validators/agreement";

const validAgreement = {
  workerId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  employerId: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
  price: 1500000,
  location: "Jl. Merdeka No. 10, Jakarta",
  workHours: "08:00 - 16:00",
  jobDescription: "Perbaikan instalasi listrik 3 lantai",
  status: "active",
};

describe("agreementInputSchema", () => {
  it("accepts a valid agreement input", () => {
    const parsed = agreementInputSchema.safeParse(validAgreement);
    expect(parsed.success).toBe(true);
  });

  it("defaults status to draft", () => {
    const { status, ...rest } = validAgreement;
    const parsed = agreementInputSchema.safeParse(rest);
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.status).toBe("draft");
  });

  it("accepts all valid statuses", () => {
    for (const status of ["draft", "active", "completed", "disputed"] as const) {
      const parsed = agreementInputSchema.safeParse({ ...validAgreement, status });
      expect(parsed.success).toBe(true);
    }
  });

  it("rejects invalid status", () => {
    const parsed = agreementInputSchema.safeParse({ ...validAgreement, status: "cancelled" });
    expect(parsed.success).toBe(false);
  });

  it("accepts optional employerId as null", () => {
    const parsed = agreementInputSchema.safeParse({ ...validAgreement, employerId: null });
    expect(parsed.success).toBe(true);
  });

  it("coerces price from string", () => {
    const parsed = agreementInputSchema.safeParse({ ...validAgreement, price: "2000000" });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.price).toBe(2000000);
  });

  it("rejects zero price", () => {
    const parsed = agreementInputSchema.safeParse({ ...validAgreement, price: 0 });
    expect(parsed.success).toBe(false);
  });

  it("rejects negative price", () => {
    const parsed = agreementInputSchema.safeParse({ ...validAgreement, price: -500 });
    expect(parsed.success).toBe(false);
  });

  it("rejects non-UUID workerId", () => {
    const parsed = agreementInputSchema.safeParse({ ...validAgreement, workerId: "bad" });
    expect(parsed.success).toBe(false);
  });

  it("accepts null workHours", () => {
    const parsed = agreementInputSchema.safeParse({ ...validAgreement, workHours: null });
    expect(parsed.success).toBe(true);
  });

  it("rejects malformed workHours format", () => {
    for (const workHours of ["random", "8-5", "08.00 - 17.00", "25:00 - 26:00"]) {
      const parsed = agreementInputSchema.safeParse({ ...validAgreement, workHours });
      expect(parsed.success).toBe(false);
    }
  });

  it("rejects workHours with end before start", () => {
    const parsed = agreementInputSchema.safeParse({ ...validAgreement, workHours: "17:00 - 08:00" });
    expect(parsed.success).toBe(false);
  });

  it("rejects decimal price", () => {
    const parsed = agreementInputSchema.safeParse({ ...validAgreement, price: 150000.5 });
    expect(parsed.success).toBe(false);
  });
});

describe("agreementUpdateSchema", () => {
  it("allows changing status to completed", () => {
    const parsed = agreementUpdateSchema.safeParse({ status: "completed" });
    expect(parsed.success).toBe(true);
  });

  it("allows updating price only", () => {
    const parsed = agreementUpdateSchema.safeParse({ price: 2000000 });
    expect(parsed.success).toBe(true);
  });

  it("strips workerId when passed to update", () => {
    const parsed = agreementUpdateSchema.safeParse({ workerId: validAgreement.workerId });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(Object.keys(parsed.data)).not.toContain("workerId");
  });
});

describe("agreementPatchSchema", () => {
  it("allows updating price only", () => {
    const parsed = agreementPatchSchema.safeParse({ price: 2000000 });
    expect(parsed.success).toBe(true);
  });

  it("rejects status field", () => {
    const parsed = agreementPatchSchema.safeParse({ status: "completed" });
    expect(parsed.success).toBe(false);
  });

  it("rejects workerId", () => {
    const parsed = agreementPatchSchema.safeParse({ workerId: validAgreement.workerId });
    expect(parsed.success).toBe(false);
  });

  it("rejects invalid workHours", () => {
    const parsed = agreementPatchSchema.safeParse({ workHours: "sembarang" });
    expect(parsed.success).toBe(false);
  });
});
