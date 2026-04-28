#!/usr/bin/env npx tsx
/**
 * Development / staging : seeds sample categories, authors, and starter settings into Firestore.
 *
 * -----------------------------------------------------------------------------
 * Prerequisites (manual)
 * -----------------------------------------------------------------------------
 *
 * 1. Firebase project with Firestore enabled.
 * 2. Service account (Console → Project settings → Service accounts) OR use `gcloud auth application-default login`.
 * 3. Environment variables (see `src/firebase/admin.ts`):
 *    - `FIREBASE_PROJECT_ID`
 *    - `FIREBASE_SERVICE_ACCOUNT_JSON` = full JSON on **one line** in `.env.local`, **or** ADC with project id.
 *
 * -----------------------------------------------------------------------------
 * Run
 * -----------------------------------------------------------------------------
 *
 * ```
 * npm run cms:seed:dev
 * ```
 *
 * Optional: force settings overwrite if `settings/global` already exists:
 * ```
 * CMS_SEED_OVERWRITE_SETTINGS=1 npm run cms:seed:dev
 * ```
 *
 * Non-dev staging (use sparingly):
 * ```
 * CMS_SEED_ALLOW=1 NODE_ENV=production npm run cms:seed:dev
 * ```
 *
 * This script does **not** create Auth users : use Firebase Console + `bootstrap-first-admin` helpers for that.
 *
 * -----------------------------------------------------------------------------
 */

import { runSeedToFirestore } from "../src/cms/seed/run-seed-to-firestore";

const overwriteSettings =
  process.env.CMS_SEED_OVERWRITE_SETTINGS === "1" || process.env.CMS_SEED_OVERWRITE_SETTINGS === "true";

async function main() {
  const report = await runSeedToFirestore({ overwriteSettings });
  console.log("[cms:seed:dev] done:", JSON.stringify(report, null, 2));
}

main().catch((err) => {
  console.error("[cms:seed:dev] failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
