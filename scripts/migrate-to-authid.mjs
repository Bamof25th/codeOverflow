/**
 * One-off migration onto NextAuth. Run once, before serving traffic:
 *
 *   node scripts/migrate-to-authid.mjs
 *
 * Background: the live `users` collection stores the Clerk id in a field named
 * `userId` (values look like `user_2n4uB9e8...`), under a UNIQUE `userId_1`
 * index. The model in this repo had since been renamed to `clerkId` without the
 * database ever being migrated, so both names are handled here.
 *
 * This script:
 *
 * 1. Renames `userId` (or `clerkId`, whichever is present) -> `authId`, so every
 *    existing row carries a distinct value. That matters because mongoose builds
 *    a unique index on `authId`: if the rows had no value, they would all index
 *    as null and collide with each other.
 * 2. Drops the stale unique index. Left in place it would reject every signup
 *    after the first, since new users never set `userId`/`clerkId` and a second
 *    null violates uniqueness.
 *
 * The renamed values are stale Clerk ids that match no GitHub account. That is
 * expected: the first GitHub sign-in matches the account by email and replaces
 * `authId` with `github:<id>` (see the signIn callback in auth.ts), so existing
 * questions, answers and saved lists survive.
 *
 * Safe to run more than once.
 */
import { MongoClient } from "mongodb";
import { readFileSync } from "node:fs";

const DB_NAME = "codeflow";
const LEGACY_FIELDS = ["userId", "clerkId"];

function fromEnvFile(key) {
  try {
    const file = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
    const line = file.split("\n").find((l) => l.trim().startsWith(`${key}=`));
    return line?.slice(line.indexOf("=") + 1).trim();
  } catch {
    return undefined;
  }
}

const url = process.env.MONGODB_URL ?? fromEnvFile("MONGODB_URL");

if (!url) {
  console.error("MONGODB_URL is not set (checked env and .env.local)");
  process.exit(1);
}

const client = new MongoClient(url);

try {
  await client.connect();
  const users = client.db(DB_NAME).collection("users");

  for (const field of LEGACY_FIELDS) {
    // Drop the index BEFORE renaming, not after. $rename strips the field one
    // document at a time, so the first renamed row immediately indexes as null
    // and the second one collides with it — the migration would fail partway
    // through against its own index.
    const indexName = `${field}_1`;
    const indexes = await users.indexes();
    if (indexes.some((index) => index.name === indexName)) {
      await users.dropIndex(indexName);
      console.log(`Dropped stale ${indexName} index`);
    }

    const { modifiedCount } = await users.updateMany(
      { [field]: { $exists: true }, authId: { $exists: false } },
      { $rename: { [field]: "authId" } }
    );

    if (modifiedCount > 0) {
      console.log(`Renamed ${field} -> authId on ${modifiedCount} user(s)`);
    } else {
      console.log(`No documents with ${field} to rename`);
    }
  }

  // Early builds wrote `<provider>:<id>`. The colon does not survive a URL path
  // segment — Next.js percent-encodes it, so `/profile/<authId>` looked the id
  // up as "github%3A123" and never matched. Rewrite them to the `_` form.
  const legacySeparator = await users
    .find({ authId: { $regex: "^[a-z]+:" } })
    .toArray();

  for (const user of legacySeparator) {
    await users.updateOne(
      { _id: user._id },
      { $set: { authId: user.authId.replace(":", "_") } }
    );
    console.log(`Normalised authId ${user.authId} -> ${user.authId.replace(":", "_")}`);
  }

  const total = await users.countDocuments();
  const withAuthId = await users.countDocuments({ authId: { $exists: true } });
  console.log(`Done: ${withAuthId}/${total} user(s) now have an authId`);

  if (withAuthId !== total) {
    console.warn(
      "Some users have no authId. The unique index on authId will reject them; " +
        "inspect those documents before starting the app."
    );
  }
} catch (error) {
  console.error("Migration failed:", error);
  process.exit(1);
} finally {
  await client.close();
}
