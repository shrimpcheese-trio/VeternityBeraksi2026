import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/shared/sign-out-button";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const fullName = user?.user_metadata?.full_name ?? "Admin";

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <h1 className="font-heading text-lg font-semibold">Dashboard Admin</h1>
        <div className="flex items-center gap-4">
          <span className="max-w-[160px] truncate text-sm text-muted-foreground" title={fullName}>{fullName}</span>
          <SignOutButton />
        </div>
      </header>
      <main className="flex-1 p-6">
        <p className="text-muted-foreground">Selamat datang, Admin!</p>
      </main>
    </div>
  );
}
