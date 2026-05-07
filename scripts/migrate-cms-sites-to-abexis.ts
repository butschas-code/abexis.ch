#!/usr/bin/env npx tsx
/**
 * One-shot migration: legacy multi-site CMS values → single site `abexis`.
 *
 * Updates Firestore:
 * - `posts`, `categories`, `vacancies`, `submissions`: `site` → `"abexis"`
 * - `settings/global`: merges legacy `contactBySite.search` and `seoBySite.search` into `abexis`,
 *   writes single-key maps, normalizes `switchBarLinks[].site` to `"abexis"`
 * - `categories`: removes deprecated `siteScope` if present
 *
 * Loads `.env.local` / `.env` like other CMS scripts. Requires Admin SDK
 * (`src/firebase/admin.ts`).
 *
 * Usage:
 *   npx tsx scripts/migrate-cms-sites-to-abexis.ts
 *   npx tsx scripts/migrate-cms-sites-to-abexis.ts --dry-run
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { FieldValue, type DocumentReference } from "firebase-admin/firestore";
import { COLLECTIONS } from "@/cms/firestore/collections";
import { CATEGORY_DOCUMENT_FIELDS, SETTINGS_DOCUMENT_FIELDS } from "@/cms/firestore/schema";
import { getAdminFirestore } from "@/firebase/server";
import { CMS_SETTINGS_GLOBAL_DOC_ID } from "@/cms/types/settings";

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

const EMPTY_CONTACT = {
  businessName: null,
  email: null,
  phone: null,
  addressLines: [] as string[],
  headline: null,
};

const EMPTY_SEO = {
  defaultTitle: null,
  defaultMetaDescription: null,
  titleSuffix: null,
  ogType: "website" as const,
};

function needsSiteStringFix(raw: unknown): boolean {
  if (raw === undefined || raw === null) return true;
  return String(raw) !== "abexis";
}

function mergeSettingsMaps(raw: Record<string, unknown>) {
  const cbsRaw = (raw[SETTINGS_DOCUMENT_FIELDS.contactBySite] ?? {}) as Record<string, unknown>;
  const searchC = cbsRaw.search != null && typeof cbsRaw.search === "object" ? cbsRaw.search : null;
  const abexisC = cbsRaw.abexis != null && typeof cbsRaw.abexis === "object" ? cbsRaw.abexis : null;
  const contactBySite = {
    abexis: {
      ...EMPTY_CONTACT,
      ...(searchC as object),
      ...(abexisC as object),
    },
  };

  const seoRaw = (raw[SETTINGS_DOCUMENT_FIELDS.seoBySite] ?? {}) as Record<string, unknown>;
  const searchSeo = seoRaw.search != null && typeof seoRaw.search === "object" ? seoRaw.search : null;
  const abexisSeo = seoRaw.abexis != null && typeof seoRaw.abexis === "object" ? seoRaw.abexis : null;
  const seoBySite = {
    abexis: {
      ...EMPTY_SEO,
      ...(searchSeo as object),
      ...(abexisSeo as object),
    },
  };

  const linksRaw = raw[SETTINGS_DOCUMENT_FIELDS.switchBarLinks];
  const switchBarLinks = Array.isArray(linksRaw)
    ? linksRaw.map((row) => {
        if (row && typeof row === "object" && "site" in row) {
          return { ...(row as Record<string, unknown>), site: "abexis" };
        }
        return row;
      })
    : [];

  return { contactBySite, seoBySite, switchBarLinks };
}

async function main() {
  loadEnvLocalFiles();
  const dryRun = process.argv.includes("--dry-run");

  const db = getAdminFirestore();
  if (!db) {
    console.error("Firebase Admin not configured (FIREBASE_PROJECT_ID + credentials).");
    process.exit(1);
  }

  type Op = { ref: DocumentReference; data: Record<string, unknown> };
  const ops: Op[] = [];

  for (const coll of [COLLECTIONS.posts, COLLECTIONS.vacancies, COLLECTIONS.submissions] as const) {
    const snap = await db.collection(coll).get();
    for (const doc of snap.docs) {
      const site = doc.get("site");
      if (needsSiteStringFix(site)) {
        ops.push({ ref: doc.ref, data: { site: "abexis" } });
      }
    }
  }

  {
    const snap = await db.collection(COLLECTIONS.categories).get();
    for (const doc of snap.docs) {
      const site = doc.get(CATEGORY_DOCUMENT_FIELDS.site) ?? doc.get("siteScope");
      const patch: Record<string, unknown> = {};
      if (needsSiteStringFix(site)) {
        patch[CATEGORY_DOCUMENT_FIELDS.site] = "abexis";
      }
      if (doc.get("siteScope") !== undefined) {
        patch.siteScope = FieldValue.delete();
      }
      if (Object.keys(patch).length > 0) {
        ops.push({ ref: doc.ref, data: patch });
      }
    }
  }

  const settingsRef = db.collection(COLLECTIONS.settings).doc(CMS_SETTINGS_GLOBAL_DOC_ID);
  const settingsSnap = await settingsRef.get();
  if (settingsSnap.exists) {
    const merged = mergeSettingsMaps(settingsSnap.data() as Record<string, unknown>);
    ops.push({
      ref: settingsRef,
      data: {
        [SETTINGS_DOCUMENT_FIELDS.contactBySite]: merged.contactBySite,
        [SETTINGS_DOCUMENT_FIELDS.seoBySite]: merged.seoBySite,
        [SETTINGS_DOCUMENT_FIELDS.switchBarLinks]: merged.switchBarLinks,
        [SETTINGS_DOCUMENT_FIELDS.updatedAt]: FieldValue.serverTimestamp(),
      },
    });
  }

  console.log(`${dryRun ? "[dry-run] " : ""}Planned writes: ${ops.length}`);
  if (dryRun) {
    return;
  }

  const chunk = 400;
  for (let i = 0; i < ops.length; i += chunk) {
    const batch = db.batch();
    for (const op of ops.slice(i, i + chunk)) {
      batch.update(op.ref, op.data);
    }
    await batch.commit();
    console.log(`Committed ${Math.min(i + chunk, ops.length)} / ${ops.length}`);
  }
  console.log("Done.");
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
