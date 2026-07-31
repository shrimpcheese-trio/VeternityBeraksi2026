import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { reviewInputSchema } from "@/lib/validators/review";
import { listReviewsByWorker } from "@/lib/repositories/review.repo";
import {
  submitReview,
  ReviewNotFoundError,
  ReviewForbiddenError,
} from "@/lib/services/review";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized", code: "UNAUTHORIZED" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const parsed = reviewInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Data tidak valid", code: "VALIDATION_ERROR" },
        { status: 400 },
      );
    }

    const review = await submitReview(parsed.data, user.id);
    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    if (error instanceof ReviewNotFoundError) {
      return NextResponse.json(
        { error: error.message, code: "NOT_FOUND" },
        { status: 404 },
      );
    }
    if (error instanceof ReviewForbiddenError) {
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workerId = searchParams.get("workerId");
    if (!workerId) {
      return NextResponse.json(
        { error: "workerId query parameter is required", code: "VALIDATION_ERROR" },
        { status: 400 },
      );
    }

    const admin = createAdminClient();
    const reviews = await listReviewsByWorker(admin, workerId);
    return NextResponse.json(reviews);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Terjadi kesalahan. Silakan coba lagi.", code: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}
