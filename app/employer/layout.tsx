import { createClient } from "@/lib/supabase/server";
import { resolveAvatarUrl } from "@/lib/avatar";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

export default async function EmployerLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  if (user.user_metadata?.role !== "employer") redirect("/login");

  const fullName = user.user_metadata?.full_name ?? "Pemberi Kerja";
  const userEmail = user.email ?? "";
  const avatarUrl = resolveAvatarUrl(user);

  return (
    <DashboardLayout userName={fullName} userEmail={userEmail} avatarUrl={avatarUrl} role="employer">
      {children}
    </DashboardLayout>
  );
}
