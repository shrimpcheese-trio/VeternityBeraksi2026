import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { resolveAvatarUrl } from "@/lib/avatar";
import { getLocale } from "@/lib/i18n";
import { getWorkerReviews, getWorkerServices } from "@/lib/services/profile";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { SiteNav } from "@/components/shared/site-nav";
import { ProfileLayout } from "@/components/profile/profile-layout";
import { ProfileSidebar } from "@/components/profile/profile-sidebar";
import { ProfileTabs } from "@/components/profile/profile-tabs";

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const isOwn = user?.id === id;
  if (isOwn) redirect("/profile");

  const { data: workerProfile } = await supabase
    .from("worker_profiles")
    .select("full_name, city, job_category, years_experience, trust_score, created_at, bio, location_visible")
    .eq("worker_id", id)
    .single();

  if (!workerProfile) notFound();

  const { count: completedJobs } = await supabase
    .from("proof_of_work")
    .select("*", { count: "exact", head: true })
    .eq("worker_id", id)
    .eq("customer_confirmed", true);

  const memberSince = workerProfile.created_at
    ? new Date(workerProfile.created_at).toLocaleDateString("id-ID", {
        month: "long",
        year: "numeric",
      })
    : "-";

  const reviews = await getWorkerReviews(id);  const services = await getWorkerServices(id);
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  const profile = {
    id,
    name: workerProfile.full_name,
    role: workerProfile.job_category,
    trustScore: workerProfile.trust_score ?? 0,
    bio: workerProfile.bio ?? "",
    location: workerProfile.city,
    locationVisible: workerProfile.location_visible ?? true,
    memberSince,
    contact: user?.email ?? undefined,
    completedJobs: completedJobs ?? 0,
    activeListings: 0,
    rating: Math.round(avgRating * 10) / 10,
    reviewCount: reviews.length,
    avatarUrl: resolveAvatarUrl(user),
    verifications: {
      idVerified: false,
      companyVerified: false,
      paymentVerified: false,
    },
  };

  const locale = await getLocale();

  if (user) {
    const fullName = user.user_metadata?.full_name ?? (user.email ?? "User");
    const userEmail = user.email ?? "";
    const avatarUrl = resolveAvatarUrl(user);
    const role = user.user_metadata?.role === "employer" ? "employer" : "worker";

    return (
      <DashboardLayout userName={fullName} userEmail={userEmail} avatarUrl={avatarUrl} role={role}>
        <ProfileLayout sidebar={<ProfileSidebar profile={profile} />}>
          <ProfileTabs
            profile={profile}
            services={services}
            reviews={reviews}
            chartData={[]}
            activity={[]}
            isOwn={false}
          />
        </ProfileLayout>
      </DashboardLayout>
    );
  }

  return (
    <main>
      <div className="mx-auto max-w-[90rem] px-6 py-10">
        <SiteNav user={false} />
        <div className="mt-8">
          <ProfileLayout sidebar={<ProfileSidebar profile={profile} />}>
            <ProfileTabs
              profile={profile}
              services={services}
              reviews={reviews}
              chartData={[]}
              activity={[]}
              isOwn={false}
            />
          </ProfileLayout>
        </div>
      </div>
    </main>
  );
}
