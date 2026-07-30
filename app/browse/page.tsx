import { getLocale } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/server";
import { SiteNav } from "@/components/shared/site-nav";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { CategoryTabs } from "@/components/browse/category-tabs";
import { SearchBar } from "@/components/browse/search-bar";
import { FilterSidebar } from "@/components/browse/filter-sidebar";
import { ListingGrid } from "@/components/browse/listing-grid";
import { getListings } from "@/lib/services/listings";

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
  searchParams: { q?: string; category?: string; sort?: string; city?: string };
}) {
  const query = searchParams.q;
  const category = CATEGORY_KEYS.includes(searchParams.category ?? "") ? searchParams.category : undefined;
  const sort = ["experience", "trust_score", "projects"].includes(searchParams.sort ?? "") ? searchParams.sort : undefined;
  const city = searchParams.city || undefined;

  const { listings } = await getListings({
    search: query,
    category,
    sort,
    city,
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
  searchParams: Promise<{ q?: string; category?: string; sort?: string; city?: string }>;
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
    const avatarUrl = user.user_metadata?.avatar_url;
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
