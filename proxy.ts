import { updateSession } from "@/lib/supabase/middleware";
import { type NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");
  const isProfileSetup = pathname.startsWith("/profile/setup");
  const isWorkerRoute = pathname.startsWith("/worker");
  const isEmployerRoute = pathname.startsWith("/employer");
  const isAdminRoute = pathname.startsWith("/admin");
  const isProtectedRoute = isWorkerRoute || isEmployerRoute || isAdminRoute || isProfileSetup;

  if (!isProtectedRoute && !isAuthPage) {
    return NextResponse.next();
  }

  const { supabaseResponse, user } = await updateSession(request);

  if (!user && isProtectedRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (user) {
    const role = user.user_metadata?.role as string | undefined;

    if (isAuthPage) {
      if (role === "worker") return NextResponse.redirect(new URL("/worker/dashboard", request.url));
      if (role === "employer") return NextResponse.redirect(new URL("/employer/dashboard", request.url));
      if (role === "admin") return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      return NextResponse.redirect(new URL("/profile/setup", request.url));
    }

    if (isProfileSetup && role) {
      return NextResponse.redirect(new URL(`/${role}/dashboard`, request.url));
    }

    if (isWorkerRoute && role !== "worker") return NextResponse.redirect(new URL("/login", request.url));
    if (isEmployerRoute && role !== "employer") return NextResponse.redirect(new URL("/login", request.url));
    if (isAdminRoute && role !== "admin") return NextResponse.redirect(new URL("/login", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
