import { workerInputSchema, workerUpdateSchema } from "@/lib/validators/worker";

const validWorker = {
  workerId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  fullName: "Budi Santoso",
  city: "Jakarta Selatan",
  jobCategory: "Tukang Listrik",
  yearsExperience: 5,
};

describe("workerInputSchema", () => {
  it("accepts a valid worker input", () => {
    const parsed = workerInputSchema.safeParse(validWorker);
    expect(parsed.success).toBe(true);
  });

  it("coerces yearsExperience from string", () => {
    const parsed = workerInputSchema.safeParse({ ...validWorker, yearsExperience: "3" });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.yearsExperience).toBe(3);
  });

  it("defaults yearsExperience to 0 when missing", () => {
    const { yearsExperience, ...rest } = validWorker;
    const parsed = workerInputSchema.safeParse(rest);
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.yearsExperience).toBe(0);
  });

  it("rejects non-UUID workerId", () => {
    const parsed = workerInputSchema.safeParse({ ...validWorker, workerId: "not-a-uuid" });
    expect(parsed.success).toBe(false);
  });

  it("rejects fullName shorter than 2 chars", () => {
    const parsed = workerInputSchema.safeParse({ ...validWorker, fullName: "A" });
    expect(parsed.success).toBe(false);
  });

  it("rejects city shorter than 3 chars", () => {
    const parsed = workerInputSchema.safeParse({ ...validWorker, city: "AB" });
    expect(parsed.success).toBe(false);
  });

  it("rejects negative yearsExperience", () => {
    const parsed = workerInputSchema.safeParse({ ...validWorker, yearsExperience: -1 });
    expect(parsed.success).toBe(false);
  });
});

describe("workerUpdateSchema", () => {
  it("allows partial updates", () => {
    const parsed = workerUpdateSchema.safeParse({ fullName: "Agus Wijaya" });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.fullName).toBe("Agus Wijaya");
  });

  it("strips workerId when passed to update", () => {
    const parsed = workerUpdateSchema.safeParse({ workerId: validWorker.workerId });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(Object.keys(parsed.data)).not.toContain("workerId");
  });

  it("accepts empty update", () => {
    const parsed = workerUpdateSchema.safeParse({});
    expect(parsed.success).toBe(true);
  });
});
