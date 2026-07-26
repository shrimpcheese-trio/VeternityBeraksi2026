import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getLocale } from "@/lib/i18n";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { SiteNav } from "@/components/shared/site-nav";
import { ProfileLayout } from "@/components/profile/profile-layout";
import { ProfileSidebar } from "@/components/profile/profile-sidebar";
import { ProfileTabs } from "@/components/profile/profile-tabs";
import {
  getProfile,
  getListings,
  getContracts,
  getReviews,
  getDocuments,
  getChartData,
  getActivity,
} from "@/lib/profile/mock-data";

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = getProfile(id);

  if (!profile) notFound();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const listings = getListings(id);
  const contracts = getContracts(id);
  const reviews = getReviews(id);
  const documents = getDocuments(id);
  const chartData = getChartData(id);
  const activity = getActivity(id);

  const isOwn = user?.id === id;

  if (isOwn) {
    redirect("/profile");
  }

  const locale = await getLocale();

  if (user) {
    const fullName = user.user_metadata?.full_name ?? (user.email ?? "User");
    const userEmail = user.email ?? "";
    const avatarUrl = user.user_metadata?.avatar_url;
    const role = user.user_metadata?.role === "employer" ? "employer" : "worker";

    return (
      <DashboardLayout userName={fullName} userEmail={userEmail} avatarUrl={avatarUrl} role={role}>
        <ProfileLayout sidebar={<ProfileSidebar profile={profile} />}>
          <ProfileTabs
            profile={profile}
            listings={listings}
            contracts={contracts}
            reviews={reviews}
            documents={documents}
            chartData={chartData}
            activity={activity}
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
              listings={listings}
              contracts={contracts}
              reviews={reviews}
              documents={documents}
              chartData={chartData}
              activity={activity}
              isOwn={false}
            />
          </ProfileLayout>
        </div>
      </div>
    </main>
  );
}
