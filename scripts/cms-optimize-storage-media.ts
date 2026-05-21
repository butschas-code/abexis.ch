#!/usr/bin/env npx tsx
/**
 * Downloads raster objects from Firebase Storage, losslessly-ish recompresses them with Sharp,
 * writes back **to the same path**, preserves custom metadata (including Firebase download tokens),
 * and syncs matching `media` Firestore rows (`mimeType`, `sizeBytes`).
 *
 * -----------------------------------------------------------------------------
 * Prerequisites
 * -----------------------------------------------------------------------------
 *
 * Same as other CMS Admin scripts (`src/firebase/admin.ts`):
 * - `FIREBASE_SERVICE_ACCOUNT_JSON` **or** ADC + `FIREBASE_PROJECT_ID`
 * - Bucket: `FIREBASE_STORAGE_BUCKET` or `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
 *
 * -----------------------------------------------------------------------------
 * Run (loads `.env.local` via Next env helper)
 * -----------------------------------------------------------------------------
 *
 * ```
 * pnpm run cms:optimize-storage-media -- --dry-run
 * pnpm run cms:optimize-storage-media -- --prefix cms/media/
 * pnpm run cms:optimize-storage-media -- --prefix site/partners/
 * ```
 *
 * Flags:
 * - `--dry-run` — measure savings only; no uploads.
 * - `--prefix <path>` — scan prefix (repeatable). Default: `cms/media/`.
 * - `--limit <n>` — stop after n processed files (uploads or skips).
 * - `--force` — ignore previous `cmsRasterOptimized` marker (still skips if no byte savings).
 *
 * Production bucket writes require explicit consent:
 * ```
 * CMS_OPTIMIZE_STORAGE_ALLOW=1 pnpm run cms:optimize-storage-media
 * ```
 *
 * Skips: non-images, GIF, SVG, objects larger than 40MB.
 */

import { loadEnvConfig } from "@next/env";
import sharp from "sharp";
import { FieldValue } from "firebase-admin/firestore";

import { COLLECTIONS } from "@/cms/firestore/collections";
import { getAdminFirestore, getAdminStorage } from "@/firebase/admin";

loadEnvConfig(process.cwd());

const MAX_BYTES = 40 * 1024 * 1024;
const IMAGE_RE = /\.(jpe?g|png|webp)$/i;

type OptimizeResult = { buffer: Buffer; contentType: string };

async function optimizeRaster(buffer: Buffer): Promise<OptimizeResult | null> {
  let img = sharp(buffer);
  const meta = await img.metadata();

  if (meta.format === "gif" || meta.format === "svg") return null;

  img = img.rotate();

  let out: Buffer;
  let contentType: string;

  if (meta.format === "png") {
    out = await img.png({ compressionLevel: 9, effort: 10 }).toBuffer();
    contentType = "image/png";
  } else if (meta.format === "jpeg" || meta.format === "jpg") {
    out = await img.jpeg({ quality: 82, mozjpeg: true }).toBuffer();
    contentType = "image/jpeg";
  } else if (meta.format === "webp") {
    out = await img.webp({ quality: 82, effort: 6 }).toBuffer();
    contentType = "image/webp";
  } else {
    return null;
  }

  if (out.length >= buffer.length * 0.97) return null;
  return { buffer: out, contentType };
}

function normalizePrefix(p: string): string {
  const t = p.trim();
  if (!t) return "";
  return t.endsWith("/") ? t : `${t}/`;
}

function parseArgs(argv: string[]) {
  const dryRun = argv.includes("--dry-run");
  const force = argv.includes("--force");
  const prefixes: string[] = [];
  let limit: number | undefined;

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--prefix" && argv[i + 1]) {
      prefixes.push(normalizePrefix(argv[++i]));
      continue;
    }
    if (a.startsWith("--prefix=")) {
      prefixes.push(normalizePrefix(a.slice("--prefix=".length)));
      continue;
    }
    if (a === "--limit" && argv[i + 1]) {
      limit = Math.max(1, parseInt(argv[++i], 10));
      continue;
    }
    if (a.startsWith("--limit=")) {
      limit = Math.max(1, parseInt(a.slice("--limit=".length), 10));
      continue;
    }
  }

  if (prefixes.length === 0) prefixes.push(normalizePrefix("cms/media"));

  return { dryRun, force, prefixes, limit };
}

async function syncFirestoreMedia(storagePath: string, mimeType: string, sizeBytes: number) {
  const db = getAdminFirestore();
  if (!db) return;

  const qs = await db.collection(COLLECTIONS.media).where("storagePath", "==", storagePath).get();
  if (qs.empty) return;

  const batch = db.batch();
  for (const doc of qs.docs) {
    batch.update(doc.ref, {
      mimeType,
      sizeBytes,
      optimizedAt: FieldValue.serverTimestamp(),
    });
  }
  await batch.commit();
}

async function main() {
  const argv = process.argv.slice(2);
  const { dryRun, force, prefixes, limit } = parseArgs(argv);

  const storage = getAdminStorage();
  if (!storage) {
    console.error("[cms:optimize-storage-media] Firebase Admin Storage not configured.");
    process.exit(1);
  }

  const bucketName =
    process.env.FIREBASE_STORAGE_BUCKET?.trim() ||
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim();

  if (!bucketName) {
    console.error(
      "[cms:optimize-storage-media] Set FIREBASE_STORAGE_BUCKET or NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET.",
    );
    process.exit(1);
  }

  if (process.env.NODE_ENV === "production" && process.env.CMS_OPTIMIZE_STORAGE_ALLOW !== "1") {
    console.error(
      "[cms:optimize-storage-media] Refusing production writes without CMS_OPTIMIZE_STORAGE_ALLOW=1",
    );
    process.exit(1);
  }

  const bucket = storage.bucket(bucketName);
  let processed = 0;
  let optimizedWrites = 0;
  let skipped = 0;

  outer: for (const prefix of prefixes) {
    const [files] = await bucket.getFiles({ prefix, autoPaginate: true });

    for (const file of files) {
      if (limit != null && processed >= limit) break outer;

      const name = file.name;
      if (name.endsWith("/") || !IMAGE_RE.test(name)) continue;

      processed++;

      const [meta] = await file.getMetadata();
      const custom = meta.metadata ?? {};

      if (!force && custom.cmsRasterOptimized === "v1") {
        console.log(`skip (already marked): ${name}`);
        skipped++;
        continue;
      }

      const [buf] = await file.download();
      if (buf.length > MAX_BYTES) {
        console.warn(`skip (>${MAX_BYTES} bytes): ${name}`);
        skipped++;
        continue;
      }

      const optimized = await optimizeRaster(buf);
      if (!optimized) {
        console.log(`skip (no gain / unsupported): ${name}`);
        skipped++;
        continue;
      }

      const before = buf.length;
      const after = optimized.buffer.length;
      const pct = Math.round((1 - after / before) * 100);

      if (dryRun) {
        console.log(`[dry-run] ${name}: ${before} → ${after} bytes (${pct}% smaller)`);
        optimizedWrites++;
        continue;
      }

      const mergedMeta = {
        ...custom,
        cmsRasterOptimized: "v1",
        cmsRasterOptimizedAt: new Date().toISOString(),
        cmsRasterOptimizedPrevBytes: String(before),
        cmsRasterOptimizedNewBytes: String(after),
      };

      await file.save(optimized.buffer, {
        resumable: false,
        metadata: {
          contentType: optimized.contentType,
          metadata: mergedMeta,
          cacheControl: meta.cacheControl ?? "public, max-age=31536000",
        },
      });

      console.log(`optimized: ${name}  ${before} → ${after} bytes (${pct}%)`);

      await syncFirestoreMedia(name, optimized.contentType, after);
      optimizedWrites++;
    }
  }

  console.log(
    `[cms:optimize-storage-media] done. raster candidates=${processed}, optimized=${optimizedWrites}, skipped=${skipped}, dryRun=${dryRun}`,
  );
}

main().catch((err) => {
  console.error("[cms:optimize-storage-media] failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
