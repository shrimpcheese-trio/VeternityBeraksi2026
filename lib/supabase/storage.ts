import { createClient } from "@/lib/supabase/client";

const BUCKET = "service-photos";

export async function uploadServiceImage(
  file: File,
  serviceId: string,
  type: "thumbnail" | "gallery",
): Promise<string> {
  const supabase = createClient();
  const ext = file.name.split(".").pop() ?? "jpg";
  const timestamp = Date.now();
  const path = `${serviceId}/${type}-${timestamp}.${ext}`;

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

export async function deleteServiceImage(url: string): Promise<void> {
  const supabase = createClient();
  const path = url.split("/").pop();
  if (!path) return;

  await supabase.storage.from(BUCKET).remove([path]);
}
