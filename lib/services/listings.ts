import { createAdminClient } from "@/lib/supabase/admin";

export interface ListingResult {
  id: string;
  title: string;
  code: string;
  category: string;
  status: "tersedia" | "dalam_proyek" | "segera";
  imageUrl: string;
  projectCount: number;
  price: number;
  workerName: string;
  workerRole: string;
  isFavorite: boolean;
}

const STATUS_LABELS: Record<string, string> = {
  tukang: "Tukang",
  ac: "Teknisi AC",
  montir: "Montir",
  fotografer: "Fotografer",
  guru: "Guru Les",
  tata_rias: "Tata Rias",
  tukang_kayu: "Tukang Kayu",
  tukang_cat: "Tukang Cat",
};

function deriveTitle(jobCategory: string): string {
  const label = STATUS_LABELS[jobCategory] ?? jobCategory;
  return `Jasa ${label} Profesional`;
}

function deriveCode(name: string, index: number): string {
  const initials = name
    .split(" ")
    .map((w) => w.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 4);
  const num = (1001 + index).toString().slice(-4);
  return `${initials} ${num}`;
}

function deriveStatus(
  activeAgreementsCount: number,
  verifiedProofsCount: number,
): "tersedia" | "dalam_proyek" | "segera" {
  if (activeAgreementsCount > 2) return "dalam_proyek";
  if (verifiedProofsCount > 20) return "segera";
  return "tersedia";
}

interface ListingsFilters {
  category?: string;
  city?: string;
  search?: string;
  sort?: string;
  limit?: number;
  offset?: number;
}

interface ListingsResponse {
  listings: ListingResult[];
  total: number;
}

export async function getListings(filters: ListingsFilters): Promise<ListingsResponse> {
  const admin = createAdminClient();
  const limit = Math.min(filters.limit ?? 20, 100);
  const offset = filters.offset ?? 0;

  let query = admin.from("worker_profiles").select("*", { count: "exact" });

  if (filters.category) {
    query = query.eq("job_category", filters.category);
  }
  if (filters.city) {
    query = query.eq("city", filters.city);
  }
  if (filters.search) {
    query = query.ilike("full_name", `%${filters.search}%`);
  }

  const sortField = filters.sort === "experience" ? "years_experience" : "created_at";
  query = query.order(sortField, { ascending: false });

  query = query.range(offset, offset + limit - 1);

  const { data: workers, count, error } = await query;
  if (error) {
    console.error(error);
    return { listings: [], total: 0 };
  }
  if (!workers || workers.length === 0) {
    return { listings: [], total: count ?? 0 };
  }

  const workerIds = workers.map((w) => w.worker_id);

  const { data: proofs } = await admin
    .from("proof_of_work")
    .select("worker_id")
    .in("worker_id", workerIds)
    .eq("verified", true);

  const proofCounts: Record<string, number> = {};
  if (proofs) {
    for (const p of proofs) {
      proofCounts[p.worker_id] = (proofCounts[p.worker_id] ?? 0) + 1;
    }
  }

  const { data: activeAgreements } = await admin
    .from("agreements")
    .select("worker_id")
    .in("worker_id", workerIds)
    .eq("status", "active");

  const activeCounts: Record<string, number> = {};
  if (activeAgreements) {
    for (const a of activeAgreements) {
      activeCounts[a.worker_id] = (activeCounts[a.worker_id] ?? 0) + 1;
    }
  }

  const { data: wages } = await admin
    .from("wage_estimates")
    .select("*");

  const wageMap: Record<string, number> = {};
  if (wages) {
    for (const w of wages) {
      const key = `${w.city}|${w.job_type}`;
      if (!wageMap[key] || w.max_wage > wageMap[key]) {
        wageMap[key] = w.max_wage;
      }
    }
  }

  const listings: ListingResult[] = workers.map((worker, idx) => {
    const verifiedCount = proofCounts[worker.worker_id] ?? 0;
    const activeCount = activeCounts[worker.worker_id] ?? 0;
    const wageKey = `${worker.city}|${worker.job_category}`;
    const estimatedPrice = wageMap[wageKey] ?? 0;

    return {
      id: worker.worker_id,
      title: deriveTitle(worker.job_category),
      code: deriveCode(worker.full_name, idx),
      category: worker.job_category,
      status: deriveStatus(activeCount, verifiedCount),
      imageUrl: "",
      projectCount: verifiedCount,
      price: estimatedPrice,
      workerName: worker.full_name,
      workerRole: STATUS_LABELS[worker.job_category] ?? worker.job_category,
      isFavorite: false,
    };
  });

  return { listings, total: count ?? 0 };
}
