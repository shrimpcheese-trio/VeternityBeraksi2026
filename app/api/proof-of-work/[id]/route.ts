import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { proofOfWorkUpdateSchema } from "@/lib/validators/proof-of-work";
import { getProofOfWorkById, updateProofOfWork, deleteProofOfWork } from "@/lib/repositories/proof-of-work.repo";
import { computeTrustScore } from "@/lib/services/trust-engine";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const proof = await getProofOfWorkById(supabase, id);
    if (!proof) {
      return NextResponse.json({ error: "Proof of work not found", code: "NOT_FOUND" }, { status: 404 });
    }
    return NextResponse.json(proof);
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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = proofOfWorkUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Data tidak valid", code: "VALIDATION_ERROR" },
        { status: 400 },
      );
    }

    const existing = await getProofOfWorkById(supabase, id);
    if (!existing) {
      return NextResponse.json({ error: "Proof of work not found", code: "NOT_FOUND" }, { status: 404 });
    }

    const isAdmin = user.user_metadata?.role === "admin";
    if (user.id !== existing.worker_id && !isAdmin) {
      return NextResponse.json({ error: "Forbidden", code: "FORBIDDEN" }, { status: 403 });
    }
    if (parsed.data.verified !== undefined && !isAdmin) {
      return NextResponse.json(
        { error: "Hanya admin yang dapat memverifikasi bukti pekerjaan", code: "FORBIDDEN" },
        { status: 403 },
      );
    }

    const wasVerified = existing.verified;
    const proof = await updateProofOfWork(supabase, id, parsed.data);

    if (wasVerified !== parsed.data.verified) {
      await computeTrustScore(existing.worker_id);
    }

    return NextResponse.json(proof);
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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
    }

    const existing = await getProofOfWorkById(supabase, id);
    if (!existing) {
      return NextResponse.json({ error: "Proof of work not found", code: "NOT_FOUND" }, { status: 404 });
    }
    if (user.id !== existing.worker_id) {
      return NextResponse.json({ error: "Forbidden", code: "FORBIDDEN" }, { status: 403 });
    }

    await deleteProofOfWork(supabase, id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Terjadi kesalahan. Silakan coba lagi.", code: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}
