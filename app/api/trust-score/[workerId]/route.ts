import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ workerId: string }> }) {
  try {
    const { workerId } = await params;
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("trust_score")
      .select("*")
      .eq("worker_id", workerId)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Trust score not found", code: "NOT_FOUND" }, { status: 404 });
    }

    return NextResponse.json({
      score: data.score,
      breakdown: data.breakdown,
      updated_at: data.updated_at,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Terjadi kesalahan. Silakan coba lagi.", code: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}
