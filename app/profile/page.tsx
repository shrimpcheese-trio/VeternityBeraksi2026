import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { createHash } from "crypto";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { ProfileLayout } from "@/components/profile/profile-layout";
import { ProfileSidebar } from "@/components/profile/profile-sidebar";
import { ProfileTabs } from "@/components/profile/profile-tabs";
import { createAdminClient } from "@/lib/supabase/admin";
import { getEmptyProfile } from "@/lib/services/profile";

export default async function OwnProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const userId = user.id;
  const fullName = user.user_metadata?.full_name ?? (user.email ?? "User");
  const userEmail = user.email ?? "";
  const emailHash = createHash("md5").update(userEmail.trim().toLowerCase()).digest("hex")
  const avatarUrl = user.user_metadata?.avatar_url ?? `https://gravatar.com/avatar/${emailHash}?s=256&d=retro`;
  const role = user.user_metadata?.role === "employer" ? "employer" : "worker";

  const admin = createAdminClient();

  const { data: workerProfile } = await admin
    .from("worker_profiles")
    .select("city, job_category, years_experience, trust_score, created_at, updated_at")
    .eq("worker_id", userId)
    .single();

  const { count: completedJobs } = await admin
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

  const profile = workerProfile
    ? {
        id: userId,
        name: fullName,
        role: workerProfile.job_category,
        trustScore: workerProfile.trust_score ?? 0,
        bio: "",
        location: workerProfile.city,
        memberSince,
        contact: userEmail || undefined,
        completedJobs: completedJobs ?? 0,
        activeListings: 0,
        rating: 0,
        reviewCount: 0,
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
        <ProfileTabs profile={profile} listings={[]} contracts={[]} reviews={[]} documents={[]} chartData={[]} activity={[]} isOwn />
      </ProfileLayout>
    </DashboardLayout>
  );
}
