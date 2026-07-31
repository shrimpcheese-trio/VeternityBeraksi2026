import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { submitCounter, NotFoundError, ForbiddenError, NotNegotiableError, ReasonRequiredError } from "@/lib/services/negotiation";
import { negotiationInputSchema } from "@/lib/validators/negotiation";

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
    const parsed = negotiationInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: parsed.error.issues[0]?.message ?? "Data tidak valid",
          code: "VALIDATION_ERROR",
        },
        { status: 400 },
      );
    }

    const agreement = await submitCounter(id, user.id, parsed.data);
    return NextResponse.json(agreement, { status: 201 });
  } catch (error) {
    if (error instanceof NotFoundError) {
      return NextResponse.json(
        { error: "Agreement not found", code: "NOT_FOUND" },
        { status: 404 },
      );
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json(
        { error: error.message, code: "FORBIDDEN" },
        { status: 403 },
      );
    }
    if (error instanceof NotNegotiableError) {
      return NextResponse.json(
        { error: error.message, code: "NEGOTIATION_NOT_OPEN" },
        { status: 400 },
      );
    }
    if (error instanceof ReasonRequiredError) {
      return NextResponse.json(
        { error: error.message, code: "REASON_REQUIRED" },
        { status: 400 },
      );
    }
    console.error(error);
    return NextResponse.json(
      { error: "Terjadi kesalahan. Silakan coba lagi.", code: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}
