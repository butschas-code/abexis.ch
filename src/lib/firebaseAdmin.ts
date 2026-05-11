import "server-only";

/**
 * Server-only Firebase Admin → Firestore.
 * Do not import from Client Components or shared modules used by the browser bundle.
 *
 * Credentials: `FIREBASE_SERVICE_ACCOUNT_JSON` only (full service account JSON, one line on Vercel).
 * Discrete vars `FIREBASE_PROJECT_ID` / `FIREBASE_CLIENT_EMAIL` / `FIREBASE_PRIVATE_KEY` are not used here.
 */

import { cert, getApps, initializeApp, type App, type ServiceAccount } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

function resolveAdminApp(): App {
  const existingApps = getApps();
  if (existingApps.length > 0) {
    return existingApps[0]!;
  }

  const rawJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (!rawJson) {
    throw new Error("[firebaseAdmin] Missing FIREBASE_SERVICE_ACCOUNT_JSON.");
  }

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(rawJson) as Record<string, unknown>;
  } catch {
    throw new Error("[firebaseAdmin] FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON.");
  }

  if (typeof parsed.private_key === "string") {
    parsed.private_key = parsed.private_key.replace(/\\n/g, "\n");
  }

  const projectId =
    (typeof parsed.project_id === "string" ? parsed.project_id : undefined) ??
    (typeof parsed.projectId === "string" ? parsed.projectId : undefined);

  if (!projectId) {
    throw new Error("[firebaseAdmin] Service account JSON must include project_id.");
  }

  return initializeApp({
    credential: cert(parsed as ServiceAccount),
    projectId,
  });
}

/** Singleton Firestore for the default Firebase Admin app (initialized once per runtime). */
export const adminDb: Firestore = getFirestore(resolveAdminApp());
