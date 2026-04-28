import { applicationDefault, cert, getApps, initializeApp, type App, type ServiceAccount } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getStorage, type Storage } from "firebase-admin/storage";

/**
 * Firebase **Admin** (server-only) : Route Handlers, Server Actions, cron, imports.
 * Do **not** import this module from Client Components (`"use client"`).
 *
 * -----------------------------------------------------------------------------
 * Firebase Console / GCP checklist
 * -----------------------------------------------------------------------------
 *
 * **Option A : Vercel / local with a service account key (common)**
 * 1) Console → Project settings → **Service accounts** → “Generate new private key”.
 * 2) Store JSON as **one line** in `FIREBASE_SERVICE_ACCOUNT_JSON` (CI: Secret / Env).
 * 3) Set `FIREBASE_PROJECT_ID` to the same project (or rely on `project_id` inside JSON).
 *
 * **Option B : Application Default Credentials (GCP / Firebase App Hosting / Cloud Run)**
 * 1) Omit `FIREBASE_SERVICE_ACCOUNT_JSON`.
 * 2) Set `FIREBASE_PROJECT_ID` (or `GCLOUD_PROJECT` on GCP).
 * 3) Ensure the runtime service account has **Firebase Admin** / datastore access.
 * 4) Locally: `gcloud auth application-default login` with a matching project.
 *
 * **Security**
 * - Never commit service account JSON.
 * - Rotate keys if leaked; prefer workload identity on GCP over long-lived JSON.
 *
 * -----------------------------------------------------------------------------
 */

function readProjectIdFromServiceAccountJson(raw: string): string | undefined {
  try {
    const j = JSON.parse(raw) as { project_id?: string };
    return typeof j.project_id === "string" ? j.project_id : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Returns the default Admin app, or `null` if initialization is not possible
 * (missing env / invalid JSON / ADC not available).
 */
export function getFirebaseAdminApp(): App | null {
  if (getApps().length > 0) {
    return getApps()[0]!;
  }

  const envProjectId =
    process.env.FIREBASE_PROJECT_ID?.trim() ||
    process.env.GCLOUD_PROJECT?.trim() ||
    process.env.GCP_PROJECT?.trim();

  const rawJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();

  try {
    if (rawJson) {
      const credentials = JSON.parse(rawJson) as ServiceAccount & { project_id?: string };
      const projectId =
        envProjectId || credentials.projectId || credentials.project_id || readProjectIdFromServiceAccountJson(rawJson);
      if (!projectId) return null;
      initializeApp({
        credential: cert(credentials),
        projectId,
      });
      return getApps()[0]!;
    }

    if (envProjectId) {
      initializeApp({
        credential: applicationDefault(),
        projectId: envProjectId,
      });
      return getApps()[0]!;
    }

    return null;
  } catch {
    return null;
  }
}

export function getAdminFirestore(): Firestore | null {
  const app = getFirebaseAdminApp();
  if (!app) return null;
  return getFirestore(app);
}

/** Admin Storage (signed URLs, server-side uploads, bucket operations). */
export function getAdminStorage(): Storage | null {
  const app = getFirebaseAdminApp();
  if (!app) return null;
  return getStorage(app);
}

/** True when Admin SDK can be initialized (service account JSON or ADC + project id). */
export function isFirebaseAdminConfigured(): boolean {
  return getFirebaseAdminApp() != null;
}
