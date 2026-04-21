#!/usr/bin/env npx tsx
/**
 * Delete Firestore `posts` documents matching a slug (exact match).
 *
 * Loads `.env.local` / `.env` like other CMS scripts. Requires Admin credentials
 * (@see `src/firebase/admin.ts`).
 *
 * Usage: npx tsx scripts/delete-cms-post-by-slug.ts <slug>
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { COLLECTIONS } from "@/cms/firestore/collections";
import { getAdminFirestore } from "@/firebase/server";

function loadEnvLocalFiles() {
  for (const name of [".env.local", ".env"] as const) {
    const p = resolve(process.cwd(), name);
    if (!existsSync(p)) continue;
    const text = readFileSync(p, "utf8");
    for (const line of text.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq <= 0) continue;
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (process.env[key] === undefined) process.env[key] = val;
    }
  }
}

async function main() {
  loadEnvLocalFiles();
  const slug = process.argv[2]?.trim();
  if (!slug) {
    console.error("Usage: npx tsx scripts/delete-cms-post-by-slug.ts <slug>");
    process.exit(1);
  }

  const db = getAdminFirestore();
  if (!db) {
    console.error("Firebase Admin not configured (FIREBASE_PROJECT_ID + credentials).");
    process.exit(1);
  }

  const snap = await db.collection(COLLECTIONS.posts).where("slug", "==", slug).get();
  if (snap.empty) {
    console.log(`No posts found with slug "${slug}".`);
    return;
  }

  const batch = db.batch();
  for (const doc of snap.docs) {
    console.log(`Deleting ${doc.id} (${doc.get("title") ?? "no title"})`);
    batch.delete(doc.ref);
  }
  await batch.commit();
  console.log(`Deleted ${snap.size} document(s).`);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
