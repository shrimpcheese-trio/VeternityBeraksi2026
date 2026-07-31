import {
  createAgreementOffer,
  submitCounter,
  NotFoundError,
  ForbiddenError,
  NotNegotiableError,
  ReasonRequiredError,
} from "@/lib/services/negotiation";

jest.mock("@/lib/supabase/server", () => ({
  createClient: jest.fn(),
}));

jest.mock("@/lib/supabase/admin", () => ({
  createAdminClient: jest.fn(),
}));

jest.mock("@/lib/repositories/agreement.repo", () => ({
  createAgreement: jest.fn(),
  getAgreementById: jest.fn(),
  updateAgreement: jest.fn(),
}));

jest.mock("@/lib/repositories/negotiation.repo", () => ({
  createNegotiation: jest.fn(),
  getLatestNegotiation: jest.fn(),
}));

const mockCreateClient = jest.mocked(
  (jest.requireMock("@/lib/supabase/server") as { createClient: jest.Mock }).createClient,
);
const mockCreateAdminClient = jest.mocked(
  (jest.requireMock("@/lib/supabase/admin") as { createAdminClient: jest.Mock }).createAdminClient,
);
const mockCreateAgreement = jest.mocked(
  (jest.requireMock("@/lib/repositories/agreement.repo") as { createAgreement: jest.Mock }).createAgreement,
);
const mockGetAgreementById = jest.mocked(
  (jest.requireMock("@/lib/repositories/agreement.repo") as { getAgreementById: jest.Mock }).getAgreementById,
);
const mockUpdateAgreement = jest.mocked(
  (jest.requireMock("@/lib/repositories/agreement.repo") as { updateAgreement: jest.Mock }).updateAgreement,
);
const mockCreateNegotiation = jest.mocked(
  (jest.requireMock("@/lib/repositories/negotiation.repo") as { createNegotiation: jest.Mock }).createNegotiation,
);
const mockGetLatestNegotiation = jest.mocked(
  (jest.requireMock("@/lib/repositories/negotiation.repo") as { getLatestNegotiation: jest.Mock }).getLatestNegotiation,
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

function workerNegotiation(overrides?: Record<string, unknown>) {
  return {
    negotiation_id: "neg-001",
    agreement_id: agreementId,
    actor_id: workerId,
    role: "worker",
    price: 600000,
    reason: "Harga terlalu rendah",
    created_at: "2026-07-31T01:00:00Z",
    ...overrides,
  };
}

describe("createAgreementOffer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateClient.mockResolvedValue({ from: jest.fn() });
    mockCreateAdminClient.mockReturnValue({ from: jest.fn() });
    mockCreateAgreement.mockResolvedValue(baseAgreement());
  });

  it("seeds the initial employer offer when the actor is the employer", async () => {
    const agreement = await createAgreementOffer(
      { from: jest.fn() } as never,
      {
        workerId,
        employerId,
        price: 500000,
        status: "draft",
        location: "Jakarta",
        workHours: "08:00 - 17:00",
        jobDescription: "Service AC",
      },
      employerId,
    );

    expect(mockCreateNegotiation).toHaveBeenCalledWith(
      expect.anything(),
      {
        agreementId,
        actorId: employerId,
        role: "employer",
        price: 500000,
      },
    );
    expect(agreement.agreement_id).toBe(agreementId);
  });

  it("does not seed a negotiation when the actor is not the employer", async () => {
    await createAgreementOffer(
      { from: jest.fn() } as never,
      {
        workerId,
        employerId: null,
        price: 500000,
        status: "draft",
        jobDescription: "Service AC",
      },
      workerId,
    );

    expect(mockCreateNegotiation).not.toHaveBeenCalled();
  });
});

describe("submitCounter", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateClient.mockResolvedValue({ from: jest.fn() });
    mockCreateAdminClient.mockReturnValue({ from: jest.fn() });
    mockGetAgreementById.mockResolvedValue(baseAgreement());
    mockGetLatestNegotiation.mockResolvedValue(null);
    mockUpdateAgreement.mockResolvedValue(baseAgreement());
    mockCreateNegotiation.mockResolvedValue(workerNegotiation());
  });

  it("throws NotFoundError when the agreement does not exist", async () => {
    mockGetAgreementById.mockResolvedValue(null);

    await expect(
      submitCounter(agreementId, workerId, { price: 600000, reason: "Harga terlalu rendah" }),
    ).rejects.toThrow(NotFoundError);
  });

  it("throws ForbiddenError when the actor is not a party", async () => {
    await expect(
      submitCounter(agreementId, outsiderId, { price: 600000, reason: "Harga terlalu rendah" }),
    ).rejects.toThrow(ForbiddenError);
    expect(mockCreateNegotiation).not.toHaveBeenCalled();
  });

  it("throws NotNegotiableError when the agreement is not a draft", async () => {
    mockGetAgreementById.mockResolvedValue(baseAgreement({ status: "active" }));

    await expect(
      submitCounter(agreementId, workerId, { price: 600000, reason: "Harga terlalu rendah" }),
    ).rejects.toThrow(NotNegotiableError);
    expect(mockCreateNegotiation).not.toHaveBeenCalled();
  });

  it("requires a reason for a worker counter", async () => {
    await expect(
      submitCounter(agreementId, workerId, { price: 600000, reason: "  " }),
    ).rejects.toThrow(ReasonRequiredError);
    expect(mockCreateNegotiation).not.toHaveBeenCalled();
  });

  it("records a worker counter without touching the agreement price", async () => {
    await submitCounter(agreementId, workerId, {
      price: 600000,
      reason: "  Harga terlalu rendah  ",
    });

    expect(mockCreateNegotiation).toHaveBeenCalledWith(
      expect.anything(),
      {
        agreementId,
        actorId: workerId,
        role: "worker",
        price: 600000,
        reason: "Harga terlalu rendah",
      },
    );
    expect(mockUpdateAgreement).not.toHaveBeenCalled();
  });

  it("throws NotNegotiableError when the employer revises without a worker counter", async () => {
    await expect(
      submitCounter(agreementId, employerId, { price: 550000, reason: null }),
    ).rejects.toThrow(NotNegotiableError);
    expect(mockUpdateAgreement).not.toHaveBeenCalled();
    expect(mockCreateNegotiation).not.toHaveBeenCalled();
  });

  it("updates the agreement price and records an employer round", async () => {
    mockGetLatestNegotiation.mockResolvedValue(workerNegotiation());

    await submitCounter(agreementId, employerId, { price: 550000, reason: null });

    expect(mockUpdateAgreement).toHaveBeenCalledWith(
      expect.anything(),
      agreementId,
      { price: 550000 },
    );
    expect(mockCreateNegotiation).toHaveBeenCalledWith(
      expect.anything(),
      {
        agreementId,
        actorId: employerId,
        role: "employer",
        price: 550000,
      },
    );
  });
});
