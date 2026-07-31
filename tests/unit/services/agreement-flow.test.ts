import { transitionAgreement, ProofOfWorkRequiredError } from "@/lib/services/agreement-flow";

jest.mock("@/lib/supabase/server", () => ({
  createClient: jest.fn(),
}));

jest.mock("@/lib/supabase/admin", () => ({
  createAdminClient: jest.fn(),
}));

jest.mock("@/lib/repositories/agreement.repo", () => ({
  getAgreementById: jest.fn(),
  updateAgreement: jest.fn(),
}));

jest.mock("@/lib/repositories/proof-of-work.repo", () => ({
  getProofOfWorkByAgreement: jest.fn(),
}));

jest.mock("@/lib/repositories/negotiation.repo", () => ({
  getLatestNegotiation: jest.fn(),
}));

jest.mock("@/lib/services/trust-engine", () => ({
  computeTrustScore: jest.fn(),
}));

const mockCreateClient = jest.mocked(
  (jest.requireMock("@/lib/supabase/server") as { createClient: jest.Mock }).createClient,
);
const mockCreateAdminClient = jest.mocked(
  (jest.requireMock("@/lib/supabase/admin") as { createAdminClient: jest.Mock }).createAdminClient,
);
const mockGetAgreementById = jest.mocked(
  (jest.requireMock("@/lib/repositories/agreement.repo") as { getAgreementById: jest.Mock }).getAgreementById,
);
const mockUpdateAgreement = jest.mocked(
  (jest.requireMock("@/lib/repositories/agreement.repo") as { updateAgreement: jest.Mock }).updateAgreement,
);
const mockGetProofOfWorkByAgreement = jest.mocked(
  (jest.requireMock("@/lib/repositories/proof-of-work.repo") as { getProofOfWorkByAgreement: jest.Mock }).getProofOfWorkByAgreement,
);
const mockGetLatestNegotiation = jest.mocked(
  (jest.requireMock("@/lib/repositories/negotiation.repo") as { getLatestNegotiation: jest.Mock }).getLatestNegotiation,
);
const mockComputeTrustScore = jest.mocked(
  (jest.requireMock("@/lib/services/trust-engine") as { computeTrustScore: jest.Mock }).computeTrustScore,
);

const agreementId = "ag-001";
const workerId = "w-001";
const employerId = "e-001";
const outsiderId = "o-999";

function baseAgreement(overrides?: Record<string, unknown>) {
  return {
    agreement_id: agreementId,
    worker_id: workerId,
    employer_id: employerId,
    price: 500000,
    status: "draft",
    location: "Jakarta",
    work_hours: "8",
    job_description: "AC service",
    created_at: "2026-07-01T00:00:00Z",
    ...overrides,
  };
}

describe("transitionAgreement", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateClient.mockResolvedValue({ from: jest.fn() });
    mockCreateAdminClient.mockReturnValue({ from: jest.fn() });
    mockGetLatestNegotiation.mockResolvedValue(null);
    mockGetProofOfWorkByAgreement.mockResolvedValue({
      proof_id: "proof-001",
      worker_id: workerId,
      agreement_id: agreementId,
      job_type: "Perbaikan AC",
      job_value: 500000,
      photo_before_url: "https://storage.example.com/before.jpg",
      photo_after_url: "https://storage.example.com/after.jpg",
      customer_confirmed: false,
      verified: false,
      job_date: "2026-07-30",
    });
  });

  it("throws NotFoundError when agreement does not exist", async () => {
    mockGetAgreementById.mockResolvedValue(null);

    await expect(
      transitionAgreement(agreementId, "active", workerId),
    ).rejects.toThrow("Agreement not found");
  });

  it("throws ForbiddenError when actor is not a party", async () => {
    mockGetAgreementById.mockResolvedValue(baseAgreement());

    await expect(
      transitionAgreement(agreementId, "active", outsiderId),
    ).rejects.toThrow("Actor is not a party to this agreement");
  });

  it("throws Error on invalid transition (draft -> completed)", async () => {
    mockGetAgreementById.mockResolvedValue(baseAgreement());

    await expect(
      transitionAgreement(agreementId, "completed", workerId),
    ).rejects.toThrow("Invalid transition from draft to completed");
  });

  it("throws Error on invalid transition (completed -> active)", async () => {
    mockGetAgreementById.mockResolvedValue(baseAgreement({ status: "completed" }));

    await expect(
      transitionAgreement(agreementId, "active", workerId),
    ).rejects.toThrow("Invalid transition from completed to active");
  });

  it("transitions draft -> active (worker as actor)", async () => {
    const agreement = baseAgreement();
    mockGetAgreementById.mockResolvedValue(agreement);
    mockUpdateAgreement.mockResolvedValue({ ...agreement, status: "active" });

    const result = await transitionAgreement(agreementId, "active", workerId);

    expect(mockUpdateAgreement).toHaveBeenCalledWith(
      expect.any(Object),
      agreementId,
      { status: "active" },
    );
    expect(mockComputeTrustScore).not.toHaveBeenCalled();
    expect(result.status).toBe("active");
  });

  it("transitions draft -> active (employer as actor)", async () => {
    const agreement = baseAgreement();
    mockGetAgreementById.mockResolvedValue(agreement);
    mockUpdateAgreement.mockResolvedValue({ ...agreement, status: "active" });

    const result = await transitionAgreement(agreementId, "active", employerId);

    expect(mockUpdateAgreement).toHaveBeenCalled();
    expect(mockComputeTrustScore).not.toHaveBeenCalled();
    expect(result.status).toBe("active");
  });

  it("recomputes trust score on active -> completed", async () => {
    const agreement = baseAgreement({ status: "active" });
    mockGetAgreementById.mockResolvedValue(agreement);
    mockUpdateAgreement.mockResolvedValue({ ...agreement, status: "completed" });

    const result = await transitionAgreement(agreementId, "completed", workerId);

    expect(mockGetProofOfWorkByAgreement).toHaveBeenCalled();
    expect(mockComputeTrustScore).toHaveBeenCalledWith(workerId);
    expect(result.status).toBe("completed");
  });

  it("throws ProofOfWorkRequiredError on active -> completed without proof", async () => {
    const agreement = baseAgreement({ status: "active" });
    mockGetAgreementById.mockResolvedValue(agreement);
    mockGetProofOfWorkByAgreement.mockResolvedValue(null);

    await expect(
      transitionAgreement(agreementId, "completed", workerId),
    ).rejects.toThrow(ProofOfWorkRequiredError);
    expect(mockUpdateAgreement).not.toHaveBeenCalled();
    expect(mockComputeTrustScore).not.toHaveBeenCalled();
  });

  it("throws ProofOfWorkRequiredError when only one photo is uploaded", async () => {
    const agreement = baseAgreement({ status: "active" });
    mockGetAgreementById.mockResolvedValue(agreement);
    mockGetProofOfWorkByAgreement.mockResolvedValue({
      proof_id: "proof-001",
      worker_id: workerId,
      agreement_id: agreementId,
      job_type: "Perbaikan AC",
      job_value: 500000,
      photo_before_url: "https://storage.example.com/before.jpg",
      photo_after_url: null,
      customer_confirmed: false,
      verified: false,
      job_date: "2026-07-30",
    });

    await expect(
      transitionAgreement(agreementId, "completed", workerId),
    ).rejects.toThrow(ProofOfWorkRequiredError);
  });

  it("allows active -> disputed without a proof", async () => {
    const agreement = baseAgreement({ status: "active" });
    mockGetAgreementById.mockResolvedValue(agreement);
    mockGetProofOfWorkByAgreement.mockResolvedValue(null);
    mockUpdateAgreement.mockResolvedValue({ ...agreement, status: "disputed" });

    const result = await transitionAgreement(agreementId, "disputed", workerId);

    expect(result.status).toBe("disputed");
    expect(mockGetProofOfWorkByAgreement).not.toHaveBeenCalled();
  });

  it("recomputes trust score on active -> disputed", async () => {
    const agreement = baseAgreement({ status: "active" });
    mockGetAgreementById.mockResolvedValue(agreement);
    mockUpdateAgreement.mockResolvedValue({ ...agreement, status: "disputed" });

    const result = await transitionAgreement(agreementId, "disputed", workerId);

    expect(mockComputeTrustScore).toHaveBeenCalledWith(workerId);
    expect(result.status).toBe("disputed");
  });

  it("recomputes trust score on disputed -> completed", async () => {
    const agreement = baseAgreement({ status: "disputed" });
    mockGetAgreementById.mockResolvedValue(agreement);
    mockUpdateAgreement.mockResolvedValue({ ...agreement, status: "completed" });

    const result = await transitionAgreement(agreementId, "completed", workerId);

    expect(mockComputeTrustScore).toHaveBeenCalledWith(workerId);
    expect(result.status).toBe("completed");
  });

  it("uses admin client to perform the update", async () => {
    const agreement = baseAgreement();
    mockGetAgreementById.mockResolvedValue(agreement);
    mockUpdateAgreement.mockResolvedValue({ ...agreement, status: "active" });

    await transitionAgreement(agreementId, "active", workerId);

    expect(mockCreateAdminClient).toHaveBeenCalled();
    expect(mockCreateClient).toHaveBeenCalled();
  });

  it("blocks a worker from accepting their own pending counter", async () => {
    const agreement = baseAgreement();
    mockGetAgreementById.mockResolvedValue(agreement);
    mockGetLatestNegotiation.mockResolvedValue({
      negotiation_id: "neg-001",
      agreement_id: agreementId,
      actor_id: workerId,
      role: "worker",
      price: 600000,
      reason: "Harga terlalu rendah",
      created_at: "2026-07-31T01:00:00Z",
    });

    await expect(
      transitionAgreement(agreementId, "active", workerId),
    ).rejects.toThrow("Worker cannot accept while a counter-offer is pending");
    expect(mockUpdateAgreement).not.toHaveBeenCalled();
  });

  it("adopts the worker counter price when the employer accepts", async () => {
    const agreement = baseAgreement();
    mockGetAgreementById.mockResolvedValue(agreement);
    mockGetLatestNegotiation.mockResolvedValue({
      negotiation_id: "neg-002",
      agreement_id: agreementId,
      actor_id: workerId,
      role: "worker",
      price: 600000,
      reason: "Harga terlalu rendah",
      created_at: "2026-07-31T01:00:00Z",
    });
    mockUpdateAgreement.mockResolvedValue({ ...agreement, status: "active", price: 600000 });

    const result = await transitionAgreement(agreementId, "active", employerId);

    expect(mockUpdateAgreement).toHaveBeenCalledWith(
      expect.any(Object),
      agreementId,
      { status: "active", price: 600000 },
    );
    expect(result.status).toBe("active");
  });

  it("accepts without a price override when no counter is pending", async () => {
    const agreement = baseAgreement();
    mockGetAgreementById.mockResolvedValue(agreement);
    mockGetLatestNegotiation.mockResolvedValue({
      negotiation_id: "neg-003",
      agreement_id: agreementId,
      actor_id: employerId,
      role: "employer",
      price: 500000,
      reason: null,
      created_at: "2026-07-30T00:00:00Z",
    });
    mockUpdateAgreement.mockResolvedValue({ ...agreement, status: "active" });

    await transitionAgreement(agreementId, "active", workerId);

    expect(mockUpdateAgreement).toHaveBeenCalledWith(
      expect.any(Object),
      agreementId,
      { status: "active" },
    );
  });
});
