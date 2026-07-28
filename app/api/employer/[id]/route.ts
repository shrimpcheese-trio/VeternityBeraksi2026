import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { employerUpdateSchema } from "@/lib/validators/employer";
import { getEmployerById, updateEmployer, deleteEmployer } from "@/lib/repositories/employer.repo";
import { requireRole } from "@/lib/auth/require-role";
import { UnauthorizedError, ForbiddenError } from "@/lib/errors";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const employer = await getEmployerById(supabase, id);
    if (!employer) {
      return NextResponse.json({ error: "Employer not found", code: "NOT_FOUND" }, { status: 404 });
    }
    return NextResponse.json(employer);
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
      actor = await requireRole(request, "employer");
    } catch (e) {
      if (e instanceof UnauthorizedError) {
        return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
      }
      if (e instanceof ForbiddenError) {
        return NextResponse.json({ error: "Forbidden", code: "FORBIDDEN" }, { status: 403 });
      }
      throw e;
    }
    if (actor.profile.employer_id !== id) {
      return NextResponse.json({ error: "Forbidden", code: "FORBIDDEN" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = employerUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Data tidak valid", code: "VALIDATION_ERROR" },
        { status: 400 },
      );
    }

    const employer = await updateEmployer(supabase, id, parsed.data);
    return NextResponse.json(employer);
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
      actor = await requireRole(_request, "employer");
    } catch (e) {
      if (e instanceof UnauthorizedError) {
        return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
      }
      if (e instanceof ForbiddenError) {
        return NextResponse.json({ error: "Forbidden", code: "FORBIDDEN" }, { status: 403 });
      }
      throw e;
    }
    if (actor.profile.employer_id !== id) {
      return NextResponse.json({ error: "Forbidden", code: "FORBIDDEN" }, { status: 403 });
    }

    await deleteEmployer(supabase, id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Terjadi kesalahan. Silakan coba lagi.", code: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}
