/**
 * Idempotent index migration for the short-code lookup.
 *
 *   pnpm --filter server migrate -- --yes      (never run blind against prod)
 *
 * Re-running it is safe: existing indexes are inspected first and only recreated
 * when their options differ from what we need.
 */
import mongoose from "mongoose";
import { MONGODB_URI } from "../src/database/db-connect";

const TARGETS = [
  {
    collection: "urls",
    keys: { short_url: 1 },
    options: { unique: true },
    note: "short code -> url lookup (must be unique)",
  },
  {
    collection: "clicks",
    keys: { short_url: 1, date: 1 },
    options: {},
    note: "click aggregation per short code and day",
  },
];

const sameKeys = (a: Record<string, number>, b: Record<string, number>) => {
  const left = Object.entries(a).sort();
  const right = Object.entries(b).sort();
  return (
    left.length === right.length &&
    left.every(([k, v], i) => right[i][0] === k && right[i][1] === v)
  );
};

async function ensureIndex(
  collection: string,
  keys: Record<string, number>,
  options: { unique?: boolean },
) {
  const col = mongoose.connection.db.collection(collection);
  // A collection that was never written to does not exist yet -> no indexes.
  const existing = await col.indexes().catch(() => [] as mongoose.mongo.IndexDescription[]);
  const match = existing.find((index) => sameKeys(index.key, keys));

  if (match) {
    const unique = !!options.unique;
    if (!!match.unique === unique) {
      console.log(`= ${collection} ${JSON.stringify(keys)} already correct (${match.name})`);
      return;
    }
    // Same keys, different options (e.g. missing the unique flag) -> recreate.
    console.log(`~ ${collection} ${JSON.stringify(keys)} has wrong options, recreating`);
    await col.dropIndex(match.name);
  }

  await col.createIndex(keys, options);
  console.log(`+ ${collection} ${JSON.stringify(keys)} created`);
}

async function main() {
  const target = MONGODB_URI.replace(/\/\/[^@]*@/, "//***@");
  console.log(`Target: ${target}`);

  if (!process.argv.includes("--yes")) {
    console.log("\nRe-run with --yes to apply the indexes above.");
    return;
  }

  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10_000 });
  for (const target of TARGETS) {
    await ensureIndex(target.collection, target.keys, target.options);
    console.log(`  -> ${target.note}`);
  }
  await mongoose.disconnect();
}

main().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
