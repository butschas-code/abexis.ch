"use client";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { COLLECTIONS } from "../firestore/collections";
import type { MediaKind } from "../types/media";
import { getCmsFirestore } from "@/firebase/firestore";

export type { MediaKind } from "../types/media";

/**
 * Registers a `media` Firestore document (metadata only).
 * Used by legacy flows such as author portrait uploads; the admin Medien page no longer lists or uploads here.
 */
export type RecordMediaAssetInput = {
  storagePath: string;
  downloadUrl: string;
  originalFileName: string;
  mimeType: string;
  sizeBytes: number;
  kind: MediaKind;
  postId?: string | null;
  /** e.g. executive_search, contact : for form/brief pipelines */
  source?: string | null;
};

export async function recordMediaAsset(input: RecordMediaAssetInput): Promise<string> {
  const db = getCmsFirestore();
  if (!db) throw new Error("Firestore ist nicht konfiguriert.");
  const refDoc = await addDoc(collection(db, COLLECTIONS.media), {
    storagePath: input.storagePath,
    downloadUrl: input.downloadUrl,
    originalFileName: input.originalFileName,
    mimeType: input.mimeType,
    sizeBytes: input.sizeBytes,
    kind: input.kind,
    postId: input.postId ?? null,
    source: input.source ?? null,
    createdAt: serverTimestamp(),
  });
  return refDoc.id;
}
