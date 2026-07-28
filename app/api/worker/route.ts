import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { workerInputSchema } from "@/lib/validators/worker";
import { createWorker, listWorkers } from "@/lib/repositories/worker.repo";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = workerInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Data tidak valid", code: "VALIDATION_ERROR" },
        { status: 400 },
      );
    }

    if (user.id !== parsed.data.workerId) {
      return NextResponse.json({ error: "Forbidden", code: "FORBIDDEN" }, { status: 403 });
    }

    const worker = await createWorker(supabase, parsed.data);
    return NextResponse.json(worker, { status: 201 });
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
    const filters = {
      city: searchParams.get("city") ?? undefined,
      jobCategory: searchParams.get("jobCategory") ?? undefined,
    } as { city?: string; jobCategory?: string };

    const workers = await listWorkers(supabase, filters);
    return NextResponse.json(workers);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Terjadi kesalahan. Silakan coba lagi.", code: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}
