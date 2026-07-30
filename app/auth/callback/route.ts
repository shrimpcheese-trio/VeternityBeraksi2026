import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  const pendingCookies: { name: string; value: string; options: Record<string, unknown> }[] = [];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value, options } of cookiesToSet) {
            request.cookies.set(name, value);
            pendingCookies.push({ name, value, options });
          }
        },
      },
    },
  );

  let redirectUrl = `${origin}/login?error=auth_callback_error`;

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const { data: { user } } = await supabase.auth.getUser();
      const role = user?.user_metadata?.role as string | undefined;

      if (role === "worker") redirectUrl = `${origin}/worker/dashboard`;
      else if (role === "employer") redirectUrl = `${origin}/employer/dashboard`;
      else if (role === "admin") redirectUrl = `${origin}/admin/dashboard`;
      else redirectUrl = `${origin}/profile/setup`;
    }
  }

  const response = NextResponse.redirect(redirectUrl);
  for (const { name, value, options } of pendingCookies) {
    response.cookies.set(name, value, options as Parameters<typeof response.cookies.set>[2]);
  }
  return response;
}
