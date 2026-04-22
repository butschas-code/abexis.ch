import { unstable_cache } from "next/cache";
import { COLLECTIONS } from "@/cms/firestore/collections";
import { getAdminFirestore } from "@/firebase/server";
import type { PublishedPostWithId } from "./published-post";
import { getPublishedCmsPosts } from "./get-published-posts";
import type { PublicCategoryOption } from "./category-public";

const DEFAULT_INSIGHTS_LIMIT = 96;

export type ListInsightsOptions = {
  /** Firestore category document id */
  categoryId?: string | null;
  /** Cap how many published rows to scan (ordered by `publishedAt` desc). */
  fetchLimit?: number;
};

/**
 * Latest published posts for the current deployment, optionally filtered by category (in-memory filter).
 */
export async function listInsightsPublishedPosts(options: ListInsightsOptions = {}): Promise<PublishedPostWithId[]> {
  const limit = Math.min(200, Math.max(12, options.fetchLimit ?? DEFAULT_INSIGHTS_LIMIT));
  const rows = await getPublishedCmsPosts(limit);
  const cat = options.categoryId?.trim();
  if (!cat) return rows;
  const filtered = rows.filter((p) => p.categoryIds.includes(cat));
  if (filtered.length > 0) return filtered;
  /** Legacy imports often have `categoryIds: []`; a stale `?category=` would hide everything. */
  const noneHaveCategories =
    rows.length > 0 && rows.every((p) => !Array.isArray(p.categoryIds) || p.categoryIds.length === 0);
  if (noneHaveCategories) return rows;
  return filtered;
}

/** Featured posts preserve `publishedAt` order from the already-sorted list. */
export function pickFeaturedPosts(posts: PublishedPostWithId[], max = 3): PublishedPostWithId[] {
  return posts.filter((p) => p.featured).slice(0, max);
}

export function partitionFeaturedForGrid(
  posts: PublishedPostWithId[],
  featured: PublishedPostWithId[],
): PublishedPostWithId[] {
  if (featured.length === 0) return posts;
  const ids = new Set(featured.map((p) => p.id));
  return posts.filter((p) => !ids.has(p.id));
}

/** Cached author name lookup — returns plain record for cache serializability. */
const _fetchAuthorNamesCached = unstable_cache(
  async (ids: string[]): Promise<Record<string, string>> => {
    const db = getAdminFirestore();
    if (!db) return {};
    try {
      const snaps = await Promise.all(ids.map((id) => db.collection(COLLECTIONS.authors).doc(id).get()));
      const out: Record<string, string> = {};
      snaps.forEach((snap, i) => {
        const name = snap.exists ? String(snap.data()?.name ?? "") : "";
        if (name) out[ids[i]] = name;
      });
      return out;
    } catch (err) {
      console.error("[cms] Admin Firestore author name lookup failed; returning empty map.", err);
      return {};
    }
  },
  ["author-names"],
  { revalidate: 300, tags: ["authors"] },
);

/** Resolve author display names for post teasers (best-effort). */
export async function getAuthorNameMap(authorIds: string[]): Promise<Map<string, string>> {
  const ids = [...new Set(authorIds.filter((x) => x && x !== "_"))];
  if (ids.length === 0) return new Map();
  const record = await _fetchAuthorNamesCached(ids);
  return new Map(Object.entries(record));
}

export function buildCategoryLabelLookup(categories: PublicCategoryOption[]): Map<string, string> {
  return new Map(categories.map((c) => [c.id, c.name]));
}

export function categoryLabelsForPost(
  categoryIds: string[],
  lookup: Map<string, string>,
): string[] {
  return categoryIds.map((id) => lookup.get(id)).filter(Boolean) as string[];
}
