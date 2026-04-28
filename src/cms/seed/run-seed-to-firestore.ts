/**
 * Programmatic seeding via Firebase **Admin SDK** (service account or ADC).
 *
 * Intended for **development / staging** only : see `scripts/cms-seed-dev.ts` and package script `cms:seed:dev`.
 *
 * Manual production bootstrap still relies on Firebase Console steps documented in `bootstrap-first-admin.ts`.
 *
 * Environment (same as `src/firebase/admin.ts`):
 * - `FIREBASE_PROJECT_ID` (or `GCLOUD_PROJECT`)
 * - `FIREBASE_SERVICE_ACCOUNT_JSON` **one-line** service account JSON for local/CI, **or**
 * - Application Default Credentials + project id on GCP.
 */

import { FieldValue } from "firebase-admin/firestore";
import { COLLECTIONS } from "@/cms/firestore/collections";
import { SEED_SAMPLE_AUTHORS } from "@/cms/seed/sample-authors";
import { SEED_SAMPLE_CATEGORIES } from "@/cms/seed/sample-categories";
import { SEED_SAMPLE_SITE_SETTINGS, SEED_SETTINGS_DOC_ID } from "@/cms/seed/sample-settings";
import { getAdminFirestore } from "@/firebase/server";

export type RunSeedToFirestoreOptions = {
  /**
   * When `true`, overwrites `settings/global` with {@link SEED_SAMPLE_SITE_SETTINGS}.
   * Default `false`: skips settings if the document already exists (avoids clobbering editor changes).
   */
  overwriteSettings?: boolean;
};

export type SeedDevReport = {
  categoriesWritten: string[];
  authorsWritten: string[];
  settingsWritten: boolean;
  settingsSkipped: boolean;
};

function assertDevOrExplicitAllow() {
  const allow = process.env.CMS_SEED_ALLOW === "1" || process.env.CMS_SEED_ALLOW === "true";
  const isDev = process.env.NODE_ENV !== "production";
  if (!isDev && !allow) {
    throw new Error(
      "Refusing to run CMS seed: set NODE_ENV=development or set CMS_SEED_ALLOW=1 for non-dev environments (staging only).",
    );
  }
}

/**
 * Writes sample categories, authors, and optionally the global settings document.
 * Idempotent for categories/authors (`merge: true`). Settings are optional / guarded.
 */
export async function runSeedToFirestore(options: RunSeedToFirestoreOptions = {}): Promise<SeedDevReport> {
  assertDevOrExplicitAllow();

  const db = getAdminFirestore();
  if (!db) {
    throw new Error(
      "Firebase Admin is not configured. Set FIREBASE_PROJECT_ID and FIREBASE_SERVICE_ACCOUNT_JSON (see src/firebase/admin.ts).",
    );
  }

  const categoriesWritten: string[] = [];
  const authorsWritten: string[] = [];
  let settingsWritten = false;
  let settingsSkipped = false;

  const now = FieldValue.serverTimestamp();

  for (const { id, data } of SEED_SAMPLE_CATEGORIES) {
    await db.collection(COLLECTIONS.categories).doc(id).set(
      {
        ...data,
        createdAt: now,
        updatedAt: now,
      },
      { merge: true },
    );
    categoriesWritten.push(id);
  }

  for (const { id, data } of SEED_SAMPLE_AUTHORS) {
    await db.collection(COLLECTIONS.authors).doc(id).set(
      {
        ...data,
        createdAt: now,
        updatedAt: now,
      },
      { merge: true },
    );
    authorsWritten.push(id);
  }

  const settingsRef = db.collection(COLLECTIONS.settings).doc(SEED_SETTINGS_DOC_ID);
  const settingsSnap = await settingsRef.get();
  const hasSettings = settingsSnap.exists;
  const skipSettings = hasSettings && options.overwriteSettings !== true;

  if (skipSettings) {
    settingsSkipped = true;
  } else {
    const createdPrior = hasSettings ? settingsSnap.data()?.createdAt : undefined;
    await settingsRef.set({
      ...SEED_SAMPLE_SITE_SETTINGS,
      createdAt: createdPrior ?? now,
      updatedAt: now,
    });
    settingsWritten = true;
  }

  return {
    categoriesWritten,
    authorsWritten,
    settingsWritten,
    settingsSkipped,
  };
}
