import { createAdminClient } from "@/lib/supabase/admin";

export interface ListingResult {
  id: string;
  title: string;
  code: string;
  category: string;
  status: "tersedia" | "dalam_proyek" | "segera";
  imageUrl: string;
  galleryImages: string[];
  serviceDescription: string | null;
  projectCount: number;
  price: number;
  workerName: string;
  workerRole: string;
  trustScore: number;
  isFavorite: boolean;
  serviceId: string;
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
  experience_min?: number;
  experience_max?: number;
  projects_min?: number;
  projects_max?: number;
  price_min?: number;
  price_max?: number;
}

interface ListingsResponse {
  listings: ListingResult[];
  total: number;
}

export async function getListings(filters: ListingsFilters): Promise<ListingsResponse> {
  const admin = createAdminClient();
  const limit = Math.min(filters.limit ?? 20, 100);
  const offset = filters.offset ?? 0;

  let serviceMatchIds: string[] = [];
  if (filters.search) {
    const safe = filters.search.replace(/[*%]/g, "");
    try {
      const { data: matchedServices } = await admin
        .from("worker_services")
        .select("worker_id")
        .ilike("name", `%${safe}%`)
        .eq("is_active", true);
      if (matchedServices) {
        serviceMatchIds = [...new Set(matchedServices.map((s) => s.worker_id))];
      }
    } catch {
      serviceMatchIds = [];
    }
  }

  let query = admin.from("worker_profiles").select("*", { count: "exact" });

  if (filters.category) {
    query = query.ilike("job_category", filters.category);
  }
  if (filters.city) {
    const safe = filters.city.replace(/[*%]/g, "");
    query = query.ilike("city", `%${safe}%`);
  }
  if (filters.search) {
    const safe = filters.search.replace(/[*%]/g, "");
    const profileConditions = `full_name.ilike.*${safe}*,job_category.ilike.*${safe}*,city.ilike.*${safe}*`;
    if (serviceMatchIds.length > 0) {
      query = query.or(`${profileConditions},worker_id.in.(${serviceMatchIds.join(",")})`);
    } else {
      query = query.or(profileConditions);
    }
  }
  if (filters.experience_min != null) {
    query = query.gte("years_experience", filters.experience_min);
  }
  if (filters.experience_max != null) {
    query = query.lte("years_experience", filters.experience_max);
  }

  const sortField = filters.sort === "experience" ? "years_experience"
    : filters.sort === "trust_score" ? "trust_score"
    : "created_at";
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

  let proofCounts: Record<string, number> = {};
  try {
    const { data: proofs } = await admin
      .from("proof_of_work")
      .select("worker_id")
      .in("worker_id", workerIds)
      .eq("verified", true);
    if (proofs) {
      for (const p of proofs) {
        proofCounts[p.worker_id] = (proofCounts[p.worker_id] ?? 0) + 1;
      }
    }
  } catch {
    proofCounts = {};
  }

  let activeCounts: Record<string, number> = {};
  try {
    const { data: activeAgreements } = await admin
      .from("agreements")
      .select("worker_id")
      .in("worker_id", workerIds)
      .eq("status", "active");
    if (activeAgreements) {
      for (const a of activeAgreements) {
        activeCounts[a.worker_id] = (activeCounts[a.worker_id] ?? 0) + 1;
      }
    }
  } catch {
    activeCounts = {};
  }

  let wageMap: Record<string, number> = {};
  try {
    const { data: wages } = await admin
      .from("wage_estimates")
      .select("*");
    if (wages) {
      for (const w of wages) {
        const key = `${w.city}|${w.job_type}`;
        if (!wageMap[key] || w.max_wage > wageMap[key]) {
          wageMap[key] = w.max_wage;
        }
      }
    }
  } catch {
    wageMap = {};
  }

  let allServices: Record<string, Array<{ service_id: string; name: string; price: number; description: string | null; thumbnail_url: string | null; image_urls: string[]; category: string | null }>> = {};
  try {
    const { data: workerServices } = await admin
      .from("worker_services")
      .select("*")
      .in("worker_id", workerIds)
      .eq("is_active", true);
    if (workerServices) {
      for (const s of workerServices) {
        const entry = {
          service_id: s.service_id,
          name: s.name,
          price: s.price,
          description: s.description,
          thumbnail_url: s.thumbnail_url,
          image_urls: Array.isArray(s.image_urls) ? s.image_urls as string[] : [],
          category: s.category,
        };
        allServices[s.worker_id] = allServices[s.worker_id] ?? [];
        allServices[s.worker_id].push(entry);
      }
    }
  } catch {
    allServices = {};
  }

  let listings: ListingResult[] = [];
  let globalIdx = 0;
  for (const worker of workers) {
    const verifiedCount = proofCounts[worker.worker_id] ?? 0;
    const activeCount = activeCounts[worker.worker_id] ?? 0;
    const wageKey = `${worker.city}|${worker.job_category}`;
    const estimatedPrice = wageMap[wageKey] ?? 0;
    const services = allServices[worker.worker_id];

    if (services && services.length > 0) {
      for (const svc of services) {
        listings.push({
          id: worker.worker_id,
          serviceId: svc.service_id,
          title: svc.name,
          code: deriveCode(worker.full_name, globalIdx++),
          category: worker.job_category,
          status: deriveStatus(activeCount, verifiedCount),
          imageUrl: svc.thumbnail_url ?? "",
          galleryImages: svc.image_urls ?? [],
          serviceDescription: svc.description ?? null,
          projectCount: verifiedCount,
          price: svc.price,
          workerName: worker.full_name,
          workerRole: STATUS_LABELS[worker.job_category] ?? worker.job_category,
          trustScore: worker.trust_score,
          isFavorite: false,
        });
      }
    } else {
      listings.push({
        id: worker.worker_id,
        serviceId: "",
        title: deriveTitle(worker.job_category),
        code: deriveCode(worker.full_name, globalIdx++),
        category: worker.job_category,
        status: deriveStatus(activeCount, verifiedCount),
        imageUrl: "",
        galleryImages: [],
        serviceDescription: null,
        projectCount: verifiedCount,
        price: estimatedPrice,
        workerName: worker.full_name,
        workerRole: STATUS_LABELS[worker.job_category] ?? worker.job_category,
        trustScore: worker.trust_score,
        isFavorite: false,
      });
    }
  }

  if (filters.projects_min != null || filters.projects_max != null) {
    listings = listings.filter((l) => {
      if (filters.projects_min != null && l.projectCount < filters.projects_min) return false;
      if (filters.projects_max != null && l.projectCount > filters.projects_max) return false;
      return true;
    });
  }

  if (filters.price_min != null || filters.price_max != null) {
    listings = listings.filter((l) => {
      if (filters.price_min != null && l.price < filters.price_min) return false;
      if (filters.price_max != null && l.price > filters.price_max) return false;
      return true;
    });
  }

  if (filters.sort === "projects") {
    listings.sort((a, b) => b.projectCount - a.projectCount);
  }

  return { listings, total: count ?? 0 };
}

export async function getListingById(workerId: string, serviceId?: string): Promise<ListingResult | null> {
  const admin = createAdminClient();

  const { data: worker, error } = await admin
    .from("worker_profiles")
    .select("*")
    .eq("worker_id", workerId)
    .single();

  if (error || !worker) return null;

  let verifiedCount = 0;
  try {
    const { count } = await admin
      .from("proof_of_work")
      .select("*", { count: "exact", head: true })
      .eq("worker_id", workerId)
      .eq("verified", true);
    verifiedCount = count ?? 0;
  } catch {
    verifiedCount = 0;
  }

  let activeCount = 0;
  try {
    const { count } = await admin
      .from("agreements")
      .select("*", { count: "exact", head: true })
      .eq("worker_id", workerId)
      .eq("status", "active");
    activeCount = count ?? 0;
  } catch {
    activeCount = 0;
  }

  let estimatedPrice = 0;
  try {
    const { data: wages } = await admin
      .from("wage_estimates")
      .select("*")
      .eq("city", worker.city)
      .eq("job_type", worker.job_category);
    if (wages && wages.length > 0) {
      estimatedPrice = Math.max(...wages.map((w) => w.max_wage));
    }
  } catch {
    estimatedPrice = 0;
  }

  let service: { service_id: string; name: string; price: number; description: string | null; thumbnail_url: string | null; image_urls: string[] } | undefined;
  try {
    const { data: workerServices } = await admin
      .from("worker_services")
      .select("*")
      .eq("worker_id", workerId)
      .eq("is_active", true);
    if (workerServices && workerServices.length > 0) {
      const target = serviceId
        ? workerServices.find((s) => s.service_id === serviceId)
        : workerServices[0];
      if (target) {
        service = {
          service_id: target.service_id,
          name: target.name,
          price: target.price,
          description: target.description,
          thumbnail_url: target.thumbnail_url,
          image_urls: Array.isArray(target.image_urls) ? target.image_urls as string[] : [],
        };
      }
    }
  } catch {
    service = undefined;
  }

  return {
    id: worker.worker_id,
    serviceId: service?.service_id ?? "",
    title: service?.name ?? deriveTitle(worker.job_category),
    code: deriveCode(worker.full_name, 0),
    category: worker.job_category,
    status: deriveStatus(activeCount, verifiedCount),
    imageUrl: service?.thumbnail_url ?? "",
    galleryImages: service?.image_urls ?? [],
    serviceDescription: service?.description ?? null,
    projectCount: verifiedCount,
    price: service?.price ?? estimatedPrice,
    workerName: worker.full_name,
    workerRole: STATUS_LABELS[worker.job_category] ?? worker.job_category,
    trustScore: worker.trust_score,
    isFavorite: false,
  };
}
