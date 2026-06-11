"use client";

import { addDoc, collection, getDocs, limit, orderBy, query, serverTimestamp } from "firebase/firestore";
import { COLLECTIONS } from "../firestore/collections";
import type { MediaKind } from "../types/media";
import { getCmsFirestore } from "@/firebase/firestore";

export type { MediaKind } from "../types/media";

export type MediaAssetListItem = {
  id: string;
  storagePath: string;
  downloadUrl: string;
  originalFileName: string;
  mimeType: string;
  sizeBytes: number;
  kind: MediaKind;
  source: string | null;
  createdAt: string | null;
};

function toIso(v: unknown): string | null {
  if (v && typeof (v as { toDate?: () => Date }).toDate === "function") {
    return (v as { toDate: () => Date }).toDate().toISOString();
  }
  if (typeof v === "string") return v;
  return null;
}

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

export async function listMediaAssets(max = 80): Promise<MediaAssetListItem[]> {
  const db = getCmsFirestore();
  if (!db) throw new Error("Firestore ist nicht konfiguriert.");
  const snap = await getDocs(query(collection(db, COLLECTIONS.media), orderBy("createdAt", "desc"), limit(max)));
  return snap.docs.map((docSnap) => {
    const d = docSnap.data() as Record<string, unknown>;
    return {
      id: docSnap.id,
      storagePath: String(d.storagePath ?? ""),
      downloadUrl: String(d.downloadUrl ?? ""),
      originalFileName: String(d.originalFileName ?? ""),
      mimeType: String(d.mimeType ?? ""),
      sizeBytes: typeof d.sizeBytes === "number" ? d.sizeBytes : 0,
      kind: (d.kind === "hero" || d.kind === "body" || d.kind === "submission" ? d.kind : "general") as MediaKind,
      source: typeof d.source === "string" ? d.source : null,
      createdAt: toIso(d.createdAt),
    };
  });
}
