import { reviewInputSchema, reviewPatchSchema } from "@/lib/validators/review";

const validReview = {
  agreementId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  rating: 4,
  comment: "Pengerjaan rapi dan tepat waktu.",
  photoUrls: [
    "https://storage.example.com/review-1.jpg",
    "https://storage.example.com/review-2.jpg",
  ],
};

describe("reviewInputSchema", () => {
  it("accepts a valid review", () => {
    const parsed = reviewInputSchema.safeParse(validReview);
    expect(parsed.success).toBe(true);
  });

  it("accepts rating 0", () => {
    const parsed = reviewInputSchema.safeParse({ ...validReview, rating: 0 });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.rating).toBe(0);
  });

  it("accepts rating 5", () => {
    const parsed = reviewInputSchema.safeParse({ ...validReview, rating: 5 });
    expect(parsed.success).toBe(true);
  });

  it("rejects rating above 5", () => {
    const parsed = reviewInputSchema.safeParse({ ...validReview, rating: 6 });
    expect(parsed.success).toBe(false);
  });

  it("rejects negative rating", () => {
    const parsed = reviewInputSchema.safeParse({ ...validReview, rating: -1 });
    expect(parsed.success).toBe(false);
  });

  it("rejects fractional rating", () => {
    const parsed = reviewInputSchema.safeParse({ ...validReview, rating: 4.5 });
    expect(parsed.success).toBe(false);
  });

  it("coerces rating from string", () => {
    const parsed = reviewInputSchema.safeParse({ ...validReview, rating: "5" });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.rating).toBe(5);
  });

  it("accepts missing comment and photoUrls", () => {
    const { comment, photoUrls, ...rest } = validReview;
    const parsed = reviewInputSchema.safeParse(rest);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.comment).toBeUndefined();
      expect(parsed.data.photoUrls).toEqual([]);
    }
  });

  it("accepts null comment", () => {
    const parsed = reviewInputSchema.safeParse({ ...validReview, comment: null });
    expect(parsed.success).toBe(true);
  });

  it("accepts up to three photos", () => {
    const parsed = reviewInputSchema.safeParse({
      ...validReview,
      photoUrls: [
        "https://storage.example.com/review-1.jpg",
        "https://storage.example.com/review-2.jpg",
        "https://storage.example.com/review-3.jpg",
      ],
    });
    expect(parsed.success).toBe(true);
  });

  it("rejects more than three photos", () => {
    const parsed = reviewInputSchema.safeParse({
      ...validReview,
      photoUrls: [
        "https://storage.example.com/review-1.jpg",
        "https://storage.example.com/review-2.jpg",
        "https://storage.example.com/review-3.jpg",
        "https://storage.example.com/review-4.jpg",
      ],
    });
    expect(parsed.success).toBe(false);
  });

  it("rejects a comment longer than 1000 characters", () => {
    const parsed = reviewInputSchema.safeParse({
      ...validReview,
      comment: "a".repeat(1001),
    });
    expect(parsed.success).toBe(false);
  });
});

describe("reviewPatchSchema", () => {
  it("accepts a valid patch", () => {
    const parsed = reviewPatchSchema.safeParse({
      rating: 5,
      comment: "Hasil melebihi ekspektasi.",
    });
    expect(parsed.success).toBe(true);
  });

  it("rejects unknown fields", () => {
    const parsed = reviewPatchSchema.safeParse({ ...validReview, employerId: "x" });
    expect(parsed.success).toBe(false);
  });
});
