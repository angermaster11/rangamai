import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Fast edge guard: if the auth cookie is absent, bounce to /login before
 * rendering any protected page. This is a presence check only — the API still
 * fully validates the JWT on every request (the cookie could be expired/forged).
 * The real authorization gate is the API's JwtAuthGuard, not this.
 */
const COOKIE_NAME = process.env.NEXT_PUBLIC_COOKIE_NAME ?? "rangamai_token";

export function middleware(req: NextRequest): NextResponse {
  const hasToken = req.cookies.has(COOKIE_NAME);
  const { pathname } = req.nextUrl;

  const isLogin = pathname === "/login";

  if (!hasToken && !isLogin) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    // Preserve where they were headed so login can send them back.
    if (pathname !== "/") url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Already authenticated and hitting /login → send to the dashboard.
  if (hasToken && isLogin) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Guard everything except Next internals and static/asset files.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
