import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  uploadReviewPhoto,
  ReviewNotFoundError,
  ReviewForbiddenError,
  InvalidReviewPhotoError,
} from "@/lib/services/review";

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

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json(
        { error: "File is required", code: "FILE_REQUIRED" },
        { status: 400 },
      );
    }

    const photoUrl = await uploadReviewPhoto(id, file, user.id);
    return NextResponse.json({ url: photoUrl }, { status: 201 });
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
    if (error instanceof InvalidReviewPhotoError) {
      return NextResponse.json(
        { error: error.message, code: "INVALID_PHOTO" },
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
