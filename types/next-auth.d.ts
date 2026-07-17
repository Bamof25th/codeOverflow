import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      /** `<provider>_<providerAccountId>`, mirrored on the User document. */
      authId: string;
    } & DefaultSession["user"];
  }
}

// Augments the module that actually declares JWT. `next-auth/jwt` only
// re-exports it, so declaring against that path would shadow the interface
// instead of merging into it.
declare module "@auth/core/jwt" {
  interface JWT {
    authId?: string;
  }
}
