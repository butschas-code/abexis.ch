"use client";

import { collection, doc, getDocs, limit, query, where } from "firebase/firestore";
import { COLLECTIONS } from "@/cms/firestore/collections";
import type { PostUpsertInput } from "@/cms/types/dto";
import { getCmsFirestore } from "@/firebase/firestore";
import { savePost } from "@/cms/services/post-write-client";

/**
 * True if a **published** post with this slug exists (idempotent re-import).
 *
 * Uses `slug` + `status == published` so Firestore security rules that only allow
 * reading published rows still permit the query. A broad `where('slug'==…)` query
 * can return `permission-denied` when drafts exist and the client may not read them.
 */
export async function postPublishedSlugExistsClient(slug: string): Promise<boolean> {
  const db = getCmsFirestore();
  if (!db) throw new Error("Firestore ist nicht konfiguriert.");
  const q = query(
    collection(db, COLLECTIONS.posts),
    where("slug", "==", slug.trim()),
    where("status", "==", "published"),
    limit(1),
  );
  const snap = await getDocs(q);
  return !snap.empty;
}

/**
 * Persists a legacy row using the **same path as the CMS editor** (`savePost`).
 * Avoids client-written `createdAt` timestamps, which many Firestore rules reject
 * (only `serverTimestamp()` is allowed for `createdAt` on create).
 *
 * `publishedAt` on the post still comes from `upsert.publishedAt` (ISO) when set.
 */
export async function writeLegacyImportedPostWeb(upsert: PostUpsertInput): Promise<void> {
  const payload: PostUpsertInput = {
    ...upsert,
    authorId: "_",
    categoryIds: [],
    featured: false,
    site: "abexis",
    status: "published",
  };
  await savePost(payload);
}
