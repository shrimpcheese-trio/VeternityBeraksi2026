import { proofOfWorkInputSchema, proofOfWorkUpdateSchema } from "@/lib/validators/proof-of-work";

const validProof = {
  workerId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  jobType: "Perbaikan AC",
  jobValue: 500000,
  photoBeforeUrl: "https://storage.example.com/before.jpg",
  photoAfterUrl: "https://storage.example.com/after.jpg",
  locationLat: -6.2088,
  locationLng: 106.8456,
  customerConfirmed: true,
  verified: false,
  jobDate: "2026-07-15",
};

describe("proofOfWorkInputSchema", () => {
  it("accepts a valid proof of work", () => {
    const parsed = proofOfWorkInputSchema.safeParse(validProof);
    expect(parsed.success).toBe(true);
  });

  it("defaults customerConfirmed to false", () => {
    const { customerConfirmed, ...rest } = validProof;
    const parsed = proofOfWorkInputSchema.safeParse(rest);
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.customerConfirmed).toBe(false);
  });

  it("defaults verified to false", () => {
    const { verified, ...rest } = validProof;
    const parsed = proofOfWorkInputSchema.safeParse(rest);
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.verified).toBe(false);
  });

  it("accepts optional jobValue as null", () => {
    const parsed = proofOfWorkInputSchema.safeParse({ ...validProof, jobValue: null });
    expect(parsed.success).toBe(true);
  });

  it("coerces jobValue from string", () => {
    const parsed = proofOfWorkInputSchema.safeParse({ ...validProof, jobValue: "250000" });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.jobValue).toBe(250000);
  });

  it("rejects negative jobValue", () => {
    const parsed = proofOfWorkInputSchema.safeParse({ ...validProof, jobValue: -100 });
    expect(parsed.success).toBe(false);
  });

  it("rejects non-UUID workerId", () => {
    const parsed = proofOfWorkInputSchema.safeParse({ ...validProof, workerId: "bad" });
    expect(parsed.success).toBe(false);
  });

  it("accepts optional agreementId as UUID", () => {
    const agreementId = "b2c3d4e5-f6a7-8901-bcde-f23456789012";
    const parsed = proofOfWorkInputSchema.safeParse({ ...validProof, agreementId });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.agreementId).toBe(agreementId);
  });

  it("rejects non-UUID agreementId", () => {
    const parsed = proofOfWorkInputSchema.safeParse({ ...validProof, agreementId: "ag-001" });
    expect(parsed.success).toBe(false);
  });

  it("rejects jobType shorter than 3 chars", () => {
    const parsed = proofOfWorkInputSchema.safeParse({ ...validProof, jobType: "AC" });
    expect(parsed.success).toBe(false);
  });

  it("rejects invalid photo URL", () => {
    const parsed = proofOfWorkInputSchema.safeParse({ ...validProof, photoBeforeUrl: "not-a-url" });
    expect(parsed.success).toBe(false);
  });

  it("rejects latitude out of range", () => {
    const parsed = proofOfWorkInputSchema.safeParse({ ...validProof, locationLat: 100 });
    expect(parsed.success).toBe(false);
  });

  it("rejects longitude out of range", () => {
    const parsed = proofOfWorkInputSchema.safeParse({ ...validProof, locationLng: 200 });
    expect(parsed.success).toBe(false);
  });
});

describe("proofOfWorkUpdateSchema", () => {
  it("allows flipping verified to true", () => {
    const parsed = proofOfWorkUpdateSchema.safeParse({ verified: true });
    expect(parsed.success).toBe(true);
  });

  it("strips workerId when passed to update", () => {
    const parsed = proofOfWorkUpdateSchema.safeParse({ workerId: validProof.workerId });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(Object.keys(parsed.data)).not.toContain("workerId");
  });
});
