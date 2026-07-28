import { createClient } from "@/lib/supabase/server";
import { getWorkerById } from "@/lib/repositories/worker.repo";
import { getEmployerById } from "@/lib/repositories/employer.repo";
import { UnauthorizedError, ForbiddenError } from "@/lib/errors";
import type { Database } from "@/types/supabase";

type WorkerRow = Database["public"]["Tables"]["worker_profiles"]["Row"];
type EmployerRow = Database["public"]["Tables"]["employer_profiles"]["Row"];

interface RequireWorkerResult {
  session: { id: string };
  profile: WorkerRow;
}

interface RequireEmployerResult {
  session: { id: string };
  profile: EmployerRow;
}

export async function requireRole(
  _req: Request,
  role: "worker",
): Promise<RequireWorkerResult>;

export async function requireRole(
  _req: Request,
  role: "employer",
): Promise<RequireEmployerResult>;

export async function requireRole(
  _req: Request,
  role: "worker" | "employer",
): Promise<RequireWorkerResult | RequireEmployerResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new UnauthorizedError();

  if (role === "worker") {
    const profile = await getWorkerById(supabase, user.id);
    if (!profile) throw new ForbiddenError("No worker profile for this user");
    return { session: { id: user.id }, profile };
  }

  const profile = await getEmployerById(supabase, user.id);
  if (!profile) throw new ForbiddenError("No employer profile for this user");
  return { session: { id: user.id }, profile };
}
