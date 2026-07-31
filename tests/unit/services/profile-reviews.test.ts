import { getWorkerReviews, getEmployerReviews } from "@/lib/services/profile";

jest.mock("@/lib/supabase/admin", () => ({
  createAdminClient: jest.fn(),
}));

jest.mock("@/lib/repositories/review.repo", () => ({
  listReviewsByWorker: jest.fn(),
  listReviewsByEmployer: jest.fn(),
}));

const mockCreateAdminClient = jest.mocked(
  (jest.requireMock("@/lib/supabase/admin") as { createAdminClient: jest.Mock }).createAdminClient,
);
const mockListReviewsByWorker = jest.mocked(
  (jest.requireMock("@/lib/repositories/review.repo") as { listReviewsByWorker: jest.Mock }).listReviewsByWorker,
);
const mockListReviewsByEmployer = jest.mocked(
  (jest.requireMock("@/lib/repositories/review.repo") as { listReviewsByEmployer: jest.Mock }).listReviewsByEmployer,
);

const workerId = "b2c3d4e5-f6a7-8901-bcde-f23456789012";
const employerId = "c3d4e5f6-a7b8-9012-cdef-345678901234";
const agreementId = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";

function baseReview(overrides?: Record<string, unknown>) {
  return {
    review_id: "review-001",
    agreement_id: agreementId,
    employer_id: employerId,
    worker_id: workerId,
    rating: 5,
    comment: "Pengerjaan rapi dan tepat waktu.",
    photo_urls: [],
    created_at: "2026-07-15T00:00:00Z",
    updated_at: "2026-07-15T00:00:00Z",
    ...overrides,
  };
}

describe("getWorkerReviews", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateAdminClient.mockReturnValue({ from: jest.fn() });
  });

  it("maps received reviews with employer name and service tag", async () => {
    mockListReviewsByWorker.mockResolvedValue([
      {
        ...baseReview(),
        employer_profiles: {
          employer_id: employerId,
          company_name: "PT Griya Indah",
          city: "Jakarta Selatan",
          phone: null,
          created_at: "2026-01-01T00:00:00Z",
          updated_at: "2026-01-01T00:00:00Z",
        },
        agreements: { agreement_id: agreementId, job_description: "Service AC 2 unit" },
      },
    ]);

    const reviews = await getWorkerReviews(workerId);

    expect(reviews).toHaveLength(1);
    expect(reviews[0]).toMatchObject({
      id: "review-001",
      reviewerName: "PT Griya Indah",
      reviewerInitials: "PG",
      rating: 5,
      comment: "Pengerjaan rapi dan tepat waktu.",
      service: "Service AC 2 unit",
    });
  });

  it("falls back to a default reviewer name and no tag when data is missing", async () => {
    mockListReviewsByWorker.mockResolvedValue([
      { ...baseReview(), employer_profiles: null, agreements: null },
    ]);

    const reviews = await getWorkerReviews(workerId);

    expect(reviews[0].reviewerName).toBe("Pemberi Kerja");
    expect(reviews[0].service).toBeUndefined();
  });
});

describe("getEmployerReviews", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateAdminClient.mockReturnValue({ from: jest.fn() });
  });

  it("maps reviews given with worker name and service tag", async () => {
    mockListReviewsByEmployer.mockResolvedValue([
      {
        ...baseReview(),
        worker_profiles: { worker_id: workerId, full_name: "Slamet Riyadi" },
        agreements: { agreement_id: agreementId, job_description: "Renovasi dapur" },
      },
    ]);

    const reviews = await getEmployerReviews(employerId);

    expect(reviews).toHaveLength(1);
    expect(reviews[0]).toMatchObject({
      reviewerName: "Slamet Riyadi",
      reviewerInitials: "SR",
      rating: 5,
      service: "Renovasi dapur",
    });
  });

  it("returns an empty list when the employer has not reviewed anyone", async () => {
    mockListReviewsByEmployer.mockResolvedValue([]);

    const reviews = await getEmployerReviews(employerId);

    expect(reviews).toEqual([]);
  });
});
