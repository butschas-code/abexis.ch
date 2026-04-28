"use client";

import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { recordMediaAsset } from "@/cms/services/media-client";
import { getCmsStorage } from "@/firebase/storage";

function safeFileSegment(name: string) {
  return name.replace(/[^\w.\-]+/g, "_").slice(0, 120);
}

/**
 * Portrait for an author : stored under `cms/media/` (Storage rules allow editors).
 */
export async function uploadAuthorPortrait(authorId: string, file: File): Promise<{ url: string }> {
  const storage = getCmsStorage();
  if (!storage) throw new Error("Firebase Storage ist nicht konfiguriert.");
  const path = `cms/media/profiles/${authorId}/${Date.now()}-${safeFileSegment(file.name)}`;
  const r = ref(storage, path);
  await uploadBytes(r, file, { contentType: file.type || "application/octet-stream" });
  const url = await getDownloadURL(r);
  try {
    await recordMediaAsset({
      storagePath: path,
      downloadUrl: url,
      originalFileName: file.name,
      mimeType: file.type || "application/octet-stream",
      sizeBytes: file.size,
      kind: "general",
      postId: null,
      source: "author",
    });
  } catch {
    /* library metadata optional */
  }
  return { url };
}
