import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { z } from "zod";

const uploadSchema = z.object({
  workerId: z.string().uuid(),
  fileType: z.enum(["before", "after"]),
});

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

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json(
        { error: "File is required", code: "FILE_REQUIRED" },
        { status: 400 },
      );
    }

    const parsed = uploadSchema.safeParse({
      workerId: formData.get("workerId"),
      fileType: formData.get("fileType"),
    });
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Data tidak valid", code: "VALIDATION_ERROR" },
        { status: 400 },
      );
    }

    if (user.id !== parsed.data.workerId) {
      return NextResponse.json(
        { error: "Forbidden", code: "FORBIDDEN" },
        { status: 403 },
      );
    }

    const ext = file.name.split(".").pop() ?? "jpg";
    const objectKey = `${parsed.data.workerId}/${parsed.data.fileType}-${Date.now()}.${ext}`;

    const admin = createAdminClient();
    const { error: uploadError } = await admin.storage
      .from("proof-photos")
      .upload(objectKey, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error(uploadError);
      return NextResponse.json(
        { error: "Gagal mengunggah file", code: "UPLOAD_ERROR" },
        { status: 500 },
      );
    }

    const { data: urlData } = admin.storage
      .from("proof-photos")
      .getPublicUrl(objectKey);

    return NextResponse.json({ url: urlData.publicUrl }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Terjadi kesalahan. Silakan coba lagi.", code: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}
