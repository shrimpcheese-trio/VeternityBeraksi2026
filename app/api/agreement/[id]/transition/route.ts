import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { transitionAgreement } from "@/lib/services/agreement-flow";
import { z } from "zod";

const transitionSchema = z.object({
  newStatus: z.enum(["draft", "active", "completed", "disputed"]),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized", code: "UNAUTHORIZED" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const parsed = transitionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: parsed.error.issues[0]?.message ?? "Data tidak valid",
          code: "VALIDATION_ERROR",
        },
        { status: 400 },
      );
    }

    await transitionAgreement(id, parsed.data.newStatus, user.id);
    return NextResponse.json({ status: parsed.data.newStatus });
  } catch (error) {
    if (error instanceof Error && error.name === "NotFoundError") {
      return NextResponse.json(
        { error: "Agreement not found", code: "NOT_FOUND" },
        { status: 404 },
      );
    }
    if (
      error instanceof Error &&
      error.message.startsWith("Invalid transition")
    ) {
      return NextResponse.json(
        { error: error.message, code: "INVALID_TRANSITION" },
        { status: 400 },
      );
    }
    if (error instanceof Error && error.name === "ForbiddenError") {
      return NextResponse.json(
        { error: error.message, code: "FORBIDDEN" },
        { status: 403 },
      );
    }
    console.error(error);
    return NextResponse.json(
      { error: "Terjadi kesalahan. Silakan coba lagi.", code: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}
