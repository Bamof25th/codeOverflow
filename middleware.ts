import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import authConfig from "./auth.config";

// Built from the edge-safe config only — the database callbacks in `auth.ts`
// cannot run in middleware. Reading the session from the JWT needs no DB access.
const { auth } = NextAuth(authConfig);

const isProtectedRoute = (pathname: string) => pathname.startsWith("/ask-question");

export default auth((req) => {
  if (!isProtectedRoute(req.nextUrl.pathname) || req.auth) return;

  const signInUrl = new URL("/sign-in", req.nextUrl.origin);
  signInUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
  return NextResponse.redirect(signInUrl);
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
