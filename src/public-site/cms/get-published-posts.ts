import { unstable_cache } from "next/cache";
import type { Firestore } from "firebase-admin/firestore";
import { COLLECTIONS } from "@/cms/firestore/collections";
import { getBlogPostBySlug } from "@/data/pages";
import { getAdminFirestore } from "@/firebase/server";
import { legacyBlogPostToPublished, listLegacyPublishedPostsAsCms } from "@/lib/cms/legacy-blog-to-published";
import { mapPostDoc } from "@/lib/cms/map-post";
import type { PublishedPostWithId } from "@/public-site/cms/published-post";
import {
  getPublishedPostBySlugViaWebSdk,
  listPublishedPostsViaWebSdk,
} from "@/public-site/cms/published-posts-web-sdk";
import type { PublicDeploymentSite } from "@/public-site/site";
import { getResolvedPublicDeploymentSite, visiblePostSitesInClause } from "@/public-site/site";

export type { PublishedPostWithId } from "@/public-site/cms/published-post";

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
export async function listPublishedPostsFromDb(db: Firestore, limit = 20, site?: PublicDeploymentSite): Promise<PublishedPostWithId[]> {
  const deployment = site ?? await getResolvedPublicDeploymentSite();
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

/** Cached post list — `deployment` passed as arg so no `headers()` runs inside the cache callback. */
const _listPostsCached = unstable_cache(
  async (deployment: PublicDeploymentSite, limit: number): Promise<PublishedPostWithId[]> => {
    let rows: PublishedPostWithId[] = [];
    const db = getAdminFirestore();
    if (db) {
      try {
        rows = await listPublishedPostsFromDb(db, limit, deployment);
      } catch (err) {
        console.error("[cms] Admin Firestore post list failed; falling back to Web SDK.", err);
        rows = await listPublishedPostsViaWebSdk(limit, deployment);
      }
    } else {
      rows = await listPublishedPostsViaWebSdk(limit, deployment);
    }
    if (rows.length === 0 && deployment === "abexis") {
      rows = listLegacyPublishedPostsAsCms(limit);
    }
    return rows;
  },
  ["published-posts"],
  { revalidate: 300, tags: ["published-posts"] },
);

/**
 * Published posts for the public blog. Prefers **Admin SDK** (bypasses rules, works for locked-down rules).
 * Falls back to the **Firebase Web SDK** when Admin env is missing so local dev with only
 * `NEXT_PUBLIC_FIREBASE_*` still lists posts (see `firestore.rules` — anonymous read of published posts).
 *
 * Cached for 5 minutes via `unstable_cache`. Invalidate with `revalidateTag('published-posts')`.
 */
export async function getPublishedCmsPosts(limit = 20): Promise<PublishedPostWithId[]> {
  const deployment = await getResolvedPublicDeploymentSite();
  return _listPostsCached(deployment, limit);
}

/** Cached single-post lookup — `deployment` passed as arg so no `headers()` runs inside the cache callback. */
const _getPostBySlugCached = unstable_cache(
  async (deployment: PublicDeploymentSite, slug: string): Promise<PublishedPostWithId | null> => {
    const db = getAdminFirestore();
    if (db) {
      try {
        const allowed = new Set(visiblePostSitesInClause(deployment));
        const snap = await db.collection(COLLECTIONS.posts).where("slug", "==", slug).limit(40).get();
        for (const doc of snap.docs) {
          const post = mapPostDoc(doc.id, doc);
          if (!post || post.status !== "published") continue;
          if (!allowed.has(post.site)) continue;
          return { id: doc.id, ...post };
        }
      } catch (err) {
        console.error("[cms] Admin Firestore post by slug failed; falling back to Web SDK.", err);
        const viaWeb = await getPublishedPostBySlugViaWebSdk(slug, deployment);
        if (viaWeb) return viaWeb;
      }
    } else {
      const viaWeb = await getPublishedPostBySlugViaWebSdk(slug, deployment);
      if (viaWeb) return viaWeb;
    }

    if (deployment === "abexis") {
      const legacy = getBlogPostBySlug(slug);
      if (legacy) return legacyBlogPostToPublished(legacy);
    }
    return null;
  },
  ["post-by-slug"],
  { revalidate: 300, tags: ["published-posts"] },
);

/**
 * Single published post visible on this deployment (abexis/search + `both`), by public slug.
 * Cached for 5 minutes via `unstable_cache`. Invalidate with `revalidateTag('published-posts')`.
 */
export async function getPublishedPostBySlug(slug: string): Promise<PublishedPostWithId | null> {
  const normalized = normalizeBlogSlugParam(slug);
  if (!normalized) return null;
  const deployment = await getResolvedPublicDeploymentSite();
  return _getPostBySlugCached(deployment, normalized);
}
