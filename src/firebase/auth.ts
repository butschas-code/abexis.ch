"use client";

/**
 * Auth helpers (browser). Initialization stays in `./client`.
 *
 * Console: Authentication → Sign-in method → enable providers;
 * Authentication → Settings → Authorized domains.
 */

import { onAuthStateChanged, type Auth, type User, type Unsubscribe } from "firebase/auth";
import { getFirebaseAuth, isFirebaseClientConfigured } from "./client";

/** Resolved Auth instance or `null` if the Web SDK is not configured / not in browser. */
export function getCmsAuth(): Auth | null {
  return getFirebaseAuth();
}

export function isCmsAuthAvailable(): boolean {
  return isFirebaseClientConfigured() && getFirebaseAuth() != null;
}

/** Subscribe to auth state; no-ops with `user=null` if Auth is unavailable. */
export function subscribeCmsAuth(callback: (user: User | null) => void): Unsubscribe {
  const auth = getFirebaseAuth();
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

/**
 * Returns a fresh ID token so server verification sees up-to-date claims
 * (notably `email_verified` right after the confirmation link).
 */
export async function getCmsAuthIdTokenFresh(user: User): Promise<string> {
  return user.getIdToken(true);
}
