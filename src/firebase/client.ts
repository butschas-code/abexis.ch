"use client";

/**
 * Firebase **client** (Web SDK) : browser only.
 *
 * -----------------------------------------------------------------------------
 * Firebase Console checklist (same project for Auth + Firestore + Storage)
 * -----------------------------------------------------------------------------
 *
 * 1) **Create project** (or use existing): https://console.firebase.google.com
 *
 * 2) **Register a Web app** → Project settings → “Your apps” → Web (`</>`).
 *    Copy the config object fields into `.env.local` as `NEXT_PUBLIC_FIREBASE_*`
 *    (see `.env.example`). Never commit `.env.local`.
 *
 * 3) **Authentication** → Sign-in method → enable **Email/Password** (or add
 *    Google/OIDC later). Authorized domains: add `localhost` and production
 *    hostnames (e.g. `www.abexis.ch`, your Vercel preview domain if needed).
 *
 * 4) **Firestore** → Create database → choose region → deploy rules from repo
 *    (`firestore.rules`). Add composite indexes from `firestore.indexes.json`.
 *
 * 5) **Storage** → Get started → same project. Deploy `storage.rules`.
 *    CORS is usually fine for same-origin uploads; configure if you use another origin.
 *
 * 6) **Emulators (optional, local dev)** : see `.env.example` for
 *    `NEXT_PUBLIC_USE_FIREBASE_EMULATORS` and emulator host vars.
 *
 * -----------------------------------------------------------------------------
 */

import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { connectAuthEmulator, getAuth, type Auth } from "firebase/auth";
import {
  connectFirestoreEmulator,
  getFirestore,
  type Firestore,
} from "firebase/firestore";
import { connectStorageEmulator, getStorage, type FirebaseStorage } from "firebase/storage";
import { parseFirebaseWebEnv } from "./env.schema";

let appSingleton: FirebaseApp | null = null;
let emulatorsConnected = false;

function getOrInitApp(): FirebaseApp | null {
  if (typeof window === "undefined") return null;

  const parsed = parseFirebaseWebEnv();
  if (!parsed.ok) return null;

  if (getApps().length > 0) {
    appSingleton = getApps()[0]!;
    return appSingleton;
  }

  appSingleton = initializeApp(parsed.config);
  maybeConnectEmulators(appSingleton);
  return appSingleton;
}

function maybeConnectEmulators(app: FirebaseApp) {
  if (emulatorsConnected) return;
  if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS !== "true") return;

  const authHost = process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST ?? "127.0.0.1:9099";
  const fsHost = process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST ?? "127.0.0.1:8080";
  const stHost = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_EMULATOR_HOST ?? "127.0.0.1:9199";

  try {
    connectAuthEmulator(getAuth(app), `http://${authHost}`, { disableWarnings: true });
  } catch {
    /* already connected */
  }
  const [fsAddr, fsPort] = fsHost.split(":");
  try {
    connectFirestoreEmulator(getFirestore(app), fsAddr!, Number(fsPort) || 8080);
  } catch {
    /* already connected */
  }
  const [stAddr, stPort] = stHost.split(":");
  try {
    connectStorageEmulator(getStorage(app), stAddr!, Number(stPort) || 9199);
  } catch {
    /* already connected */
  }
  emulatorsConnected = true;
}

/** True when all required `NEXT_PUBLIC_FIREBASE_*` vars are non-empty. */
export function isFirebaseClientConfigured(): boolean {
  return parseFirebaseWebEnv().ok;
}

/** Missing env keys (for dev diagnostics only : do not log in production). */
export function getFirebaseClientConfigMissingKeys(): readonly string[] {
  const r = parseFirebaseWebEnv();
  return r.ok ? [] : r.missing;
}

/** Root Firebase app; `null` on SSR or when env is incomplete. */
export function getFirebaseApp(): FirebaseApp | null {
  return getOrInitApp();
}

export function getFirebaseAuth(): Auth | null {
  const app = getOrInitApp();
  if (!app) return null;
  return getAuth(app);
}

export function getFirebaseFirestore(): Firestore | null {
  const app = getOrInitApp();
  if (!app) return null;
  return getFirestore(app);
}

export function getFirebaseStorage(): FirebaseStorage | null {
  const app = getOrInitApp();
  if (!app) return null;
  return getStorage(app);
}
