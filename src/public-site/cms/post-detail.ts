import { COLLECTIONS } from "@/cms/firestore/collections";
import { getPublishedCmsPosts, getPublishedPostBySlug } from "@/public-site/cms/get-published-posts";
import type { PublishedPostWithId } from "@/public-site/cms/published-post";
import { getAdminFirestore } from "@/firebase/server";
import type { PublicCategoryOption } from "./category-public";
import { listPublicCategoriesForDeployment } from "./category-public";

export type PostDetailCategory = { id: string; name: string; slug: string };

export type PublishedPostPageData = {
  post: PublishedPostWithId;
  authorName: string | null;
  categories: PostDetailCategory[];
};

export async function getAuthorDisplayName(authorId: string | null | undefined): Promise<string | null> {
  if (!authorId || authorId === "_") return null;
  const db = getAdminFirestore();
  if (!db) return null;
  try {
    const snap = await db.collection(COLLECTIONS.authors).doc(authorId).get();
    if (!snap.exists) return null;
    const name = snap.data()?.name;
    return typeof name === "string" && name.trim() ? name.trim() : null;
  } catch (err) {
    console.error("[cms] Admin Firestore author lookup failed; returning null.", err);
    return null;
  }
}

/** Categories assigned to the post that also belong to this deployment’s taxonomy list. */
export function resolveCategoriesForPost(
  categoryIds: string[],
  deploymentCategories: PublicCategoryOption[],
): PostDetailCategory[] {
  const byId = new Map(deploymentCategories.map((c) => [c.id, c]));
  const out: PostDetailCategory[] = [];
  for (const id of categoryIds) {
    const c = byId.get(id);
    if (c) out.push({ id: c.id, name: c.name, slug: c.slug });
  }
  return out;
}

/**
 * Published post + author + category labels for the article page.
 * Returns `null` if slug is missing, unpublished, or not visible for this site.
 */
export async function loadPublishedPostPageData(slug: string): Promise<PublishedPostPageData | null> {
  let post: PublishedPostWithId | null = null;
  try {
    post = await getPublishedPostBySlug(slug);
  } catch (err) {
    console.error("[cms] loadPublishedPostPageData: getPublishedPostBySlug threw.", err);
    return null;
  }
  if (!post) return null;

  /** Best-effort enrichment; detail must render even when author/category lookups fail. */
  const [deploymentCategories, authorName] = await Promise.all([
    listPublicCategoriesForDeployment().catch((err) => {
      console.error("[cms] loadPublishedPostPageData: category list failed.", err);
      return [] as PublicCategoryOption[];
    }),
    getAuthorDisplayName(post.authorId).catch((err) => {
      console.error("[cms] loadPublishedPostPageData: author lookup failed.", err);
      return null as string | null;
    }),
  ]);

  const categories = resolveCategoriesForPost(post.categoryIds, deploymentCategories);

  return {
    post,
    authorName,
    categories,
  };
}

/**
 * Related posts: prefer shared categories, then newest. Same site visibility as `getPublishedCmsPosts` pool.
 */
export function selectRelatedPublishedPosts(
  current: PublishedPostWithId,
  pool: PublishedPostWithId[],
  limit = 3,
): PublishedPostWithId[] {
  const others = pool.filter((p) => p.id !== current.id);
  const shared = new Set(current.categoryIds);
  const scored = others.map((p) => {
    let score = 0;
    for (const c of p.categoryIds) {
      if (shared.has(c)) score += 2;
    }
    const t = p.publishedAt ? Date.parse(p.publishedAt) : 0;
    return { p, score, t };
  });
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.t - a.t;
  });
  return scored.slice(0, limit).map((s) => s.p);
}

export async function loadRelatedPublishedPosts(
  current: PublishedPostWithId,
  max = 3,
): Promise<PublishedPostWithId[]> {
  try {
    const pool = await getPublishedCmsPosts(80);
    return selectRelatedPublishedPosts(current, pool, max);
  } catch (err) {
    console.error("[cms] loadRelatedPublishedPosts failed; returning empty.", err);
    return [];
  }
}
