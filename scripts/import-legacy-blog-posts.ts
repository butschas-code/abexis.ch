#!/usr/bin/env npx tsx
/**
 * One-time (or idempotent) import of legacy blog JSON into Firestore `posts`.
 *
 * @see scripts/migration/README.md
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { Timestamp } from "firebase-admin/firestore";
import { COLLECTIONS } from "@/cms/firestore/collections";
import {
  DEFAULT_LEGACY_IMPORT_AUTHOR_ID,
  mapLegacyPostToUpsert,
  parseLegacyPostsPayload,
  resolveLegacySlugForImport,
  type LegacyPostJson,
} from "@/cms/migration/legacy-post-import";
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

function assertAllowImport() {
  const allow =
    process.env.CMS_LEGACY_IMPORT_ALLOW === "1" || process.env.CMS_LEGACY_IMPORT_ALLOW === "true";
  const dev = process.env.NODE_ENV !== "production";
  if (!dev && !allow) {
    throw new Error(
      "Refusing legacy import: set NODE_ENV=development or CMS_LEGACY_IMPORT_ALLOW=1 (staging only).",
    );
  }
}

async function main() {
  loadEnvLocalFiles();
  assertAllowImport();

  const jsonPath = process.argv[2];
  if (!jsonPath) {
    console.error("Usage: npx tsx scripts/import-legacy-blog-posts.ts <path/to/legacy-posts.json>");
    process.exit(1);
  }

  const abs = resolve(process.cwd(), jsonPath);
  let file;
  try {
    const rawJson: unknown = JSON.parse(readFileSync(abs, "utf8"));
    file = parseLegacyPostsPayload(rawJson);
  } catch (e) {
    console.error("[cms:import:legacy] Failed to read or parse JSON:", e instanceof Error ? e.message : e);
    process.exit(1);
  }

  const db = getAdminFirestore();
  if (!db) {
    console.error(
      "[cms:import:legacy] Firebase Admin not configured. Set FIREBASE_PROJECT_ID and FIREBASE_SERVICE_ACCOUNT_JSON (see src/firebase/admin.ts).",
    );
    process.exit(1);
  }

  const authorId =
    process.env.CMS_LEGACY_IMPORT_AUTHOR_ID?.trim() || DEFAULT_LEGACY_IMPORT_AUTHOR_ID;

  let imported = 0;
  let skippedDuplicate = 0;
  let skippedInvalid = 0;
  const invalidSamples: { legacySlug: string; reasons: string[] }[] = [];
  /** Normalized slugs already written or queued in this process (avoids two rows mapping to one slug). */
  const seenSlugsThisRun = new Set<string>();

  for (const row of file.posts) {
    const normalizedSlug = resolveLegacySlugForImport(row);
    if (seenSlugsThisRun.has(normalizedSlug)) {
      skippedDuplicate++;
      console.log(`[skip duplicate in-file] slug=${normalizedSlug}`);
      continue;
    }

    const dup = await db
      .collection(COLLECTIONS.posts)
      .where("slug", "==", normalizedSlug)
      .limit(1)
      .get();
    if (!dup.empty) {
      skippedDuplicate++;
      console.log(`[skip duplicate] slug=${normalizedSlug}`);
      continue;
    }

    const id = db.collection(COLLECTIONS.posts).doc().id;
    const mapped = mapLegacyPostToUpsert(row, { id, authorId });
    if (!mapped.ok) {
      skippedInvalid++;
      if (invalidSamples.length < 30) {
        invalidSamples.push({ legacySlug: row.slug, reasons: mapped.reasons });
      }
      console.log(`[skip invalid] legacy slug=${row.slug} -> ${mapped.reasons.join("; ")}`);
      continue;
    }

    const u = mapped.upsert;
    const pub = u.publishedAt ? new Date(u.publishedAt) : new Date();
    const t = Number.isFinite(pub.getTime()) ? Timestamp.fromDate(pub) : Timestamp.fromDate(new Date());

    await db.collection(COLLECTIONS.posts).doc(u.id).set({
      title: u.title,
      slug: u.slug,
      excerpt: u.excerpt,
      body: u.body,
      heroImageUrl: u.heroImageUrl,
      heroImageAlt: u.heroImageAlt,
      heroImagePath: u.heroImagePath,
      authorId: u.authorId,
      categoryIds: u.categoryIds,
      tags: u.tags,
      site: u.site,
      status: u.status,
      seoTitle: u.seoTitle,
      seoDescription: u.seoDescription,
      featured: u.featured,
      publishedAt: t,
      createdAt: t,
      updatedAt: t,
    });

    imported++;
    seenSlugsThisRun.add(u.slug);
    const titlePreview = u.title.length > 70 ? `${u.title.slice(0, 70)}…` : u.title;
    console.log(`[imported] id=${u.id} slug=${u.slug} title=${titlePreview}`);
  }

  console.log(
    "\n[cms:import:legacy] summary:\n",
    JSON.stringify(
      {
        file: abs,
        totalRows: file.posts.length,
        imported,
        skippedDuplicate,
        skippedInvalid,
        invalidSamples,
      },
      null,
      2,
    ),
  );
}

main().catch((e) => {
  console.error("[cms:import:legacy] failed:", e instanceof Error ? e.message : e);
  process.exit(1);
});
