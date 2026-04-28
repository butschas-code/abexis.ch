/**
 * Server-only Firebase exports. Import from Route Handlers / `server-only` modules.
 * Do not import from Client Components.
 *
 * TODO(production-hardening): App Check protects client SDK calls; Admin SDK bypasses rules,keep service
 * account off client bundles, restrict IAM in GCP, and validate sensitive Route Handlers (e.g. uploads).
 */
export {
  getAdminFirestore,
  getAdminStorage,
  getFirebaseAdminApp,
  isFirebaseAdminConfigured,
} from "./admin";
