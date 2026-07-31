import { getLocale } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/server";
import { SiteNav } from "@/components/shared/site-nav";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { CategoryTabs } from "@/components/browse/category-tabs";
import { SearchBar } from "@/components/browse/search-bar";
import { FilterSidebar } from "@/components/browse/filter-sidebar";
import { ListingGrid } from "@/components/browse/listing-grid";
import { getListings } from "@/lib/services/listings";
import { resolveAvatarUrl } from "@/lib/avatar";

const CATEGORY_LABELS: Record<string, string> = {
  tukang: "Tukang",
  ac: "Teknisi AC",
  montir: "Montir",
  fotografer: "Fotografer",
  guru: "Guru Les",
  tata_rias: "Tata Rias",
  tukang_kayu: "Tukang Kayu",
  tukang_cat: "Tukang Cat",
};

const CATEGORY_KEYS = Object.keys(CATEGORY_LABELS);

function deriveCategories(listings: { category: string }[]) {
  const counts: Record<string, number> = {};
  for (const l of listings) {
    counts[l.category] = (counts[l.category] ?? 0) + 1;
  }
  return Object.entries(CATEGORY_LABELS).map(([id, label]) => ({
    id,
    label,
    count: counts[id] ?? 0,
  }));
}

async function BrowseContent({
  t,
  searchParams,
}: {
  t: (key: string) => string;
  searchParams: { q?: string; category?: string; sort?: string; city?: string; exp_min?: string; exp_max?: string; projects_min?: string; projects_max?: string; price_min?: string; price_max?: string };
}) {
  const query = searchParams.q;
  const category = CATEGORY_KEYS.includes(searchParams.category ?? "") ? searchParams.category : undefined;
  const sort = ["experience", "trust_score", "projects"].includes(searchParams.sort ?? "") ? searchParams.sort : undefined;
  const city = searchParams.city || undefined;
  const expMin = searchParams.exp_min ? parseInt(searchParams.exp_min, 10) : undefined;
  const expMax = searchParams.exp_max ? parseInt(searchParams.exp_max, 10) : undefined;
  const projectsMin = searchParams.projects_min ? parseInt(searchParams.projects_min, 10) : undefined;
  const projectsMax = searchParams.projects_max ? parseInt(searchParams.projects_max, 10) : undefined;
  const priceMin = searchParams.price_min ? parseInt(searchParams.price_min, 10) : undefined;
  const priceMax = searchParams.price_max ? parseInt(searchParams.price_max, 10) : undefined;

  const { listings } = await getListings({
    search: query,
    category,
    sort,
    city,
    experience_min: expMin,
    experience_max: expMax,
    projects_min: projectsMin,
    projects_max: projectsMax,
    price_min: priceMin,
    price_max: priceMax,
    limit: 50,
  });
  const categories = deriveCategories(listings);

  return (
    <>
      <h1 className="font-heading text-4xl font-bold tracking-tight">
        {t("browse.title")}
      </h1>

      <div className="mt-8 flex flex-col gap-6">
        <SearchBar placeholder={t("browse.searchPlaceholder")} defaultQuery={query ?? ""} />
        <CategoryTabs categories={categories} activeCategory={category ?? ""} baseUrl="/browse" />
      </div>

      <div className="mt-8 flex flex-col gap-8 md:flex-row">
        <FilterSidebar currentSort={sort ?? ""} baseUrl="/browse" />

        <div className="flex-1">
          <ListingGrid listings={listings} />
        </div>
      </div>
    </>
  );
}

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; sort?: string; city?: string; exp_min?: string; exp_max?: string; projects_min?: string; projects_max?: string; price_min?: string; price_max?: string }>;
}) {
  const sp = await searchParams;
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data?.user;

  const locale = await getLocale();
  const messages = (await import(`@/messages/${locale}.json`)).default;
  const t = (key: string) => {
    const keys = key.split(".");
    let val = messages;
    for (const k of keys) val = val?.[k];
    return typeof val === "string" ? val : key;
  };

  if (user) {
    const fullName = user.user_metadata?.full_name ?? (user.email ?? "User");
    const userEmail = user.email ?? "";
    const avatarUrl = resolveAvatarUrl(user);
    const role = user.user_metadata?.role === "employer" ? "employer" : "worker";

    return (
      <DashboardLayout userName={fullName} userEmail={userEmail} avatarUrl={avatarUrl} role={role}>
        <div className="mx-auto max-w-[90rem]">
          <BrowseContent t={t} searchParams={sp} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <main className="mx-auto w-full max-w-[90rem] px-6 py-10">
      <SiteNav user={false} />
      <BrowseContent t={t} searchParams={sp} />
    </main>
  );
}
