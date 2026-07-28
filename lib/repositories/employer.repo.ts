import type { SupabaseClient } from "@supabase/supabase-js";
import type { EmployerInput, EmployerUpdate } from "@/lib/validators/employer";
import type { Database } from "@/types/supabase";

type Client = SupabaseClient<Database>;

function from(client: Client) {
  return client.from("employer_profiles");
}

export async function createEmployer(client: Client, input: EmployerInput) {
  const { data, error } = await from(client)
    .insert({
      employer_id: input.employerId,
      company_name: input.companyName,
      city: input.city,
      phone: input.phone ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getEmployerById(client: Client, employerId: string) {
  const { data, error } = await from(client)
    .select("*")
    .eq("employer_id", employerId)
    .single();

  if (error) return null;
  return data;
}

export async function updateEmployer(client: Client, employerId: string, input: EmployerUpdate) {
  const { data, error } = await from(client)
    .update({
      ...(input.companyName !== undefined && { company_name: input.companyName }),
      ...(input.city !== undefined && { city: input.city }),
      ...(input.phone !== undefined && { phone: input.phone }),
    })
    .eq("employer_id", employerId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteEmployer(client: Client, employerId: string) {
  const { error } = await from(client)
    .delete()
    .eq("employer_id", employerId);

  if (error) throw error;
}

export async function listEmployers(client: Client, filters?: Partial<EmployerInput>) {
  let query = from(client).select("*");

  if (filters?.city) query = query.eq("city", filters.city);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}
