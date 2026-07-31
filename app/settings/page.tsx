import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { resolveAvatarUrl } from "@/lib/avatar";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { SettingsForm } from "@/components/settings/settings-form";

function parseUserAgent(ua: string | null): string {
  if (!ua) return "Perangkat tidak dikenal";
  let browser = "Browser";
  if (/Chrome/.test(ua) && !/Edg|OPR/.test(ua)) browser = "Chrome";
  else if (/Firefox/.test(ua)) browser = "Firefox";
  else if (/Safari/.test(ua) && !/Chrome/.test(ua)) browser = "Safari";
  else if (/Edg/.test(ua)) browser = "Edge";
  else if (/OPR/.test(ua)) browser = "Opera";
  let os = "Unknown";
  if (/Windows/.test(ua)) os = "Windows";
  else if (/Mac OS X/.test(ua)) os = "macOS";
  else if (/Linux/.test(ua) && !/Android/.test(ua)) os = "Linux";
  else if (/Android/.test(ua)) os = "Android";
  else if (/iPhone|iPad|iOS/.test(ua)) os = "iOS";
  return `${browser} di ${os}`;
}

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "-";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Saat ini";
  if (mins < 60) return `${mins} menit lalu`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} jam lalu`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days} hari lalu`;
  return new Date(dateStr).toLocaleDateString("id-ID");
}

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: sessionData } = await supabase.auth.getSession();
  const currentSessionId = (sessionData?.session as { id?: string } | null)?.id;

  const identities = user.identities?.[0]?.identity_data ?? {};
  const isGoogleAccount = user.identities?.some((i) => i.provider === "google") ?? false;
  const userNameMeta = user.user_metadata;
  const fullName = userNameMeta?.full_name ?? userNameMeta?.name ?? identities?.full_name ?? (user.email ?? "User");
  const userEmail = user.email ?? "";
  const avatarUrl = resolveAvatarUrl(user);
  const role = user.user_metadata?.role === "employer" ? "employer" : "worker";

  let phone = "";
  let city = "";
  let companyName = "";
  let bio = "";
  let locationVisible = true;

  if (role === "employer") {
    const { data } = await supabase
      .from("employer_profiles")
      .select("phone, city, company_name")
      .eq("employer_id", user.id)
      .single();
    if (data) {
      phone = data.phone ?? "";
      city = data.city;
      companyName = data.company_name;
    }
  } else {
    const { data } = await supabase
      .from("worker_profiles")
      .select("city, bio, location_visible")
      .eq("worker_id", user.id)
      .single();
    if (data) {
      city = data.city;
      bio = data.bio;
      locationVisible = data.location_visible;
    }
  }

  const adminClient = createAdminClient();
  const { data: rawSessions } = await adminClient.schema("auth").from("sessions").select("id, user_agent, ip, refreshed_at, created_at").eq("user_id", user.id).order("created_at", { ascending: false });

  const sessions = (rawSessions as Array<{ id: string; user_agent: string | null; ip: string | null; refreshed_at: string | null; created_at: string | null }> | null)?.map((s) => ({
    id: s.id,
    device: parseUserAgent(s.user_agent),
    location: s.ip ?? "IP tidak dikenal",
    lastActive: timeAgo(s.refreshed_at ?? s.created_at),
    isCurrent: s.id === currentSessionId,
  })) ?? [];

  return (
    <DashboardLayout userName={fullName} userEmail={userEmail} avatarUrl={avatarUrl} role={role}>
      <SettingsForm
        role={role}
        userName={fullName}
        userEmail={userEmail}
        phone={phone}
        city={city}
        companyName={companyName}
        avatarUrl={avatarUrl}
        isGoogleAccount={isGoogleAccount}
        sessions={sessions}
        bio={bio}
        locationVisible={locationVisible}
      />
    </DashboardLayout>
  );
}
