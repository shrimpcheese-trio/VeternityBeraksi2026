import { computeTrustScore } from "@/lib/services/trust-engine";
import { createMockBuilder } from "../../mocks/supabase";

jest.mock("@/lib/supabase/admin", () => ({
  createAdminClient: jest.fn(),
}));

jest.mock("@/lib/supabase/server", () => ({
  createClient: jest.fn(),
}));

const mockCreateAdminClient = jest.mocked(
  (jest.requireMock("@/lib/supabase/admin") as { createAdminClient: jest.Mock }).createAdminClient,
);
const mockCreateClient = jest.mocked(
  (jest.requireMock("@/lib/supabase/server") as { createClient: jest.Mock }).createClient,
);

const workerId = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";

function createErrorBuilder() {
  const result = { data: null, count: null, error: new Error("connection refused") };
  const builder: {
    select: jest.Mock;
    eq: jest.Mock;
    not: jest.Mock;
    single: jest.Mock;
    then: (onFulfilled: (value: typeof result) => unknown) => Promise<unknown>;
    catch: (onRejected: (reason: unknown) => unknown) => Promise<unknown>;
    finally: (onFinally: () => void) => Promise<unknown>;
  } = {
    select: jest.fn(() => builder),
    eq: jest.fn(() => builder),
    not: jest.fn(() => builder),
    single: jest.fn(() => builder),
    then: (onFulfilled) => Promise.resolve(result).then(onFulfilled),
    catch: (onRejected) => Promise.resolve(result).catch(onRejected),
    finally: (onFinally) => Promise.resolve(result).finally(onFinally),
  };
  return builder;
}

function setupMocks(config: {
  ratings?: number[];
  reviewRatings?: number[];
  verifiedProofCount?: number;
  createdAt?: string;
  agreements?: Array<{ status: string }>;
  failRead?: boolean;
}) {
  const adminClient = { from: jest.fn() };
  mockCreateAdminClient.mockReturnValue(adminClient);

  const ratings = config.ratings ?? [];
  const reviewRatings = config.reviewRatings ?? [];
  const verifiedProofCount = config.verifiedProofCount ?? 0;
  const createdAt = config.createdAt ?? "2026-01-15T00:00:00Z";
  const agreements = config.agreements ?? [];

  const builderVerif = config.failRead
    ? createErrorBuilder()
    : createMockBuilder(ratings.map((r) => ({ rating: r })));
  const builderReviews = createMockBuilder(reviewRatings.map((r) => ({ rating: r })));
  const builderProofs = createMockBuilder([], verifiedProofCount);
  const builderProfile = createMockBuilder([{ created_at: createdAt }]);
  const builderAgreements = createMockBuilder(agreements);

  adminClient.from
    .mockReturnValueOnce(builderVerif)
    .mockReturnValueOnce(builderReviews)
    .mockReturnValueOnce(builderProofs)
    .mockReturnValueOnce(builderProfile)
    .mockReturnValueOnce(builderAgreements);

  const upsert = jest.fn().mockResolvedValue({ error: null });
  adminClient.from.mockReturnValueOnce({ upsert });

  const mirrorUpdate = { eq: jest.fn().mockResolvedValue({ error: null }) };
  const update = jest.fn().mockReturnValue(mirrorUpdate);
  adminClient.from.mockReturnValueOnce({ update });

  return { adminClient, upsert, mirrorUpdate };
}

describe("computeTrustScore", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calculates maximum score when all inputs are perfect", async () => {
    const { adminClient, upsert, mirrorUpdate } = setupMocks({
      ratings: [10, 10, 10, 10, 10],
      reviewRatings: [5, 5, 5, 5, 5],
      verifiedProofCount: 5,
      createdAt: "2020-01-01T00:00:00Z",
      agreements: [
        { status: "completed" },
        { status: "completed" },
        { status: "completed" },
      ],
    });

    await computeTrustScore(workerId);

    const upsertCall = adminClient.from.mock.calls[5][0];
    expect(upsertCall).toBe("trust_score");

    const upsertArg = upsert.mock.calls[0][0];
    expect(upsertArg.worker_id).toBe(workerId);
    expect(upsertArg.score).toBe(100);

    const mirrorArg = mirrorUpdate.eq.mock.calls[0][1];
    expect(mirrorArg).toBe(workerId);
    expect(mockCreateClient).not.toHaveBeenCalled();
  });

  it("returns zero score when no data exists", async () => {
    const { upsert, mirrorUpdate } = setupMocks({
      ratings: [],
      reviewRatings: [],
      verifiedProofCount: 0,
      createdAt: new Date().toISOString(),
      agreements: [],
    });

    await computeTrustScore(workerId);

    const upsertArg = upsert.mock.calls[0][0];
    expect(upsertArg.score).toBe(0);
    expect(mirrorUpdate.eq).toHaveBeenCalled();
  });

  it("penalizes disputed agreements in completion rate", async () => {
    const { upsert } = setupMocks({
      ratings: [8],
      reviewRatings: [4],
      verifiedProofCount: 2,
      createdAt: "2025-01-01T00:00:00Z",
      agreements: [
        { status: "completed" },
        { status: "disputed" },
        { status: "active" },
      ],
    });

    await computeTrustScore(workerId);

    const upsertArg = upsert.mock.calls[0][0];
    const breakdown = upsertArg.breakdown as Record<string, number>;
    expect(breakdown.completionScore).toBeLessThan(25);
  });

  it("uses the admin client for both reads and writes", async () => {
    setupMocks({
      ratings: [7],
      reviewRatings: [4],
      verifiedProofCount: 1,
      createdAt: "2024-06-01T00:00:00Z",
      agreements: [{ status: "completed" }],
    });

    await computeTrustScore(workerId);

    expect(mockCreateAdminClient).toHaveBeenCalledTimes(1);
    expect(mockCreateClient).not.toHaveBeenCalled();
  });

  it("includes all five breakdown components", async () => {
    const { upsert } = setupMocks({
      ratings: [7, 8],
      reviewRatings: [4, 5],
      verifiedProofCount: 3,
      createdAt: "2023-01-01T00:00:00Z",
      agreements: [
        { status: "completed" },
        { status: "completed" },
        { status: "active" },
      ],
    });

    await computeTrustScore(workerId);

    const upsertArg = upsert.mock.calls[0][0];
    const breakdown = upsertArg.breakdown as Record<string, number>;
    expect(breakdown).toHaveProperty("verificationScore");
    expect(breakdown).toHaveProperty("reviewScore");
    expect(breakdown).toHaveProperty("proofScore");
    expect(breakdown).toHaveProperty("completionScore");
    expect(breakdown).toHaveProperty("tenureScore");
  });

  it("rewards strong employer reviews", async () => {
    const { upsert } = setupMocks({
      ratings: [],
      reviewRatings: [5, 5],
      verifiedProofCount: 0,
      createdAt: new Date().toISOString(),
      agreements: [],
    });

    await computeTrustScore(workerId);

    const upsertArg = upsert.mock.calls[0][0];
    const breakdown = upsertArg.breakdown as Record<string, number>;
    expect(breakdown.reviewScore).toBe(25);
  });

  it("skips the upsert when a read fails", async () => {
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});
    const { upsert } = setupMocks({
      ratings: [8],
      failRead: true,
    });

    await computeTrustScore(workerId);

    expect(upsert).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });
});
