import { getLocale } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/server";
import { SiteNav } from "@/components/shared/site-nav";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { CategoryTabs } from "@/components/browse/category-tabs";
import { SearchBar } from "@/components/browse/search-bar";
import { FilterSidebar } from "@/components/browse/filter-sidebar";
import { ListingGrid } from "@/components/browse/listing-grid";
import { categories, listings } from "@/lib/browse/mock-data";

function BrowseContent({ t }: { t: (key: string) => string }) {
  return (
    <>
      <h1 className="font-heading text-4xl font-bold tracking-tight">
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
    </>
  );
}

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

  if (user) {
    const fullName = user.user_metadata?.full_name ?? (user.email ?? "User");
    const userEmail = user.email ?? "";
    const avatarUrl = user.user_metadata?.avatar_url;
    const role = user.user_metadata?.role === "employer" ? "employer" : "worker";

    return (
      <DashboardLayout userName={fullName} userEmail={userEmail} avatarUrl={avatarUrl} role={role}>
        <div className="mx-auto max-w-[90rem]">
          <BrowseContent t={t} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <main className="mx-auto w-full max-w-[90rem] px-6 py-10">
      <SiteNav user={false} />
      <BrowseContent t={t} />
    </main>
  );
}
