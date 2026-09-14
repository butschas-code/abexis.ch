import "server-only";

import { Timestamp } from "firebase-admin/firestore";

import { COLLECTIONS } from "@/cms/firestore/collections";
import { adminDb } from "@/lib/firebaseAdmin";

/** Minimum pause between completed Nuelink API calls (serializes cross-request bursts). */
export const NUELINK_MIN_GAP_MS = 3_000;

const GUARD_DOC_ID = "nuelink-send-guard";
const LOCK_LEASE_MS = 45_000;
const MAX_LOCK_WAIT_MS = 120_000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Ensures only one Nuelink handoff runs at a time across serverless instances,
 * with at least {@link NUELINK_MIN_GAP_MS} between the end of one call and the start of the next.
 */
export async function withNuelinkSendLock<T>(fn: () => Promise<T>): Promise<T> {
  const ref = adminDb.collection(COLLECTIONS.settings).doc(GUARD_DOC_ID);
  const deadline = Date.now() + MAX_LOCK_WAIT_MS;

  while (Date.now() < deadline) {
    const waitMs = await adminDb.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      const data = snap.data() ?? {};
      const lockUntilMs = typeof data.lockUntilMs === "number" ? data.lockUntilMs : 0;
      const now = Date.now();

      if (now < lockUntilMs) {
        return lockUntilMs - now;
      }

      tx.set(
        ref,
        {
          lockUntilMs: now + LOCK_LEASE_MS,
          updatedAt: Timestamp.now(),
        },
        { merge: true },
      );
      return 0;
    });

    if (waitMs === 0) break;
    await sleep(Math.min(waitMs + 50, 15_000));
  }

  if (Date.now() >= deadline) {
    throw new Error("Nuelink: Zeitfenster für API-Aufruf nicht erhalten. Bitte in ein paar Sekunden erneut versuchen.");
  }

  try {
    return await fn();
  } finally {
    await ref.set(
      {
        lockUntilMs: Date.now() + NUELINK_MIN_GAP_MS,
        lastCompletedAtMs: Date.now(),
        updatedAt: Timestamp.now(),
      },
      { merge: true },
    );
  }
}
