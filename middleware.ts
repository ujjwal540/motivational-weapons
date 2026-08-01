import { NextResponse, type NextRequest } from "next/server";

import { SESSION_COOKIE_NAME } from "@/lib/session-cookie";

/**
 * This is a fast, cookie-*presence* check only — middleware runs on the
 * Edge runtime and can't call Firebase Admin (which needs Node.js APIs) to
 * actually verify the cookie. Its job is just to bounce obviously
 * signed-out visitors before they download the page. The real
 * authorization check (valid session + ADMIN role) happens server-side in
 * `requireAdmin()` on every protected page — that's the actual security
 * boundary, not this file.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSessionCookie = Boolean(
    request.cookies.get(SESSION_COOKIE_NAME)?.value
  );

  const isLoginRoute = pathname === "/admin/login";
  const isProtectedAdminRoute = pathname.startsWith("/admin") && !isLoginRoute;

  if (isProtectedAdminRoute && !hasSessionCookie) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginRoute && hasSessionCookie) {
    const dashboardUrl = new URL("/admin/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
