import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { proofOfWorkInputSchema } from "@/lib/validators/proof-of-work";
import { createProofOfWork, listProofsOfWork } from "@/lib/repositories/proof-of-work.repo";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = proofOfWorkInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Data tidak valid", code: "VALIDATION_ERROR" },
        { status: 400 },
      );
    }

    if (user.id !== parsed.data.workerId) {
      return NextResponse.json({ error: "Forbidden", code: "FORBIDDEN" }, { status: 403 });
    }

    const isAdmin = user.user_metadata?.role === "admin";
    const input = isAdmin ? parsed.data : { ...parsed.data, verified: false };

    const proof = await createProofOfWork(supabase, input);
    return NextResponse.json(proof, { status: 201 });
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
      workerId: searchParams.get("workerId") ?? undefined,
      jobType: searchParams.get("jobType") ?? undefined,
      verified: searchParams.has("verified") ? searchParams.get("verified") === "true" : undefined,
    };

    const proofs = await listProofsOfWork(supabase, filters);
    return NextResponse.json(proofs);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Terjadi kesalahan. Silakan coba lagi.", code: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}
