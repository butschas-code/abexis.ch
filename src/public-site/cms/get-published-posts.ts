import type { Firestore } from "firebase-admin/firestore";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { COLLECTIONS } from "@/cms/firestore/collections";
import { getBlogPostBySlug } from "@/data/pages";
import { getAdminFirestore } from "@/firebase/server";
import { legacyBlogPostToPublished, listLegacyPublishedPostsAsCms } from "@/lib/cms/legacy-blog-to-published";
import { mapPostDoc } from "@/lib/cms/map-post";
import type { PublishedPostWithId } from "@/public-site/cms/published-post";
import {
  getPublishedPostBySlugViaWebSdkForDeployment,
  listPublishedPostsViaWebSdkForDeployment,
} from "@/public-site/cms/published-posts-web-sdk";
import type { PublicDeploymentSite } from "@/public-site/site";
import { getResolvedPublicDeploymentSite, visiblePostSitesInClause } from "@/public-site/site";

export type { PublishedPostWithId } from "@/public-site/cms/published-post";

/** Cross-request cache for Firestore-backed lists (seconds). */
const CMS_POST_LIST_REVALIDATE = 120;

/** Cross-request cache for single-slug resolution (seconds). */
const CMS_POST_BY_SLUG_REVALIDATE = 120;

/** Decode URL segment and trim — safe for already-decoded slugs. */
export function normalizeBlogSlugParam(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  try {
    return decodeURIComponent(trimmed);
  } catch {
    return trimmed;
  }
}

/** Low-level query when you already hold an Admin Firestore instance (e.g. Route Handlers). */
export async function listPublishedPostsFromDb(
  db: Firestore,
  deployment: PublicDeploymentSite,
  limit = 20,
): Promise<PublishedPostWithId[]> {
  const sites = visiblePostSitesInClause(deployment);
  const lim = Math.min(200, Math.max(1, limit));
  const snap = await db
    .collection(COLLECTIONS.posts)
    .where("status", "==", "published")
    .where("site", "in", sites)
    .orderBy("publishedAt", "desc")
    .limit(lim)
    .get();

  return snap.docs
    .map((doc) => {
      const post = mapPostDoc(doc.id, doc);
      return post ? { id: doc.id, ...post } : null;
    })
    .filter((p): p is PublishedPostWithId => p != null && p.status === "published");
}

async function getPublishedCmsPostsUncached(
  deployment: PublicDeploymentSite,
  limit: number,
): Promise<PublishedPostWithId[]> {
  let rows: PublishedPostWithId[] = [];
  const db = getAdminFirestore();
  const lim = Math.min(200, Math.max(1, limit));
  if (db) {
    try {
      rows = await listPublishedPostsFromDb(db, deployment, lim);
    } catch (err) {
      console.error("[cms] Admin Firestore post list failed; falling back to Web SDK.", err);
      rows = await listPublishedPostsViaWebSdkForDeployment(deployment, lim);
    }
  } else {
    rows = await listPublishedPostsViaWebSdkForDeployment(deployment, lim);
  }
  if (rows.length === 0 && deployment === "abexis") {
    rows = listLegacyPublishedPostsAsCms(lim);
  }
  return rows;
}

const getPublishedCmsPostsCached = unstable_cache(
  async (deployment: PublicDeploymentSite, limit: number) => getPublishedCmsPostsUncached(deployment, limit),
  ["published-cms-posts"],
  { revalidate: CMS_POST_LIST_REVALIDATE, tags: ["published-posts"] },
);

async function getPublishedCmsPostsImpl(limit = 20): Promise<PublishedPostWithId[]> {
  const deployment = await getResolvedPublicDeploymentSite();
  const lim = Math.min(200, Math.max(1, limit));
  return getPublishedCmsPostsCached(deployment, lim);
}
/**
 * Published posts for the public blog. Prefers **Admin SDK** (bypasses rules, works for locked-down rules).
 * Falls back to the **Firebase Web SDK** when Admin env is missing so local dev with only
 * `NEXT_PUBLIC_FIREBASE_*` still lists posts (see `firestore.rules` — anonymous read of published posts).
 *
 * Results are **cached for ~2 minutes** (`unstable_cache`) keyed by deployment + limit so home, blog index,
 * and related-posts scans do not each cold-hit Firestore on every navigation.
 */
export const getPublishedCmsPosts = cache(getPublishedCmsPostsImpl);

async function fetchPublishedPostBySlugForDeployment(
  deployment: PublicDeploymentSite,
  normalized: string,
): Promise<PublishedPostWithId | null> {
  const db = getAdminFirestore();

  if (db) {
    try {
      const allowed = new Set(visiblePostSitesInClause(deployment));
      const snap = await db.collection(COLLECTIONS.posts).where("slug", "==", normalized).limit(40).get();
      for (const doc of snap.docs) {
        const post = mapPostDoc(doc.id, doc);
        if (!post || post.status !== "published") continue;
        if (!allowed.has(post.site)) continue;
        return { id: doc.id, ...post };
      }
    } catch (err) {
      console.error("[cms] Admin Firestore post by slug failed; falling back to Web SDK.", err);
    }
  }

  const viaWeb = await getPublishedPostBySlugViaWebSdkForDeployment(deployment, normalized);
  if (viaWeb) return viaWeb;

  if (deployment === "abexis") {
    const legacy = getBlogPostBySlug(normalized);
    if (legacy) return legacyBlogPostToPublished(legacy);
  }
  return null;
}

const getPublishedPostBySlugCached = unstable_cache(
  async (deployment: PublicDeploymentSite, normalized: string) =>
    fetchPublishedPostBySlugForDeployment(deployment, normalized),
  ["published-post-by-slug"],
  { revalidate: CMS_POST_BY_SLUG_REVALIDATE, tags: ["published-posts"] },
);

async function getPublishedPostBySlugImpl(slug: string): Promise<PublishedPostWithId | null> {
  const normalized = normalizeBlogSlugParam(slug);
  if (!normalized) return null;
  const deployment = await getResolvedPublicDeploymentSite();
  return getPublishedPostBySlugCached(deployment, normalized);
}

/**
 * Single published post visible on this deployment (abexis/search + `both`), by public slug.
 * Wrapped in `cache()` so `generateMetadata` + article body share one in-flight fetch per request,
 * and `unstable_cache` so repeat traffic is served from the data cache for a short TTL.
 */
export const getPublishedPostBySlug = cache(getPublishedPostBySlugImpl);
