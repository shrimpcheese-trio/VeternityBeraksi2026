import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { SettingsForm } from "@/components/settings/settings-form";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const fullName = user.user_metadata?.full_name ?? (user.email ?? "User");
  const userEmail = user.email ?? "";
  const avatarUrl = user.user_metadata?.avatar_url;
  const role = user.user_metadata?.role === "employer" ? "employer" : "worker";

  return (
    <DashboardLayout userName={fullName} userEmail={userEmail} avatarUrl={avatarUrl} role={role}>
      <SettingsForm userName={fullName} userEmail={userEmail} />
    </DashboardLayout>
  );
}
