import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getProofOfWorkByAgreement } from "@/lib/repositories/proof-of-work.repo";
import {
  uploadProofPhoto,
  ProofOfWorkForbiddenError,
  InvalidPhotoError,
} from "@/lib/services/proof-of-work";
import { z } from "zod";

const fileTypeSchema = z.enum(["before", "after"]);

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
    const fileType = fileTypeSchema.safeParse(formData.get("fileType"));

    if (!file) {
      return NextResponse.json(
        { error: "File is required", code: "FILE_REQUIRED" },
        { status: 400 },
      );
    }
    if (!fileType.success) {
      return NextResponse.json(
        { error: "Tipe foto harus before atau after", code: "VALIDATION_ERROR" },
        { status: 400 },
      );
    }

    const proof = await uploadProofPhoto(id, fileType.data, file, user.id);
    return NextResponse.json({ proof }, { status: 201 });
  } catch (error) {
    if (error instanceof ProofOfWorkForbiddenError) {
      return NextResponse.json(
        { error: error.message, code: "FORBIDDEN" },
        { status: 403 },
      );
    }
    if (error instanceof InvalidPhotoError) {
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

export async function GET(
  _request: NextRequest,
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

    const admin = createAdminClient();
    const proof = await getProofOfWorkByAgreement(admin, id);
    return NextResponse.json({ proof });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Terjadi kesalahan. Silakan coba lagi.", code: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}
