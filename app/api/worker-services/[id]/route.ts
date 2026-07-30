import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { workerServiceUpdateSchema } from "@/lib/validators/worker-service";
import { getServiceById, updateService, deleteService } from "@/lib/repositories/worker-service.repo";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    return NextResponse.json(service);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Terjadi kesalahan. Silakan coba lagi.", code: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
    }

    const existing = await getServiceById(supabase, id);
    if (!existing) {
      return NextResponse.json({ error: "Service not found", code: "NOT_FOUND" }, { status: 404 });
    }
    if (user.id !== existing.worker_id) {
      return NextResponse.json({ error: "Forbidden", code: "FORBIDDEN" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = workerServiceUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Data tidak valid", code: "VALIDATION_ERROR" },
        { status: 400 },
      );
    }

    const service = await updateService(supabase, id, parsed.data);
    return NextResponse.json(service);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Terjadi kesalahan. Silakan coba lagi.", code: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
    }

    const existing = await getServiceById(supabase, id);
    if (!existing) {
      return NextResponse.json({ error: "Service not found", code: "NOT_FOUND" }, { status: 404 });
    }
    if (user.id !== existing.worker_id) {
      return NextResponse.json({ error: "Forbidden", code: "FORBIDDEN" }, { status: 403 });
    }

    await deleteService(supabase, id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Terjadi kesalahan. Silakan coba lagi.", code: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}
