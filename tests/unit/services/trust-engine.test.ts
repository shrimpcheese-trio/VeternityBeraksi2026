import { computeTrustScore } from "@/lib/services/trust-engine";
import { createMockBuilder, createMockAdminClient } from "../../mocks/supabase";

jest.mock("@/lib/supabase/server", () => ({
  createClient: jest.fn(),
}));

jest.mock("@/lib/supabase/admin", () => ({
  createAdminClient: jest.fn(),
}));

const mockCreateClient = jest.mocked(
  (jest.requireMock("@/lib/supabase/server") as { createClient: jest.Mock }).createClient,
);
const mockCreateAdminClient = jest.mocked(
  (jest.requireMock("@/lib/supabase/admin") as { createAdminClient: jest.Mock }).createAdminClient,
);

const workerId = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";

function setupMocks(config: {
  ratings?: number[];
  verifiedProofCount?: number;
  createdAt?: string;
  agreements?: Array<{ status: string }>;
}) {
  const mockSupabase = {
    from: jest.fn(),
  };

  const mockAdminClient = createMockAdminClient();

  mockCreateClient.mockResolvedValue(mockSupabase);
  mockCreateAdminClient.mockReturnValue(mockAdminClient);

  const ratings = config.ratings ?? [];
  const verifiedProofCount = config.verifiedProofCount ?? 0;
  const createdAt = config.createdAt ?? "2026-01-15T00:00:00Z";
  const agreements = config.agreements ?? [];

  const ratingsData = ratings.map((r) => ({ rating: r }));
  const builder1 = createMockBuilder(ratingsData);
  const builder2 = createMockBuilder([], verifiedProofCount);
  const builder3 = createMockBuilder([{ created_at: createdAt }]);
  const builder4 = createMockBuilder(agreements);

  mockSupabase.from
    .mockReturnValueOnce(builder1)
    .mockReturnValueOnce(builder2)
    .mockReturnValueOnce(builder3)
    .mockReturnValueOnce(builder4);

  return { mockSupabase, mockAdminClient };
}

describe("computeTrustScore", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calculates maximum score when all inputs are perfect", async () => {
    const { mockAdminClient } = setupMocks({
      ratings: [10, 10, 10, 10, 10],
      verifiedProofCount: 5,
      createdAt: "2020-01-01T00:00:00Z",
      agreements: [
        { status: "completed" },
        { status: "completed" },
        { status: "completed" },
      ],
    });

    await computeTrustScore(workerId);

    const upsertCall = (mockAdminClient.from as jest.Mock).mock.calls[0][0];
    expect(upsertCall).toBe("trust_score");

    const upsertArg = (mockAdminClient.from("trust_score").upsert as jest.Mock).mock
      .calls[0][0];
    expect(upsertArg.worker_id).toBe(workerId);
    expect(upsertArg.score).toBeGreaterThanOrEqual(90);
  });

  it("returns zero score when no data exists", async () => {
    const { mockAdminClient } = setupMocks({
      ratings: [],
      verifiedProofCount: 0,
      createdAt: new Date().toISOString(),
      agreements: [],
    });

    await computeTrustScore(workerId);

    const upsertArg = (mockAdminClient.from("trust_score").upsert as jest.Mock).mock
      .calls[0][0];
    expect(upsertArg.score).toBe(0);
  });

  it("penalizes disputed agreements in completion rate", async () => {
    const { mockAdminClient } = setupMocks({
      ratings: [8],
      verifiedProofCount: 2,
      createdAt: "2025-01-01T00:00:00Z",
      agreements: [
        { status: "completed" },
        { status: "disputed" },
        { status: "active" },
      ],
    });

    await computeTrustScore(workerId);

    const upsertArg = (mockAdminClient.from("trust_score").upsert as jest.Mock).mock
      .calls[0][0];
    const breakdown = upsertArg.breakdown as Record<string, number>;
    expect(breakdown.completionScore).toBeLessThan(25);
  });

  it("uses admin client for upsert", async () => {
    setupMocks({
      ratings: [7],
      verifiedProofCount: 1,
      createdAt: "2024-06-01T00:00:00Z",
      agreements: [{ status: "completed" }],
    });

    await computeTrustScore(workerId);

    expect(mockCreateAdminClient).toHaveBeenCalledTimes(1);
    expect(mockCreateClient).toHaveBeenCalledTimes(1);
  });

  it("includes all four breakdown components", async () => {
    const { mockAdminClient } = setupMocks({
      ratings: [7, 8],
      verifiedProofCount: 3,
      createdAt: "2023-01-01T00:00:00Z",
      agreements: [
        { status: "completed" },
        { status: "completed" },
        { status: "active" },
      ],
    });

    await computeTrustScore(workerId);

    const upsertArg = (mockAdminClient.from("trust_score").upsert as jest.Mock).mock
      .calls[0][0];
    const breakdown = upsertArg.breakdown as Record<string, number>;
    expect(breakdown).toHaveProperty("verificationScore");
    expect(breakdown).toHaveProperty("proofScore");
    expect(breakdown).toHaveProperty("completionScore");
    expect(breakdown).toHaveProperty("tenureScore");
  });
});
