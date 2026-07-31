import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const ALLOWED_MIME_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_FILE_SIZE = 2 * 1024 * 1024;

const avatarObjectKey = (userId: string) => `${userId}/avatar`;

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
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
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Format gambar tidak didukung", code: "INVALID_FILE_TYPE" },
        { status: 400 },
      );
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Ukuran foto maksimal 2MB", code: "FILE_TOO_LARGE" },
        { status: 400 },
      );
    }

    const objectKey = avatarObjectKey(user.id);
    const admin = createAdminClient();
    const { error: uploadError } = await admin.storage
      .from("avatars")
      .upload(objectKey, file, {
        contentType: file.type,
        upsert: true,
      });
    if (uploadError) {
      console.error(uploadError);
      return NextResponse.json(
        { error: "Gagal mengunggah foto", code: "UPLOAD_ERROR" },
        { status: 500 },
      );
    }

    const { data: urlData } = admin.storage.from("avatars").getPublicUrl(objectKey);
    const publicUrl = urlData.publicUrl;

    const { error: updateError } = await supabase.auth.updateUser({
      data: { avatar_custom_url: publicUrl },
    });
    if (updateError) {
      console.error(updateError);
      return NextResponse.json(
        { error: "Gagal menyimpan foto profil", code: "METADATA_UPDATE_ERROR" },
        { status: 500 },
      );
    }

    return NextResponse.json({ url: publicUrl }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Terjadi kesalahan. Silakan coba lagi.", code: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized", code: "UNAUTHORIZED" },
        { status: 401 },
      );
    }

    const admin = createAdminClient();
    await admin.storage.from("avatars").remove([avatarObjectKey(user.id)]);

    const { error: updateError } = await supabase.auth.updateUser({
      data: { avatar_custom_url: null },
    });
    if (updateError) {
      console.error(updateError);
      return NextResponse.json(
        { error: "Gagal menghapus foto profil", code: "METADATA_UPDATE_ERROR" },
        { status: 500 },
      );
    }

    return NextResponse.json({ removed: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Terjadi kesalahan. Silakan coba lagi.", code: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}
