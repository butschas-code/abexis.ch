#!/usr/bin/env npx tsx
/**
 * Sets Firestore `users/{uid}.role` to `admin` for an existing Firebase Auth user.
 *
 * Prerequisite: the person must already exist in Firebase Authentication (same email).
 *
 * Usage:
 *   pnpm exec tsx scripts/cms-grant-admin.ts user@example.com
 *
 * Env: same as other CMS scripts — `FIREBASE_PROJECT_ID` + `FIREBASE_SERVICE_ACCOUNT_JSON` in `.env.local`, or ADC.
 */

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

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

loadEnvLocalFiles();

import { FieldValue } from "firebase-admin/firestore";
import { COLLECTIONS } from "@/cms/firestore/collections";
import { USER_DOCUMENT_FIELDS } from "@/cms/firestore/schema";
import { getAdminAuth, getAdminFirestore } from "@/firebase/server";

async function main() {
  const raw = process.argv[2]?.trim();
  if (!raw) {
    console.error("Usage: pnpm exec tsx scripts/cms-grant-admin.ts <email>");
    process.exit(1);
  }
  const email = raw.toLowerCase();

  const auth = getAdminAuth();
  const db = getAdminFirestore();
  if (!auth || !db) {
    console.error(
      "Firebase Admin not configured. Set FIREBASE_PROJECT_ID and FIREBASE_SERVICE_ACCOUNT_JSON in .env.local (see src/firebase/admin.ts).",
    );
    process.exit(1);
  }

  let user;
  try {
    user = await auth.getUserByEmail(email);
  } catch {
    console.error(`No Firebase Auth user found for: ${email}`);
    console.error("Create the user in Firebase Console → Authentication first, then re-run this script.");
    process.exit(1);
  }

  const ref = db.collection(COLLECTIONS.users).doc(user.uid);
  const snap = await ref.get();
  const now = FieldValue.serverTimestamp();
  const displayName =
    user.displayName?.trim() ||
    (typeof snap.data()?.displayName === "string" ? String(snap.data()?.displayName).trim() : "") ||
    email.split("@")[0] ||
    "User";

  if (snap.exists) {
    await ref.update({
      [USER_DOCUMENT_FIELDS.uid]: user.uid,
      [USER_DOCUMENT_FIELDS.email]: user.email ?? email,
      [USER_DOCUMENT_FIELDS.role]: "admin",
      [USER_DOCUMENT_FIELDS.displayName]: displayName,
      [USER_DOCUMENT_FIELDS.updatedAt]: now,
    });
    console.log(`Updated users/${user.uid}: role=admin (${email})`);
  } else {
    await ref.set({
      [USER_DOCUMENT_FIELDS.uid]: user.uid,
      [USER_DOCUMENT_FIELDS.email]: user.email ?? email,
      [USER_DOCUMENT_FIELDS.displayName]: displayName,
      [USER_DOCUMENT_FIELDS.role]: "admin",
      [USER_DOCUMENT_FIELDS.createdAt]: now,
      [USER_DOCUMENT_FIELDS.updatedAt]: now,
    });
    console.log(`Created users/${user.uid}: role=admin (${email})`);
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
