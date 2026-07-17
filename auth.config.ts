import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";

// Edge-safe slice of the auth config. `middleware.ts` runs on the edge runtime,
// where mongoose cannot load, so anything touching the database lives in
// `auth.ts` instead and never reaches the middleware bundle.
export default {
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/sign-in",
  },
} satisfies NextAuthConfig;
