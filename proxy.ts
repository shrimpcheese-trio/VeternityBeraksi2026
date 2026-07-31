import { updateSession } from "@/lib/supabase/middleware";
import { type NextRequest, NextResponse } from "next/server";

const PUBLIC_API_GET_PATTERNS = [
  /^\/api\/worker\/[^/]+$/,
  /^\/api\/employer\/[^/]+$/,
  /^\/api\/proof-of-work\/[^/]+$/,
  /^\/api\/trust-score\/[^/]+$/,
  /^\/api\/listings$/,
  /^\/api\/wage-estimate$/,
];

function isPublicApiGet(request: NextRequest): boolean {
  if (request.method !== "GET") return false;
  return PUBLIC_API_GET_PATTERNS.some((pattern) =>
    pattern.test(request.nextUrl.pathname),
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isServerAction = request.headers.has("next-action");
  if (isServerAction) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    if (isPublicApiGet(request)) {
      return NextResponse.next();
    }
    const { user } = await updateSession(request);
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized", code: "UNAUTHORIZED" },
        { status: 401 },
      );
    }
    return NextResponse.next();
  }

  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/register");
  const isProfileSetup = pathname.startsWith("/profile/setup");
  const isOwnProfile = pathname === "/profile";
  const isSettings = pathname === "/settings";
  const isWorkerRoute = pathname.startsWith("/worker");
  const isEmployerRoute = pathname.startsWith("/employer");
  const isAdminRoute = pathname.startsWith("/admin");
  const isProtectedRoute =
    isWorkerRoute || isEmployerRoute || isAdminRoute || isProfileSetup || isOwnProfile || isSettings;

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
      if (role === "worker")
        return NextResponse.redirect(new URL("/worker/dashboard", request.url));
      if (role === "employer")
        return NextResponse.redirect(
          new URL("/employer/dashboard", request.url),
        );
      if (role === "admin")
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      return NextResponse.redirect(new URL("/profile/setup", request.url));
    }

    if (isProfileSetup && role) {
      return NextResponse.redirect(
        new URL(`/${role}/dashboard`, request.url),
      );
    }

    if (!role && isProtectedRoute && !isProfileSetup) {
      return NextResponse.redirect(new URL("/profile/setup", request.url));
    }

    if (isWorkerRoute && role !== "worker")
      return NextResponse.redirect(new URL("/login", request.url));
    if (isEmployerRoute && role !== "employer")
      return NextResponse.redirect(new URL("/login", request.url));
    if (isAdminRoute && role !== "admin")
      return NextResponse.redirect(new URL("/login", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
