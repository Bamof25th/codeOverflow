import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { ConnectToDataBase } from "@/lib/mongoose";
import User from "@/lib/database/user.model";

// GitHub sends `login` and `avatar_url`, neither of which is on the base Profile type.
interface GitHubProfile {
  login?: string;
  avatar_url?: string;
}

const FALLBACK_PICTURE = "/assets/icons/account.svg";

// authIds are route params (`/profile/<authId>`), so the separator has to
// survive a URL path segment untouched. A colon does not: Next.js
// percent-encodes it, and `params.id` comes back as "github%3A123".
const buildAuthId = (provider: string, providerAccountId: string) =>
  `${provider}_${providerAccountId}`;

// `username` is unique in the schema, so a handle that's already taken needs a suffix.
async function resolveUsername(preferred: string) {
  const base = preferred.toLowerCase().replace(/[^a-z0-9_-]/g, "") || "user";

  for (let suffix = 0; suffix < 100; suffix++) {
    const candidate = suffix === 0 ? base : `${base}${suffix}`;
    if (!(await User.exists({ username: candidate }))) return candidate;
  }

  return `${base}${Date.now()}`;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider !== "github") return false;

      const authId = buildAuthId(account.provider, account.providerAccountId);
      const login = (profile as GitHubProfile)?.login;

      // GitHub omits the email when the user keeps it private. The noreply
      // address is stable and unique, which is all the schema requires.
      const email =
        user.email ??
        `${account.providerAccountId}+${login}@users.noreply.github.com`;

      try {
        await ConnectToDataBase();

        if (await User.exists({ authId })) return true;

        // An account may already exist from the Clerk era. Adopt it by email so
        // the user keeps their questions, answers and saved list.
        const existing = await User.findOne({ email });
        if (existing) {
          existing.authId = authId;
          existing.picture = existing.picture || user.image || FALLBACK_PICTURE;
          await existing.save();
          return true;
        }

        await User.create({
          authId,
          name: user.name ?? login ?? "Anonymous",
          username: await resolveUsername(
            login ?? `user${account.providerAccountId}`
          ),
          email,
          picture: user.image ?? FALLBACK_PICTURE,
        });

        return true;
      } catch (error) {
        console.log("Failed to sync user on sign in", error);
        return false;
      }
    },

    async jwt({ token, account }) {
      // `account` is only present on the initial sign in; afterwards the value
      // is already baked into the token.
      if (account) {
        token.authId = buildAuthId(account.provider, account.providerAccountId);
      }
      return token;
    },

    async session({ session, token }) {
      if (token.authId) {
        session.user.authId = token.authId;
      }
      return session;
    },
  },
});
