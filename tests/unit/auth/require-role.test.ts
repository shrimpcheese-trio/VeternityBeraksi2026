import { requireRole } from "@/lib/auth/require-role";
import { UnauthorizedError, ForbiddenError } from "@/lib/errors";

jest.mock("@/lib/supabase/server", () => ({
  createClient: jest.fn(),
}));

jest.mock("@/lib/repositories/worker.repo", () => ({
  getWorkerById: jest.fn(),
}));

jest.mock("@/lib/repositories/employer.repo", () => ({
  getEmployerById: jest.fn(),
}));

const mockCreateClient = jest.mocked(
  (jest.requireMock("@/lib/supabase/server") as { createClient: jest.Mock }).createClient,
);
const mockGetWorkerById = jest.mocked(
  (jest.requireMock("@/lib/repositories/worker.repo") as { getWorkerById: jest.Mock }).getWorkerById,
);
const mockGetEmployerById = jest.mocked(
  (jest.requireMock("@/lib/repositories/employer.repo") as { getEmployerById: jest.Mock }).getEmployerById,
);

const userId = "u-001";
const fakeReq = new Request("http://localhost:3000");

function mockAuthUser(user: { id: string } | null) {
  const mockSupabase = {
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user }, error: null }),
    },
  };
  mockCreateClient.mockResolvedValue(mockSupabase);
  return mockSupabase;
}

describe("requireRole", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("worker role", () => {
    it("throws UnauthorizedError when no user is authenticated", async () => {
      mockAuthUser(null);

      await expect(requireRole(fakeReq, "worker")).rejects.toThrow(
        UnauthorizedError,
      );
    });

    it("throws ForbiddenError when user has no worker profile", async () => {
      mockAuthUser({ id: userId });
      mockGetWorkerById.mockResolvedValue(null);

      await expect(requireRole(fakeReq, "worker")).rejects.toThrow(
        ForbiddenError,
      );
    });

    it("returns session and profile for valid worker", async () => {
      const profile = {
        worker_id: userId,
        full_name: "Budi Santoso",
        city: "Jakarta",
        job_category: "tukang",
        years_experience: 5,
        trust_score: 75,
        created_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-07-01T00:00:00Z",
      };
      mockAuthUser({ id: userId });
      mockGetWorkerById.mockResolvedValue(profile);

      const result = await requireRole(fakeReq, "worker");

      expect(result.session.id).toBe(userId);
      expect(result.profile).toEqual(profile);
    });
  });

  describe("employer role", () => {
    it("throws UnauthorizedError when no user is authenticated", async () => {
      mockAuthUser(null);

      await expect(requireRole(fakeReq, "employer")).rejects.toThrow(
        UnauthorizedError,
      );
    });

    it("throws ForbiddenError when user has no employer profile", async () => {
      mockAuthUser({ id: userId });
      mockGetEmployerById.mockResolvedValue(null);

      await expect(requireRole(fakeReq, "employer")).rejects.toThrow(
        ForbiddenError,
      );
    });

    it("returns session and profile for valid employer", async () => {
      const profile = {
        employer_id: userId,
        company_name: "PT Maju Jaya",
        city: "Bandung",
        phone: "08123456789",
        created_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-07-01T00:00:00Z",
      };
      mockAuthUser({ id: userId });
      mockGetEmployerById.mockResolvedValue(profile);

      const result = await requireRole(fakeReq, "employer");

      expect(result.session.id).toBe(userId);
      expect(result.profile).toEqual(profile);
    });
  });
});
