import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

export default async function WorkerLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  if (user.user_metadata?.role !== "worker") redirect("/login");

  const fullName = user.user_metadata?.full_name ?? "Pekerja";
  const userEmail = user.email ?? "";
  const avatarUrl = user.user_metadata?.avatar_url;

  return (
    <DashboardLayout userName={fullName} userEmail={userEmail} avatarUrl={avatarUrl} role="worker">
      {children}
    </DashboardLayout>
  );
}
