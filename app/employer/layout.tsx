import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function EmployerLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  if (user.user_metadata?.role !== "employer") redirect("/login");

  return <>{children}</>;
}
