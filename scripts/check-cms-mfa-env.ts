/**
 * Loads `.env.local` into process.env (minimal KEY=value parser) and verifies
 * Firebase Admin + CMS MFA env for local dev. Run: `npm run cms:check-mfa-env`
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { getFirebaseAdminApp } from "../src/firebase/admin";

function loadEnvLocal() {
  const p = join(process.cwd(), ".env.local");
  if (!existsSync(p)) return;
  const raw = readFileSync(p, "utf8");
  for (const line of raw.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i <= 0) continue;
    const k = t.slice(0, i).trim();
    let v = t.slice(i + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    if (process.env[k] === undefined) process.env[k] = v;
  }
}

function main() {
  loadEnvLocal();

  const secret = process.env.CMS_MFA_COOKIE_SECRET?.trim() ?? "";
  const mfaSecretOk = secret.length >= 16;

  const adminApp = getFirebaseAdminApp();
  const adminOk = adminApp !== null;

  console.log("[cms-mfa-env]");
  console.log(`  CMS_MFA_COOKIE_SECRET: ${mfaSecretOk ? "OK (>=16 chars)" : "MISSING or too short — add to .env.local and Vercel"}`);
  console.log(`  Firebase Admin SDK init: ${adminOk ? "OK" : "FAIL — check FIREBASE_* / service account in .env.local"}`);

  const rulesPath = join(process.cwd(), "firestore.rules");
  let rulesOk = false;
  if (existsSync(rulesPath)) {
    const rules = readFileSync(rulesPath, "utf8");
    rulesOk =
      rules.includes("match /cms_totp/{uid}") &&
      rules.includes("allow read, write: if false") &&
      rules.includes("cms_totp_pending");
  }
  console.log(`  firestore.rules (local): ${rulesOk ? "OK (cms_totp* denied to clients)" : "unexpected — check firestore.rules"}`);

  console.log("");
  console.log("Editor rollout (manual): each CMS user visits /admin/mfa-setup once after email verification.");

  if (!mfaSecretOk || !adminOk) {
    process.exitCode = 1;
  }
}

main();
