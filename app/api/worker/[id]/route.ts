import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { workerUpdateSchema } from "@/lib/validators/worker";
import { getWorkerById, updateWorker, deleteWorker } from "@/lib/repositories/worker.repo";
import { requireRole } from "@/lib/auth/require-role";
import { UnauthorizedError, ForbiddenError } from "@/lib/errors";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const worker = await getWorkerById(supabase, id);
    if (!worker) {
      return NextResponse.json({ error: "Worker not found", code: "NOT_FOUND" }, { status: 404 });
    }
    return NextResponse.json(worker);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Terjadi kesalahan. Silakan coba lagi.", code: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    let actor;
    try {
      actor = await requireRole(request, "worker");
    } catch (e) {
      if (e instanceof UnauthorizedError) {
        return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
      }
      if (e instanceof ForbiddenError) {
        return NextResponse.json({ error: "Forbidden", code: "FORBIDDEN" }, { status: 403 });
      }
      throw e;
    }
    if (actor.profile.worker_id !== id) {
      return NextResponse.json({ error: "Forbidden", code: "FORBIDDEN" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = workerUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Data tidak valid", code: "VALIDATION_ERROR" },
        { status: 400 },
      );
    }

    const worker = await updateWorker(supabase, id, parsed.data);
    return NextResponse.json(worker);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Terjadi kesalahan. Silakan coba lagi.", code: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    let actor;
    try {
      actor = await requireRole(_request, "worker");
    } catch (e) {
      if (e instanceof UnauthorizedError) {
        return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
      }
      if (e instanceof ForbiddenError) {
        return NextResponse.json({ error: "Forbidden", code: "FORBIDDEN" }, { status: 403 });
      }
      throw e;
    }
    if (actor.profile.worker_id !== id) {
      return NextResponse.json({ error: "Forbidden", code: "FORBIDDEN" }, { status: 403 });
    }

    await deleteWorker(supabase, id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Terjadi kesalahan. Silakan coba lagi.", code: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}
