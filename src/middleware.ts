import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  const headerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;
  const cookieToken = request.cookies.get("token")?.value;
  const token = headerToken || cookieToken;
  

  
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);
 
  

  if (token && request.nextUrl.pathname.startsWith("/api/")) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }
  requestHeaders.set(
    "x-auth-token",
    token ? "authenticated" : "unauthenticated"
  );

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/shipDetails/:path*",
    "/login/:path*",
    "/signup/:path*",
    "/forgot-password/:path*",
    "/reset-password/:path*",
    "/api/private/:path*",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
  ],
};
