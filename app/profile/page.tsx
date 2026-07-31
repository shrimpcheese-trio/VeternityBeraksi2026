import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { createHash } from "crypto";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { ProfileLayout } from "@/components/profile/profile-layout";
import { ProfileSidebar } from "@/components/profile/profile-sidebar";
import { ProfileTabs } from "@/components/profile/profile-tabs";
import { getEmptyProfile, getWorkerReviews, getEmployerReviews } from "@/lib/services/profile";

export default async function OwnProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const userId = user.id;
  const identities = user.identities?.[0]?.identity_data ?? {};
  const userNameMeta = user.user_metadata;
  const fullName = userNameMeta?.full_name ?? userNameMeta?.name ?? identities?.full_name ?? (user.email ?? "User");
  const userEmail = user.email ?? "";
  const emailHash = createHash("md5").update(userEmail.trim().toLowerCase()).digest("hex")
  const avatarUrl = userNameMeta?.avatar_url ?? userNameMeta?.picture ?? identities?.avatar_url ?? `https://gravatar.com/avatar/${emailHash}?s=256&d=retro`;
  const role = user.user_metadata?.role === "employer" ? "employer" : "worker";

  if (role === "employer") {
    const { data: employerProfile } = await supabase
      .from("employer_profiles")
      .select("company_name, city, phone, created_at")
      .eq("employer_id", userId)
      .single();

    const { data: agreements } = await supabase
      .from("agreements")
      .select("status, price, job_description, created_at")
      .eq("employer_id", userId)
      .order("created_at", { ascending: false });

    const totalJobs = agreements?.length ?? 0;
    const completedJobs = agreements?.filter((a) => a.status === "completed").length ?? 0;
    const totalSpending = agreements
      ?.filter((a) => a.status === "completed")
      .reduce((sum, a) => sum + (a.price ?? 0), 0) ?? 0;

    const memberSince = employerProfile?.created_at
      ? new Date(employerProfile.created_at).toLocaleDateString("id-ID", {
          month: "long",
          year: "numeric",
        })
      : "-";

    const profile = {
      id: userId,
      name: fullName,
      role: "Pemberi Kerja",
      trustScore: 0,
      bio: "",
      company: employerProfile?.company_name ?? "",
      location: employerProfile?.city ?? "",
      locationVisible: true,
      memberSince,
      contact: userEmail || undefined,
      completedJobs,
      activeListings: totalJobs,
      rating: 0,
      reviewCount: 0,
      avatarUrl,
      verifications: {
        idVerified: false,
        companyVerified: false,
        paymentVerified: false,
      },
    };

    const chartData = buildMonthlyChart(agreements ?? []);
    const reviews = await getEmployerReviews(userId);

    return (
      <DashboardLayout userName={fullName} userEmail={userEmail} avatarUrl={avatarUrl} role={role}>
        <ProfileLayout sidebar={<ProfileSidebar profile={profile} userRole="employer" totalSpending={totalSpending} />}>
          <ProfileTabs
            profile={profile}
            listings={[]}
            contracts={[]}
            reviews={reviews}
            documents={[]}
            chartData={chartData}
            activity={[]}
            isOwn
            userRole="employer"
            recentAgreements={agreements ?? []}
          />
        </ProfileLayout>
      </DashboardLayout>
    );
  }

  const { data: workerProfile } = await supabase
    .from("worker_profiles")
    .select("city, job_category, years_experience, trust_score, created_at, updated_at, bio, location_visible")
    .eq("worker_id", userId)
    .single();

  const { count: completedJobs } = await supabase
    .from("proof_of_work")
    .select("*", { count: "exact", head: true })
    .eq("worker_id", userId)
    .eq("customer_confirmed", true);

  const memberSince = workerProfile?.created_at
    ? new Date(workerProfile.created_at).toLocaleDateString("id-ID", {
        month: "long",
        year: "numeric",
      })
    : "-";

  const reviews = await getWorkerReviews(userId);
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  const profile = workerProfile
    ? {
        id: userId,
        name: fullName,
        role: workerProfile.job_category,
        trustScore: workerProfile.trust_score ?? 0,
        bio: workerProfile.bio ?? "",
        location: workerProfile.city,
        locationVisible: workerProfile.location_visible ?? true,
        memberSince,
        contact: userEmail || undefined,
        completedJobs: completedJobs ?? 0,
        activeListings: 0,
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: reviews.length,
        avatarUrl,
        verifications: {
          idVerified: false,
          companyVerified: false,
          paymentVerified: false,
        },
      }
    : { ...getEmptyProfile(userId, fullName), avatarUrl };

  return (
    <DashboardLayout userName={fullName} userEmail={userEmail} avatarUrl={avatarUrl} role={role}>
      <ProfileLayout sidebar={<ProfileSidebar profile={profile} />}>
        <ProfileTabs profile={profile} listings={[]} contracts={[]} reviews={reviews} documents={[]} chartData={[]} activity={[]} isOwn />
      </ProfileLayout>
    </DashboardLayout>
  );
}

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
];

function buildMonthlyChart(agreements: { status: string; created_at: string }[]) {
  const now = new Date();
  const months: { month: string; value: number }[] = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const next = new Date(d.getFullYear(), d.getMonth() + 1, 1);
    const count = agreements.filter((a) => {
      const c = new Date(a.created_at);
      return c >= d && c < next;
    }).length;
    months.push({ month: MONTH_NAMES[d.getMonth()], value: count });
  }

  return months;
}
