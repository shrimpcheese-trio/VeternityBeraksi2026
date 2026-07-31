import {
  submitReview,
  ReviewNotFoundError,
  ReviewForbiddenError,
} from "@/lib/services/review";

jest.mock("@/lib/supabase/admin", () => ({
  createAdminClient: jest.fn(),
}));

jest.mock("@/lib/repositories/agreement.repo", () => ({
  getAgreementById: jest.fn(),
}));

jest.mock("@/lib/repositories/proof-of-work.repo", () => ({
  getProofOfWorkByAgreement: jest.fn(),
  updateProofOfWork: jest.fn(),
}));

jest.mock("@/lib/repositories/review.repo", () => ({
  getReviewByAgreement: jest.fn(),
  upsertReview: jest.fn(),
}));

jest.mock("@/lib/services/trust-engine", () => ({
  computeTrustScore: jest.fn(),
}));

const mockCreateAdminClient = jest.mocked(
  (jest.requireMock("@/lib/supabase/admin") as { createAdminClient: jest.Mock }).createAdminClient,
);
const mockGetAgreementById = jest.mocked(
  (jest.requireMock("@/lib/repositories/agreement.repo") as { getAgreementById: jest.Mock }).getAgreementById,
);
const mockGetProofOfWorkByAgreement = jest.mocked(
  (jest.requireMock("@/lib/repositories/proof-of-work.repo") as { getProofOfWorkByAgreement: jest.Mock }).getProofOfWorkByAgreement,
);
const mockUpdateProofOfWork = jest.mocked(
  (jest.requireMock("@/lib/repositories/proof-of-work.repo") as { updateProofOfWork: jest.Mock }).updateProofOfWork,
);
const mockUpsertReview = jest.mocked(
  (jest.requireMock("@/lib/repositories/review.repo") as { upsertReview: jest.Mock }).upsertReview,
);
const mockComputeTrustScore = jest.mocked(
  (jest.requireMock("@/lib/services/trust-engine") as { computeTrustScore: jest.Mock }).computeTrustScore,
);

const agreementId = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";
const workerId = "b2c3d4e5-f6a7-8901-bcde-f23456789012";
const employerId = "c3d4e5f6-a7b8-9012-cdef-345678901234";
const outsiderId = "d4e5f6a7-b8c9-0123-def0-456789012345";

const reviewInput = {
  agreementId,
  rating: 4,
  comment: "Pengerjaan rapi dan tepat waktu.",
  photoUrls: ["https://storage.example.com/review-1.jpg"],
};

function baseAgreement(overrides?: Record<string, unknown>) {
  return {
    agreement_id: agreementId,
    worker_id: workerId,
    employer_id: employerId,
    price: 500000,
    status: "completed",
    location: "Jakarta Selatan",
    work_hours: "08:00 - 17:00",
    job_description: "Service AC 2 unit",
    created_at: "2026-07-01T00:00:00Z",
    employer_profiles: null,
    worker_profiles: null,
    ...overrides,
  };
}

describe("submitReview", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateAdminClient.mockReturnValue({ from: jest.fn() });
  });

  it("throws ReviewNotFoundError when agreement does not exist", async () => {
    mockGetAgreementById.mockResolvedValue(null);

    await expect(submitReview(reviewInput, employerId)).rejects.toThrow(
      ReviewNotFoundError,
    );
  });

  it("throws ReviewForbiddenError when actor is not the employer", async () => {
    mockGetAgreementById.mockResolvedValue(baseAgreement());

    await expect(submitReview(reviewInput, outsiderId)).rejects.toThrow(
      ReviewForbiddenError,
    );
    expect(mockUpsertReview).not.toHaveBeenCalled();
  });

  it("throws ReviewForbiddenError when agreement is not completed", async () => {
    mockGetAgreementById.mockResolvedValue(baseAgreement({ status: "active" }));

    await expect(submitReview(reviewInput, employerId)).rejects.toThrow(
      ReviewForbiddenError,
    );
    expect(mockUpsertReview).not.toHaveBeenCalled();
  });

  it("upserts the review and recomputes trust score", async () => {
    mockGetAgreementById.mockResolvedValue(baseAgreement());
    mockGetProofOfWorkByAgreement.mockResolvedValue(null);
    mockUpsertReview.mockResolvedValue({ review_id: "review-001", ...reviewInput });

    const review = await submitReview(reviewInput, employerId);

    expect(mockUpsertReview).toHaveBeenCalledWith(
      expect.any(Object),
      {
        agreementId,
        employerId,
        workerId,
        rating: 4,
        comment: "Pengerjaan rapi dan tepat waktu.",
        photoUrls: ["https://storage.example.com/review-1.jpg"],
      },
    );
    expect(mockUpdateProofOfWork).not.toHaveBeenCalled();
    expect(mockComputeTrustScore).toHaveBeenCalledWith(workerId);
    expect(review.review_id).toBe("review-001");
  });

  it("marks the proof of work as customer confirmed when not yet confirmed", async () => {
    mockGetAgreementById.mockResolvedValue(baseAgreement());
    mockGetProofOfWorkByAgreement.mockResolvedValue({
      proof_id: "proof-001",
      customer_confirmed: false,
    });
    mockUpsertReview.mockResolvedValue({ review_id: "review-001" });

    await submitReview(reviewInput, employerId);

    expect(mockUpdateProofOfWork).toHaveBeenCalledWith(
      expect.any(Object),
      "proof-001",
      { customerConfirmed: true },
    );
  });

  it("skips the proof update when already confirmed", async () => {
    mockGetAgreementById.mockResolvedValue(baseAgreement());
    mockGetProofOfWorkByAgreement.mockResolvedValue({
      proof_id: "proof-001",
      customer_confirmed: true,
    });
    mockUpsertReview.mockResolvedValue({ review_id: "review-001" });

    await submitReview(reviewInput, employerId);

    expect(mockUpdateProofOfWork).not.toHaveBeenCalled();
  });
});
