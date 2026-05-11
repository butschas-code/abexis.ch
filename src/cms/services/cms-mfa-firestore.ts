import { FieldValue } from "firebase-admin/firestore";

import { CMS_TOTP_COLLECTION, CMS_TOTP_PENDING_COLLECTION } from "@/cms/auth/cms-mfa-constants";
import { getAdminFirestore } from "@/firebase/admin";

export async function cmsTotpEnrollmentExists(uid: string): Promise<boolean> {
  const db = getAdminFirestore();
  if (!db) return false;
  const snap = await db.collection(CMS_TOTP_COLLECTION).doc(uid).get();
  return snap.exists;
}

export async function getCmsTotpSecret(uid: string): Promise<string | null> {
  const db = getAdminFirestore();
  if (!db) return null;
  const snap = await db.collection(CMS_TOTP_COLLECTION).doc(uid).get();
  if (!snap.exists) return null;
  const secretBase32 = snap.data()?.secretBase32;
  return typeof secretBase32 === "string" ? secretBase32 : null;
}

export async function getCmsTotpPendingSecret(uid: string): Promise<string | null> {
  const db = getAdminFirestore();
  if (!db) return null;
  const snap = await db.collection(CMS_TOTP_PENDING_COLLECTION).doc(uid).get();
  if (!snap.exists) return null;
  const secretBase32 = snap.data()?.secretBase32;
  return typeof secretBase32 === "string" ? secretBase32 : null;
}

export async function setCmsTotpPending(uid: string, secretBase32: string): Promise<boolean> {
  const db = getAdminFirestore();
  if (!db) return false;
  await db.collection(CMS_TOTP_PENDING_COLLECTION).doc(uid).set({
    secretBase32,
    createdAt: FieldValue.serverTimestamp(),
  });
  return true;
}

/** Moves pending secret into enrolled doc and deletes pending (single batch). */
export async function commitCmsTotpEnrollment(uid: string, secretBase32: string): Promise<boolean> {
  const db = getAdminFirestore();
  if (!db) return false;
  const batch = db.batch();
  batch.set(db.collection(CMS_TOTP_COLLECTION).doc(uid), {
    secretBase32,
    enrolledAt: FieldValue.serverTimestamp(),
  });
  batch.delete(db.collection(CMS_TOTP_PENDING_COLLECTION).doc(uid));
  await batch.commit();
  return true;
}

/** Removes pending enrollment (e.g. user aborted); optional cleanup. */
export async function deleteCmsTotpPending(uid: string): Promise<void> {
  const db = getAdminFirestore();
  if (!db) return;
  await db.collection(CMS_TOTP_PENDING_COLLECTION).doc(uid).delete().catch(() => undefined);
}
