import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "./navigation";

const intlMiddleware = createMiddleware(routing);

const PROTECTED = ["/dashboard/patient", "/dashboard/doctor"];

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED.some((p) => pathname.includes(p));
  if (isProtected) {
    const token = request.cookies.get("easydoc_token")?.value;
    if (!token) {
      const segments = pathname.split("/");
      const locale = ["tj", "ru", "en"].includes(segments[1]) ? segments[1] : "tj";
      return NextResponse.redirect(
        new URL(`/${locale}/auth/login`, request.url)
      );
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
