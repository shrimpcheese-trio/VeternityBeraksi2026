import { computeTrustScore } from "@/lib/services/trust-engine";
import { workerInputSchema } from "@/lib/validators/worker";
import { proofOfWorkInputSchema } from "@/lib/validators/proof-of-work";
import { verificationInputSchema } from "@/lib/validators/verification";
import { agreementInputSchema } from "@/lib/validators/agreement";
import { createMockBuilder } from "../mocks/supabase";

jest.mock("@/lib/supabase/admin", () => ({
  createAdminClient: jest.fn(),
}));

const mockCreateAdminClient = jest.mocked(
  (jest.requireMock("@/lib/supabase/admin") as { createAdminClient: jest.Mock }).createAdminClient,
);

const WORKER_ID = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";
const VERIFIER_ID = "b2c3d4e5-f6a7-8901-bcde-f12345678901";

describe("Core Loop: Profile → Proof of Work → Trust Score", () => {
  it("validates worker profile creation", () => {
    const input = {
      workerId: WORKER_ID,
      fullName: "Slamet Riyadi",
      city: "Surakarta",
      jobCategory: "Tukang Kayu",
      yearsExperience: 8,
    };

    const parsed = workerInputSchema.safeParse(input);
    expect(parsed.success).toBe(true);
  });

  it("validates proof of work submission", () => {
    const input = {
      workerId: WORKER_ID,
      jobType: "Membuat Lemari Custom",
      jobValue: 2500000,
      photoBeforeUrl: "https://storage.example.com/kayu-before.jpg",
      photoAfterUrl: "https://storage.example.com/kayu-after.jpg",
      locationLat: -7.5567,
      locationLng: 110.8317,
      customerConfirmed: true,
      verified: false,
      jobDate: "2026-07-20",
    };

    const parsed = proofOfWorkInputSchema.safeParse(input);
    expect(parsed.success).toBe(true);
  });

  it("validates community verification", () => {
    const input = {
      workerId: WORKER_ID,
      verifierName: "Pak Lurah Hartono",
      verifierRole: "ketua_rt",
      statement: "Slamet sudah 5 tahun menjadi tukang kayu andalan di sini.",
      rating: 9,
    };

    const parsed = verificationInputSchema.safeParse(input);
    expect(parsed.success).toBe(true);
  });

  it("validates agreement creation", () => {
    const input = {
      workerId: WORKER_ID,
      employerId: VERIFIER_ID,
      price: 3000000,
      location: "Jl. Slamet Riyadi No. 45, Surakarta",
      workHours: "09:00 - 17:00",
      jobDescription: "Renovasi dapur dan pembuatan kitchen set",
      status: "active" as const,
    };

    const parsed = agreementInputSchema.safeParse(input);
    expect(parsed.success).toBe(true);
  });

  it("computeTrustScore produces non-negative score with complete data", async () => {
    const adminClient = { from: jest.fn() };
    mockCreateAdminClient.mockReturnValue(adminClient);

    adminClient.from
      .mockReturnValueOnce(createMockBuilder([{ rating: 9 }, { rating: 8 }]))
      .mockReturnValueOnce(createMockBuilder([{ rating: 5 }, { rating: 4 }]))
      .mockReturnValueOnce(createMockBuilder([], 4))
      .mockReturnValueOnce(createMockBuilder([{ created_at: "2024-01-10T00:00:00Z" }]))
      .mockReturnValueOnce(
        createMockBuilder([
          { status: "completed" },
          { status: "completed" },
          { status: "completed" },
          { status: "completed" },
          { status: "active" },
        ]),
      );

    const upsert = jest.fn().mockResolvedValue({ error: null });
    adminClient.from.mockReturnValueOnce({ upsert });

    const mirrorUpdate = { eq: jest.fn().mockResolvedValue({ error: null }) };
    adminClient.from.mockReturnValueOnce({ update: jest.fn().mockReturnValue(mirrorUpdate) });

    await computeTrustScore(WORKER_ID);

    const upsertArg = upsert.mock.calls[0][0];
    expect(upsertArg.score).toBeGreaterThan(0);
    expect(upsertArg.score).toBeLessThanOrEqual(100);

    const breakdown = upsertArg.breakdown as Record<string, number>;
    expect(breakdown.verificationScore).toBeGreaterThan(0);
    expect(breakdown.reviewScore).toBeGreaterThan(0);
    expect(breakdown.proofScore).toBeGreaterThan(0);
    expect(breakdown.completionScore).toBeGreaterThan(0);
    expect(breakdown.tenureScore).toBeGreaterThan(0);
  });
});
