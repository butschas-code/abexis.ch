"use client";

import {
  Timestamp,
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { parsePostUpsert } from "@/cms/schema";
import { normalizePostBodyForPersistence } from "@/lib/cms/post-body-storage";
import { COLLECTIONS } from "../firestore/collections";
import type { PostUpsertInput } from "../types/dto";
import { getCmsFirestore } from "@/firebase/firestore";
import type { CmsPostListItem } from "./posts-client";
import { mapClientDoc } from "./posts-client";

/** @deprecated Use `PostUpsertInput` from `@/cms/types/dto`. */
export type PostSaveInput = PostUpsertInput;

/** Allocate a Firestore document id before first save. */
export function newPostId(): string {
  const db = getCmsFirestore();
  if (!db) throw new Error("Firebase ist nicht konfiguriert.");
  return doc(collection(db, COLLECTIONS.posts)).id;
}

export async function getPostForAdmin(id: string): Promise<CmsPostListItem | null> {
  const db = getCmsFirestore();
  if (!db) return null;
  const ref = doc(db, COLLECTIONS.posts, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return mapClientDoc(snap.id, snap.data() as Record<string, unknown>);
}

export async function savePost(input: PostUpsertInput): Promise<void> {
  const db = getCmsFirestore();
  if (!db) throw new Error("Firebase ist nicht konfiguriert.");

  const ref = doc(db, COLLECTIONS.posts, input.id);
  const existing = await getDoc(ref);
  const prev = existing.exists() ? (existing.data() as Record<string, unknown>) : undefined;

  const payload: Record<string, unknown> = {
    title: input.title.trim(),
    slug: input.slug.trim(),
    status: input.status,
    site: input.site,
    authorId: input.authorId,
    categoryIds: input.categoryIds,
    tags: input.tags,
    featured: input.featured,
    heroImageUrl: input.heroImageUrl,
    heroImageAlt: input.heroImageAlt,
    heroImagePath: input.heroImagePath,
    heroImageCredit: input.heroImageCredit,
    heroImagePhotographerName: input.heroImagePhotographerName,
    heroImagePhotographerUrl: input.heroImagePhotographerUrl,
    heroImageUnsplashUrl: input.heroImageUnsplashUrl,
    body: input.body,
    excerpt: input.excerpt,
    seoTitle: input.seoTitle,
    seoDescription: input.seoDescription,
    updatedAt: serverTimestamp(),
    heroStoragePath: deleteField(),
  };

  if (!existing.exists()) {
    payload.createdAt = serverTimestamp();
  }

  if (input.status === "published" || input.status === "scheduled") {
    if (typeof input.publishedAt === "string" && input.publishedAt.length > 0) {
      const d = new Date(input.publishedAt);
      if (Number.isFinite(d.getTime())) {
        payload.publishedAt = Timestamp.fromDate(d);
      }
    } else if (input.status === "published" && prev?.publishedAt == null) {
      payload.publishedAt = serverTimestamp();
    }
  } else if (input.status === "draft") {
    payload.publishedAt = deleteField();
  }

  await setDoc(ref, payload, { merge: true });
}

export function cmsPostListItemToUpsert(p: CmsPostListItem): PostUpsertInput {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    body: p.body,
    heroImageUrl: p.heroImageUrl,
    heroImageAlt: p.heroImageAlt ?? null,
    heroImagePath: p.heroImagePath,
    heroImageCredit: p.heroImageCredit ?? null,
    heroImagePhotographerName: p.heroImagePhotographerName ?? null,
    heroImagePhotographerUrl: p.heroImagePhotographerUrl ?? null,
    heroImageUnsplashUrl: p.heroImageUnsplashUrl ?? null,
    authorId: p.authorId.trim() || "_",
    categoryIds: p.categoryIds,
    tags: p.tags,
    site: p.site,
    status: p.status,
    seoTitle: p.seoTitle,
    seoDescription: p.seoDescription,
    featured: p.featured,
    publishedAt: p.publishedAt ?? undefined,
  };
}

export async function deletePost(id: string): Promise<void> {
  const db = getCmsFirestore();
  if (!db) throw new Error("Firebase ist nicht konfiguriert.");
  await deleteDoc(doc(db, COLLECTIONS.posts, id));
}

/** Creates a new draft post copying content from `sourceId`. Returns the new document id. */
export async function duplicatePost(sourceId: string): Promise<string> {
  const src = await getPostForAdmin(sourceId);
  if (!src) throw new Error("Beitrag nicht gefunden.");

  const id = newPostId();
  const slugTail = id.replace(/[^a-zA-Z0-9]+/g, "").slice(0, 10) || "x";
  const suffix = `-kopie-${slugTail}`;
  const baseMax = Math.max(1, 200 - suffix.length);
  const baseSlug = (src.slug.trim().slice(0, baseMax) || "beitrag").toLowerCase();
  const nextSlug = `${baseSlug}${suffix}`;

  const raw: PostUpsertInput = {
    ...cmsPostListItemToUpsert(src),
    id,
    title: `${src.title.trim()} (Kopie)`.slice(0, 500),
    slug: nextSlug,
    status: "draft",
    body: normalizePostBodyForPersistence(src.body),
    heroImagePath: null,
  };

  const parsed = parsePostUpsert(raw);
  if (!parsed.success) {
    const msg = parsed.error.issues.map((i) => i.message).join(" · ");
    throw new Error(msg || "Kopie konnte nicht vorbereitet werden.");
  }

  await savePost(parsed.data);
  return id;
}
