import {
  uploadProofPhoto,
  ProofOfWorkForbiddenError,
  InvalidPhotoError,
} from "@/lib/services/proof-of-work";

jest.mock("@/lib/supabase/admin", () => ({
  createAdminClient: jest.fn(),
}));

jest.mock("@/lib/repositories/agreement.repo", () => ({
  getAgreementById: jest.fn(),
}));

jest.mock("@/lib/repositories/proof-of-work.repo", () => ({
  createProofOfWork: jest.fn(),
  getProofOfWorkByAgreement: jest.fn(),
  updateProofOfWork: jest.fn(),
}));

const mockCreateAdminClient = jest.mocked(
  (jest.requireMock("@/lib/supabase/admin") as { createAdminClient: jest.Mock }).createAdminClient,
);
const mockGetAgreementById = jest.mocked(
  (jest.requireMock("@/lib/repositories/agreement.repo") as { getAgreementById: jest.Mock }).getAgreementById,
);
const mockCreateProofOfWork = jest.mocked(
  (jest.requireMock("@/lib/repositories/proof-of-work.repo") as { createProofOfWork: jest.Mock }).createProofOfWork,
);
const mockGetProofOfWorkByAgreement = jest.mocked(
  (jest.requireMock("@/lib/repositories/proof-of-work.repo") as { getProofOfWorkByAgreement: jest.Mock }).getProofOfWorkByAgreement,
);
const mockUpdateProofOfWork = jest.mocked(
  (jest.requireMock("@/lib/repositories/proof-of-work.repo") as { updateProofOfWork: jest.Mock }).updateProofOfWork,
);

const agreementId = "ag-001";
const workerId = "w-001";
const otherWorkerId = "w-999";

function fakeFile(overrides?: Partial<File>): File {
  return {
    name: "sebelum.jpg",
    type: "image/jpeg",
    size: 1024,
    ...overrides,
  } as File;
}

function activeAgreement(overrides?: Record<string, unknown>) {
  return {
    agreement_id: agreementId,
    worker_id: workerId,
    employer_id: "e-001",
    price: 500000,
    status: "active",
    location: "Jakarta",
    work_hours: "8",
    job_description: "Perbaikan AC",
    created_at: "2026-07-01T00:00:00Z",
    employer_profiles: null,
    worker_profiles: {
      worker_id: workerId,
      full_name: "Pak Budi",
      city: "Jakarta",
      job_category: "Teknisi AC",
      years_experience: 3,
      trust_score: 0,
      bio: null,
      location_visible: true,
      created_at: "2026-06-01T00:00:00Z",
      updated_at: "2026-06-01T00:00:00Z",
    },
    ...overrides,
  };
}

function existingProof(photoAfterUrl: string | null) {
  return {
    proof_id: "proof-001",
    worker_id: workerId,
    agreement_id: agreementId,
    job_type: "Teknisi AC",
    job_value: 500000,
    photo_before_url: "https://storage.example.com/before.jpg",
    photo_after_url: photoAfterUrl,
    customer_confirmed: false,
    verified: false,
    job_date: "2026-07-30",
  };
}

describe("uploadProofPhoto", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const upload = jest.fn().mockResolvedValue({ data: { path: "x" }, error: null });
    const getPublicUrl = jest.fn(() => ({
      data: { publicUrl: "https://storage.example.com/x.jpg" },
    }));
    mockCreateAdminClient.mockReturnValue({
      storage: {
        from: jest.fn(() => ({ upload, getPublicUrl })),
      },
    });
  });

  it("throws ProofOfWorkForbiddenError when agreement does not exist", async () => {
    mockGetAgreementById.mockResolvedValue(null);

    await expect(
      uploadProofPhoto(agreementId, "before", fakeFile(), workerId),
    ).rejects.toThrow(ProofOfWorkForbiddenError);
  });

  it("throws ProofOfWorkForbiddenError when actor is not the worker", async () => {
    mockGetAgreementById.mockResolvedValue(activeAgreement());

    await expect(
      uploadProofPhoto(agreementId, "before", fakeFile(), otherWorkerId),
    ).rejects.toThrow(ProofOfWorkForbiddenError);
  });

  it("throws ProofOfWorkForbiddenError when agreement is not active", async () => {
    mockGetAgreementById.mockResolvedValue(activeAgreement({ status: "draft" }));

    await expect(
      uploadProofPhoto(agreementId, "before", fakeFile(), workerId),
    ).rejects.toThrow(ProofOfWorkForbiddenError);
  });

  it("rejects unsupported file type", async () => {
    mockGetAgreementById.mockResolvedValue(activeAgreement());

    await expect(
      uploadProofPhoto(agreementId, "before", fakeFile({ type: "text/plain" }), workerId),
    ).rejects.toThrow(InvalidPhotoError);
  });

  it("rejects file larger than 5 MB", async () => {
    mockGetAgreementById.mockResolvedValue(activeAgreement());

    await expect(
      uploadProofPhoto(agreementId, "before", fakeFile({ size: 6 * 1024 * 1024 }), workerId),
    ).rejects.toThrow(InvalidPhotoError);
  });

  it("creates a proof row when none exists for the agreement", async () => {
    mockGetAgreementById.mockResolvedValue(activeAgreement());
    mockGetProofOfWorkByAgreement.mockResolvedValue(null);
    mockCreateProofOfWork.mockResolvedValue(existingProof(null));

    const proof = await uploadProofPhoto(agreementId, "before", fakeFile(), workerId);

    expect(mockCreateProofOfWork).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({
        workerId,
        agreementId,
        jobType: "Teknisi AC",
        jobValue: 500000,
        photoBeforeUrl: "https://storage.example.com/x.jpg",
        photoAfterUrl: null,
        verified: false,
      }),
    );
    expect(proof).toEqual(existingProof(null));
  });

  it("updates the photo field when a proof already exists", async () => {
    mockGetAgreementById.mockResolvedValue(activeAgreement());
    mockGetProofOfWorkByAgreement.mockResolvedValue(existingProof(null));
    mockUpdateProofOfWork.mockResolvedValue(
      existingProof("https://storage.example.com/x.jpg"),
    );

    const proof = await uploadProofPhoto(agreementId, "after", fakeFile({ name: "sesudah.jpg" }), workerId);

    expect(mockUpdateProofOfWork).toHaveBeenCalledWith(
      expect.any(Object),
      "proof-001",
      { photoAfterUrl: "https://storage.example.com/x.jpg" },
    );
    expect(proof.photo_after_url).toBe("https://storage.example.com/x.jpg");
  });
});
