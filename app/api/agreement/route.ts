import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { agreementInputSchema } from "@/lib/validators/agreement";
import { createAgreement, listAgreements } from "@/lib/repositories/agreement.repo";
import { getWorkerById } from "@/lib/repositories/worker.repo";
import { getEmployerById } from "@/lib/repositories/employer.repo";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = agreementInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Data tidak valid", code: "VALIDATION_ERROR" },
        { status: 400 },
      );
    }

    if (user.id !== parsed.data.workerId && user.id !== parsed.data.employerId) {
      return NextResponse.json(
        { error: "You must be the worker or employer on this agreement", code: "FORBIDDEN" },
        { status: 403 },
      );
    }

    const worker = await getWorkerById(supabase, parsed.data.workerId);
    if (!worker) {
      return NextResponse.json(
        { error: "Worker profile not found", code: "WORKER_NOT_FOUND" },
        { status: 400 },
      );
    }

    if (parsed.data.employerId) {
      const employer = await getEmployerById(supabase, parsed.data.employerId);
      if (!employer) {
        return NextResponse.json(
          { error: "Employer profile not found", code: "EMPLOYER_NOT_FOUND" },
          { status: 400 },
        );
      }
    }

    const agreement = await createAgreement(supabase, parsed.data);
    return NextResponse.json(agreement, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Terjadi kesalahan. Silakan coba lagi.", code: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const filters: Parameters<typeof listAgreements>[1] = {
      workerId: searchParams.get("workerId") ?? undefined,
      employerId: searchParams.get("employerId") ?? undefined,
    };
    const rawStatus = searchParams.get("status");
    if (rawStatus === "active" || rawStatus === "completed" || rawStatus === "disputed") {
      filters.status = rawStatus;
    }

    const agreements = await listAgreements(supabase, filters);
    return NextResponse.json(agreements);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Terjadi kesalahan. Silakan coba lagi.", code: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}
