import { NextResponse, type NextRequest } from "next/server";

const protectedRoutes = ["/practice", "/learn", "/journal", "/builder", "/saved", "/contribute", "/steward"];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isProtected = protectedRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

  if (!isProtected) {
    return NextResponse.next();
  }

  const hasDemoSession = request.cookies.get("kambradu_demo_user")?.value === "true";

  if (hasDemoSession) {
    return NextResponse.next();
  }

  const requestHost = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? request.nextUrl.host;
  const requestProto = request.headers.get("x-forwarded-proto") ?? request.nextUrl.protocol.replace(":", "");
  const requestOrigin =
    request.headers.get("origin") ??
    (request.headers.get("referer") ? new URL(request.headers.get("referer") as string).origin : null) ??
    `${requestProto}://${requestHost}`;
  const signInUrl = new URL("/sign-in", requestOrigin);

  signInUrl.searchParams.set("next", pathname);
  return new NextResponse(null, {
    status: 307,
    headers: {
      Location: signInUrl.href
    }
  });
}

export const config = {
  matcher: [
    "/practice/:path*",
    "/learn/:path*",
    "/journal/:path*",
    "/builder/:path*",
    "/saved/:path*",
    "/contribute/:path*",
    "/steward/:path*"
  ]
};
