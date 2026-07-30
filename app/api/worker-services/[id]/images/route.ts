import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getServiceById, updateService } from "@/lib/repositories/worker-service.repo";
import { uploadServiceImage, deleteServiceImage } from "@/lib/supabase/storage";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
    }

    const service = await getServiceById(supabase, id);
    if (!service) {
      return NextResponse.json({ error: "Service not found", code: "NOT_FOUND" }, { status: 404 });
    }
    if (user.id !== service.worker_id) {
      return NextResponse.json({ error: "Forbidden", code: "FORBIDDEN" }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const imageType = formData.get("type") as string | null;

    if (!file || !imageType) {
      return NextResponse.json(
        { error: "File and type are required", code: "VALIDATION_ERROR" },
        { status: 400 },
      );
    }

    if (!["thumbnail", "gallery"].includes(imageType)) {
      return NextResponse.json(
        { error: "Type must be 'thumbnail' or 'gallery'", code: "VALIDATION_ERROR" },
        { status: 400 },
      );
    }

    const url = await uploadServiceImage(file, id, imageType as "thumbnail" | "gallery");

    if (imageType === "thumbnail") {
      await updateService(supabase, id, { thumbnailUrl: url });
    } else {
      const currentImages: string[] = Array.isArray(service.image_urls)
        ? service.image_urls as string[]
        : [];
      if (currentImages.length >= 5) {
        return NextResponse.json(
          { error: "Maximum 5 gallery images", code: "MAX_IMAGES" },
          { status: 400 },
        );
      }
      await updateService(supabase, id, { imageUrls: [...currentImages, url] });
    }

    return NextResponse.json({ url }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Terjadi kesalahan. Silakan coba lagi.", code: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
    }

    const service = await getServiceById(supabase, id);
    if (!service) {
      return NextResponse.json({ error: "Service not found", code: "NOT_FOUND" }, { status: 404 });
    }
    if (user.id !== service.worker_id) {
      return NextResponse.json({ error: "Forbidden", code: "FORBIDDEN" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");
    const type = searchParams.get("type");

    if (!url || !type) {
      return NextResponse.json(
        { error: "URL and type are required", code: "VALIDATION_ERROR" },
        { status: 400 },
      );
    }

    if (type === "thumbnail") {
      await deleteServiceImage(url);
      await updateService(supabase, id, { thumbnailUrl: null });
    } else {
      const currentImages: string[] = Array.isArray(service.image_urls)
        ? service.image_urls as string[]
        : [];
      const filtered = currentImages.filter((u) => u !== url);
      if (filtered.length < currentImages.length) {
        await deleteServiceImage(url);
      }
      await updateService(supabase, id, { imageUrls: filtered });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Terjadi kesalahan. Silakan coba lagi.", code: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}
