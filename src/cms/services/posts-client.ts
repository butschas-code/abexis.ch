"use client";

/**
 * Browser-side post helpers for the **admin** UI (Firestore client SDK).
 */
import { collection, getDocs, limit, orderBy, query, where, type QueryConstraint } from "firebase/firestore";
import { COLLECTIONS } from "../firestore/collections";
import { getCmsFirestore } from "@/firebase/firestore";
import { POST_SITE_FIRESTORE_IN } from "@/public-site/site/filters";
import type { CmsPost } from "../types/post";
import type { PostStatus } from "../types/enums";
import type { SiteKey } from "../types/site";

function normalizePostSiteForClient(_raw: unknown): SiteKey {
  return "abexis";
}

export type CmsPostListItem = CmsPost & { id: string };

function readHeroPath(d: Record<string, unknown>): string | null {
  if (d.heroImagePath != null) return String(d.heroImagePath);
  if (d.heroStoragePath != null) return String(d.heroStoragePath);
  return null;
}

export function mapClientDoc(id: string, d: Record<string, unknown>): CmsPostListItem {
  const toIso = (v: unknown) => {
    if (v && typeof (v as { toDate?: () => Date }).toDate === "function") {
      return (v as { toDate: () => Date }).toDate().toISOString();
    }
    if (typeof v === "string") return v;
    return null;
  };
  const statusRaw = d.status;
  const status: PostStatus =
    statusRaw === "published" || statusRaw === "scheduled" || statusRaw === "archived" || statusRaw === "draft" ? statusRaw : "draft";
  return {
    id,
    title: String(d.title ?? ""),
    slug: String(d.slug ?? id),
    excerpt: String(d.excerpt ?? ""),
    body: String(d.body ?? ""),
    heroImageUrl: d.heroImageUrl != null ? String(d.heroImageUrl) : null,
    heroImageAlt: d.heroImageAlt != null ? String(d.heroImageAlt) : null,
    heroImagePath: readHeroPath(d),
    heroImageCredit: d.heroImageCredit != null ? String(d.heroImageCredit) : null,
    heroImagePhotographerName: d.heroImagePhotographerName != null ? String(d.heroImagePhotographerName) : null,
    heroImagePhotographerUrl: d.heroImagePhotographerUrl != null ? String(d.heroImagePhotographerUrl) : null,
    heroImageUnsplashUrl: d.heroImageUnsplashUrl != null ? String(d.heroImageUnsplashUrl) : null,
    authorId: String(d.authorId ?? ""),
    categoryIds: Array.isArray(d.categoryIds) ? d.categoryIds.map(String) : [],
    tags: Array.isArray(d.tags) ? d.tags.map(String) : [],
    site: normalizePostSiteForClient(d.site),
    status,
    seoTitle: d.seoTitle != null ? String(d.seoTitle) : null,
    seoDescription: d.seoDescription != null ? String(d.seoDescription) : null,
    featured: d.featured === true,
    publishedAt: toIso(d.publishedAt),
    createdAt: toIso(d.createdAt) ?? new Date().toISOString(),
    updatedAt: toIso(d.updatedAt) ?? new Date().toISOString(),
  };
}

/** Latest posts for admin table (all statuses). */
export async function listPostsForAdmin(max = 50): Promise<CmsPostListItem[]> {
  const db = getCmsFirestore();
  if (!db) return [];
  const constraints: QueryConstraint[] = [orderBy("updatedAt", "desc"), limit(max)];
  const q = query(collection(db, COLLECTIONS.posts), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((doc) => mapClientDoc(doc.id, doc.data() as Record<string, unknown>));
}

/**
 * Same Firestore query as {@link listPostsForAdmin}; clears large text fields after download
 * so dashboard views do not retain multi‑MB HTML strings in React state.
 */
export async function listRecentPostsForDashboard(max = 6): Promise<CmsPostListItem[]> {
  const rows = await listPostsForAdmin(max);
  return rows.map((r) => ({ ...r, body: "", excerpt: "" }));
}

/** Published posts for the public site (`site` is `abexis` in Firestore). */
export async function listPublishedPostsForCurrentSite(max = 20): Promise<CmsPostListItem[]> {
  const db = getCmsFirestore();
  if (!db) return [];
  const q = query(
    collection(db, COLLECTIONS.posts),
    where("status", "==", "published"),
    where("site", "in", [...POST_SITE_FIRESTORE_IN]),
    orderBy("publishedAt", "desc"),
    limit(max),
  );
  const snap = await getDocs(q);
  return snap.docs.map((doc) => mapClientDoc(doc.id, doc.data() as Record<string, unknown>));
}
