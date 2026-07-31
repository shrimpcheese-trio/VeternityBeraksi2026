import { workerServiceInputSchema, workerServiceUpdateSchema } from "@/lib/validators/worker-service";

const validService = {
  name: "Servis AC Rumah Tangga",
  price: 150000,
  priceUnit: "hourly",
};

describe("workerServiceInputSchema", () => {
  it("accepts a valid service input", () => {
    const parsed = workerServiceInputSchema.safeParse(validService);
    expect(parsed.success).toBe(true);
  });

  it("defaults priceUnit to fixed", () => {
    const parsed = workerServiceInputSchema.safeParse({
      name: validService.name,
      price: validService.price,
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.priceUnit).toBe("fixed");
  });

  it("coerces price from string", () => {
    const parsed = workerServiceInputSchema.safeParse({ ...validService, price: "250000" });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.price).toBe(250000);
  });

  it("rejects zero price", () => {
    const parsed = workerServiceInputSchema.safeParse({ ...validService, price: 0 });
    expect(parsed.success).toBe(false);
  });

  it("rejects negative price", () => {
    const parsed = workerServiceInputSchema.safeParse({ ...validService, price: -1000 });
    expect(parsed.success).toBe(false);
  });

  it("rejects decimal price", () => {
    const parsed = workerServiceInputSchema.safeParse({ ...validService, price: 150000.5 });
    expect(parsed.success).toBe(false);
  });

  it("rejects invalid priceUnit", () => {
    const parsed = workerServiceInputSchema.safeParse({ ...validService, priceUnit: "weekly" });
    expect(parsed.success).toBe(false);
  });
});

describe("workerServiceUpdateSchema", () => {
  it("allows partial update with price only", () => {
    const parsed = workerServiceUpdateSchema.safeParse({ price: 200000 });
    expect(parsed.success).toBe(true);
  });

  it("rejects decimal price in update", () => {
    const parsed = workerServiceUpdateSchema.safeParse({ price: 200000.75 });
    expect(parsed.success).toBe(false);
  });
});
