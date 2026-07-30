import type { SupabaseClient } from "@supabase/supabase-js";
import type { WorkerServiceInput, WorkerServiceUpdate } from "@/lib/validators/worker-service";
import type { Database } from "@/types/supabase";

type Client = SupabaseClient<Database>;

type ServiceRow = Database["public"]["Tables"]["worker_services"]["Row"];

function from(client: Client) {
  return client.from("worker_services");
}

export async function createService(client: Client, workerId: string, input: WorkerServiceInput) {
  const { data, error } = await from(client)
    .insert({
      worker_id: workerId,
      name: input.name,
      description: input.description ?? null,
      price: input.price,
      price_unit: input.priceUnit,
      category: input.category ?? null,
      thumbnail_url: input.thumbnailUrl ?? null,
      image_urls: input.imageUrls ?? [],
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getServiceById(client: Client, serviceId: string): Promise<ServiceRow | null> {
  const { data, error } = await from(client)
    .select("*")
    .eq("service_id", serviceId)
    .single();

  if (error) return null;
  return data;
}

export async function updateService(client: Client, serviceId: string, input: WorkerServiceUpdate) {
  const { data, error } = await from(client)
    .update({
      ...(input.name !== undefined && { name: input.name }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.price !== undefined && { price: input.price }),
      ...(input.priceUnit !== undefined && { price_unit: input.priceUnit }),
      ...(input.category !== undefined && { category: input.category }),
      ...(input.isActive !== undefined && { is_active: input.isActive }),
      ...(input.thumbnailUrl !== undefined && { thumbnail_url: input.thumbnailUrl }),
      ...(input.imageUrls !== undefined && { image_urls: input.imageUrls }),
    })
    .eq("service_id", serviceId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteService(client: Client, serviceId: string) {
  const { error } = await from(client)
    .delete()
    .eq("service_id", serviceId);

  if (error) throw error;
}

export async function listServicesByWorker(client: Client, workerId: string, activeOnly?: boolean) {
  let query = from(client).select("*").eq("worker_id", workerId).order("created_at", { ascending: false });

  if (activeOnly) {
    query = query.eq("is_active", true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function listServicesByWorkers(client: Client, workerIds: string[], activeOnly?: boolean): Promise<ServiceRow[]> {
  if (workerIds.length === 0) return [];

  let query = from(client).select("*").in("worker_id", workerIds).order("created_at", { ascending: false });

  if (activeOnly) {
    query = query.eq("is_active", true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}
