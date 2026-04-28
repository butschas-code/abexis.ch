/**
 * Environment variable **schema** (types + validation helpers).
 * Values are never hardcoded here : only keys and shapes.
 *
 * Firebase Console → Project settings:
 * - Web app config → `NEXT_PUBLIC_FIREBASE_*` (safe to expose; still treat as config secrets in CI logs).
 * - Service accounts → JSON key for Vercel/local Admin SDK (`FIREBASE_SERVICE_ACCOUNT_JSON`), or use ADC on GCP.
 */

/** Keys required for the browser SDK (bundled via `NEXT_PUBLIC_*`). */
export const FIREBASE_WEB_PUBLIC_KEYS = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
] as const;

export type FirebaseWebPublicKey = (typeof FIREBASE_WEB_PUBLIC_KEYS)[number];

/** Shape passed to `initializeApp()` (Firebase JS SDK). */
export type FirebaseWebConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  /** Optional : Analytics only; add in Console if you use GA4 + Firebase Analytics. */
  measurementId?: string;
};

export type FirebaseWebEnvParseResult =
  | { ok: true; config: FirebaseWebConfig }
  | { ok: false; missing: readonly string[] };

/**
 * Read Next.js `process.env` without throwing.
 *
 * Important: each `NEXT_PUBLIC_*` value must be read via **direct**
 * `process.env.NEXT_PUBLIC_*` access (optionally merged with an `override` for tests).
 * Next.js only inlines public env into the client bundle for those static references;
 * patterns like `const env = process.env; env.NEXT_PUBLIC_*` compile to `undefined` in the browser.
 */
export function parseFirebaseWebEnv(
  override?: Record<string, string | undefined>,
): FirebaseWebEnvParseResult {
  const apiKey = override?.NEXT_PUBLIC_FIREBASE_API_KEY ?? process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const authDomain =
    override?.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
  const projectId =
    override?.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const storageBucket =
    override?.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  const messagingSenderId =
    override?.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ??
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
  const appId = override?.NEXT_PUBLIC_FIREBASE_APP_ID ?? process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
  const measurementId =
    override?.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;

  const entries: Array<[FirebaseWebPublicKey, string | undefined]> = [
    ["NEXT_PUBLIC_FIREBASE_API_KEY", apiKey],
    ["NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN", authDomain],
    ["NEXT_PUBLIC_FIREBASE_PROJECT_ID", projectId],
    ["NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET", storageBucket],
    ["NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID", messagingSenderId],
    ["NEXT_PUBLIC_FIREBASE_APP_ID", appId],
  ];
  const missing = entries.filter(([, v]) => v == null || String(v).trim() === "").map(([k]) => k);

  if (missing.length > 0) {
    return { ok: false, missing };
  }

  return {
    ok: true,
    config: {
      apiKey: apiKey!,
      authDomain: authDomain!,
      projectId: projectId!,
      storageBucket: storageBucket!,
      messagingSenderId: messagingSenderId!,
      appId: appId!,
      ...(measurementId?.trim() ? { measurementId: measurementId.trim() } : {}),
    },
  };
}

/** Server / CI: Admin SDK credential strategies (no secret values in repo). */
export type FirebaseAdminEnvMode = "service_account_json" | "application_default" | "none";

export function resolveFirebaseAdminMode(env: Record<string, string | undefined> = process.env): FirebaseAdminEnvMode {
  const raw = env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (raw != null && String(raw).trim() !== "") return "service_account_json";
  const pid = env.FIREBASE_PROJECT_ID ?? env.GCLOUD_PROJECT ?? env.GCP_PROJECT;
  if (pid != null && String(pid).trim() !== "") return "application_default";
  return "none";
}

/**
 * Firebase **Web API key** (Identity Toolkit REST, etc.) for **Route Handlers / server only**.
 * Set `FIREBASE_WEB_API_KEY` in Vercel to the same string as `NEXT_PUBLIC_FIREBASE_API_KEY` so server code
 * does not read `NEXT_PUBLIC_*` (quiets security tooling that flags “API key exposed to browser”).
 * Falls back to `NEXT_PUBLIC_FIREBASE_API_KEY` for local dev when only one copy is defined.
 */
export function getFirebaseWebApiKeyForServer(
  env: Record<string, string | undefined> = process.env,
): string | undefined {
  const server = env.FIREBASE_WEB_API_KEY?.trim();
  if (server) return server;
  return env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim();
}
