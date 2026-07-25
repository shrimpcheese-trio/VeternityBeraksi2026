import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const { data: { user } } = await supabase.auth.getUser();
      const role = user?.user_metadata?.role as string | undefined;

      if (role === "worker") return NextResponse.redirect(`${origin}/worker/dashboard`);
      if (role === "employer") return NextResponse.redirect(`${origin}/employer/dashboard`);
      if (role === "admin") return NextResponse.redirect(`${origin}/admin/dashboard`);
      return NextResponse.redirect(`${origin}/profile/setup`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
}
