import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function WorkerLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  if (user.user_metadata?.role !== "worker") redirect("/login");

  return <>{children}</>;
}
