import { createClient } from "@/lib/supabase/server";
import { resolveAvatarUrl } from "@/lib/avatar";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { getServerTranslator } from "@/lib/i18n-server";

export default async function WorkerLayout({ children }: { children: React.ReactNode }) {
  const t = await getServerTranslator("workerDashboard");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  if (user.user_metadata?.role !== "worker") redirect("/login");

  const fullName = user.user_metadata?.full_name ?? t("fallbackName");
  const userEmail = user.email ?? "";
  const avatarUrl = resolveAvatarUrl(user);

  return (
    <DashboardLayout userName={fullName} userEmail={userEmail} avatarUrl={avatarUrl} role="worker">
      {children}
    </DashboardLayout>
  );
}
