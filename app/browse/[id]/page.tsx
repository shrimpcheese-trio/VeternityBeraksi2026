import { notFound } from "next/navigation";
import { getLocale } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/server";
import { SiteNav } from "@/components/shared/site-nav";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { CommissionForm } from "@/components/browse/commission-form";
import { getListingById } from "@/lib/services/listings";
import { resolveAvatarUrl } from "@/lib/avatar";

const statusConfig: Record<string, { key: string; dot: string }> = {
  tersedia: { key: "browse.statusAvailable", dot: "bg-sky" },
  dalam_proyek: { key: "browse.statusInProgress", dot: "bg-amber-500" },
  segera: { key: "browse.statusSoon", dot: "bg-blue-500" },
};

async function ServiceDetailPage({ listingId, serviceId, userId, userRole, t }: { listingId: string; serviceId?: string; userId: string | null; userRole: string | null; t: (key: string) => string }) {
  const listing = await getListingById(listingId, serviceId);
  if (!listing) notFound();

  const cfg = statusConfig[listing.status];
  const allImages = [
    ...(listing.imageUrl ? [listing.imageUrl] : []),
    ...listing.galleryImages,
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-6">
          <div className="aspect-video w-full overflow-hidden rounded-2xl bg-bg-alt">
            {listing.imageUrl ? (
              <img src={listing.imageUrl} alt={listing.title} className="size-full object-cover" />
            ) : (
              <div className="flex size-full items-center justify-center text-muted-foreground">
                {t("browse.noImage")}
              </div>
            )}
          </div>

          {allImages.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {allImages.map((url, idx) => (
                <div key={idx} className="aspect-video overflow-hidden rounded-lg bg-bg-alt">
                  <img src={url} alt="" className="size-full object-cover" />
                </div>
              ))}
            </div>
          )}

          <div className="rounded-xl border border-border bg-bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">{listing.title}</h1>
                <p className="mt-1 text-sm text-muted-foreground">{listing.code}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider shadow-sm">
                <span className={`size-1.5 rounded-full ${cfg.dot}`} />
                {t(cfg.key)}
              </span>
            </div>

            {listing.serviceDescription && (
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                {listing.serviceDescription}
              </p>
            )}

            <div className="mt-6 flex items-center gap-4 border-t border-border pt-6">
              <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary uppercase">
                {listing.workerName.charAt(0)}
              </div>
              <div>
                <p className="text-base font-semibold">{listing.workerName}</p>
                <p className="text-sm text-muted-foreground">{listing.workerRole}</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4 rounded-xl bg-bg-alt p-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{t("browse.commissionModal.trustScore")}</p>
                <p className="mt-1 text-lg font-bold">{listing.trustScore.toFixed(1)}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{t("browse.completedProjects")}</p>
                <p className="mt-1 text-lg font-bold">{listing.projectCount}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{t("browse.startingPrice")}</p>
                <p className="mt-1 text-lg font-bold">
                  Rp {(listing.price / 1000).toLocaleString("id-ID")} rb
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="sticky top-6 rounded-xl border border-border bg-bg-card p-6">
            <h2 className="mb-6 text-sm font-semibold">{t("browse.commissionModal.title")}</h2>
            <CommissionForm
              workerId={listing.id}
              price={listing.price}
              userId={userId}
              userRole={userRole}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function BrowseDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ service?: string }>;
}) {
  const { id } = await params;
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

  const userId = user?.id ?? null;
  const userRole = user?.user_metadata?.role ?? null;

  if (user) {
    const fullName = user.user_metadata?.full_name ?? (user.email ?? "User");
    const userEmail = user.email ?? "";
    const avatarUrl = resolveAvatarUrl(user);
    const role = userRole === "employer" ? "employer" : "worker";

    return (
      <DashboardLayout userName={fullName} userEmail={userEmail} avatarUrl={avatarUrl} role={role}>
        <div className="mx-auto max-w-[90rem] px-6 py-10">
          <ServiceDetailPage listingId={id} serviceId={sp.service} userId={userId} userRole={userRole} t={t} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <main className="mx-auto w-full max-w-[90rem] px-6 py-10">
      <SiteNav user={false} />
      <ServiceDetailPage listingId={id} serviceId={sp.service} userId={null} userRole={null} t={t} />
    </main>
  );
}
