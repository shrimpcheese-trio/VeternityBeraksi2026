import { getLocale } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/server";
import { SiteNav } from "@/components/shared/site-nav";
import { CategoryTabs } from "@/components/browse/category-tabs";
import { SearchBar } from "@/components/browse/search-bar";
import { FilterSidebar } from "@/components/browse/filter-sidebar";
import { ListingGrid } from "@/components/browse/listing-grid";
import { categories, listings } from "@/lib/browse/mock-data";

export default async function BrowsePage() {
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

  return (
    <main className="mx-auto w-full max-w-360 px-6 py-10">
      <SiteNav user={!!user} />

      <h1 className="mt-8 font-heading text-4xl font-bold tracking-tight">
        {t("browse.title")}
      </h1>

      <div className="mt-8 flex flex-col gap-6">
        <SearchBar placeholder={t("browse.searchPlaceholder")} />
        <CategoryTabs categories={categories} />
      </div>

      <div className="mt-8 flex flex-col gap-8 md:flex-row">
        <FilterSidebar />

        <div className="flex-1">
          <ListingGrid listings={listings} />
        </div>
      </div>
    </main>
  );
}
