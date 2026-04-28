/**
 * CMS onboarding & **non-production** seed data (categories, authors, settings) plus helpers for the first admin user.
 *
 * -----------------------------------------------------------------------------
 * What you do **manually** (Firebase Console)
 * -----------------------------------------------------------------------------
 *
 * - **Create the first login**: Authentication → Users → Add user (email + password or provider).
 * - **Grant CMS role**: Firestore → `users/{uid}` where `uid` matches Auth : set `role: "admin"` via
 *   {@link buildFirstAdminUserFirestoreFields} from `./bootstrap-first-admin` (see long comment there).
 * - **Optional**: run `npm run cms:seed:dev` locally with Admin credentials to insert sample categories / authors /
 *   starter settings (dev/staging only).
 *
 * Do **not** commit real user emails or service account JSON.
 * -----------------------------------------------------------------------------
 */

export { SEED_AUTHOR_DOC_IDS, SEED_SAMPLE_AUTHORS } from "./sample-authors";
export { SEED_CATEGORY_DOC_IDS, SEED_SAMPLE_CATEGORIES } from "./sample-categories";
export { SEED_SAMPLE_SITE_SETTINGS, SEED_SETTINGS_DOC_ID } from "./sample-settings";
export {
  buildFirstAdminUserFirestoreFields,
  FIRST_ADMIN_CONSOLE_CHECKLIST,
  type FirstAdminUserInput,
} from "./bootstrap-first-admin";
export { runSeedToFirestore, type RunSeedToFirestoreOptions, type SeedDevReport } from "./run-seed-to-firestore";
