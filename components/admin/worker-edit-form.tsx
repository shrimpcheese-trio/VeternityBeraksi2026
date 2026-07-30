import { createClient } from "@/lib/supabase/server";
import { updateWorker } from "@/lib/repositories/worker.repo";
import type { Database } from "@/types/supabase";

type WorkerRow = Database["public"]["Tables"]["worker_profiles"]["Row"];

async function saveWorker(formData: FormData) {
  "use server";
  const workerId = formData.get("worker_id") as string;
  const fullName = formData.get("full_name") as string;
  const city = formData.get("city") as string;
  const jobCategory = formData.get("job_category") as string;
  const yearsExperience = parseInt(formData.get("years_experience") as string, 10) || 0;
  const bio = (formData.get("bio") as string) || undefined;
  const locationVisible = formData.get("location_visible") === "true";

  const supabase = await createClient();
  await updateWorker(supabase, workerId, {
    fullName,
    city,
    jobCategory,
    yearsExperience,
    bio,
    locationVisible,
  });
}

export function AdminWorkerEditForm({ worker }: { worker: WorkerRow }) {
  return (
    <form action={saveWorker} className="space-y-4">
      <input type="hidden" name="worker_id" value={worker.worker_id} />

      <div>
        <label className="mb-1 block text-xs font-medium text-muted-foreground">Nama Lengkap</label>
        <input
          name="full_name"
          defaultValue={worker.full_name}
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-muted-foreground">Kota</label>
        <input
          name="city"
          defaultValue={worker.city}
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-muted-foreground">Kategori Pekerjaan</label>
        <input
          name="job_category"
          defaultValue={worker.job_category}
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-muted-foreground">Pengalaman (tahun)</label>
        <input
          type="number"
          name="years_experience"
          defaultValue={worker.years_experience}
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-muted-foreground">Bio</label>
        <textarea
          name="bio"
          rows={3}
          defaultValue={worker.bio ?? ""}
          className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="location_visible"
          id="location_visible"
          value="true"
          defaultChecked={worker.location_visible}
          className="rounded border-border"
        />
        <label htmlFor="location_visible" className="text-xs text-muted-foreground">
          Tampilkan lokasi di profil
        </label>
      </div>

      <button
        type="submit"
        className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-on-primary hover:bg-primary-active"
      >
        Simpan
      </button>
    </form>
  );
}
