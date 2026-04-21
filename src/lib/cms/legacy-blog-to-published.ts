import type { BlogPost } from "@/data/pages";
import { getAllBlogPosts } from "@/data/pages";
import type { PublishedPostWithId } from "@/public-site/cms/published-post";

function stripHtml(html: string, maxLen: number): string {
  const t = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (t.length <= maxLen) return t;
  return `${t.slice(0, Math.max(0, maxLen - 1))}…`;
}

/** Stable pseudo-id for React keys / related logic (not a Firestore path). */
function legacyRowId(slug: string): string {
  return `legacy__${slug}`;
}

/**
 * Maps scraped legacy JSON (`blog-posts.json`) into the same shape as CMS Firestore rows
 * so public blog index/detail can render when Firestore is empty or unreadable without Admin.
 */
export function legacyBlogPostToPublished(p: BlogPost): PublishedPostWithId {
  const published = p.publishedISO ?? new Date().toISOString();
  const listTitle = (p as BlogPost & { listTitle?: string }).listTitle?.trim() ?? "";
  const excerpt = listTitle || stripHtml(p.bodyHtml ?? "", 320);

  return {
    id: legacyRowId(p.slug),
    title: p.title,
    slug: p.slug,
    excerpt,
    body: p.bodyHtml ?? "",
    heroImageUrl: null,
    heroImageAlt: null,
    heroImagePath: null,
    authorId: "",
    categoryIds: [],
    tags: Array.isArray(p.tags) ? p.tags.map(String) : [],
    site: "abexis",
    status: "published",
    publishedAt: published,
    createdAt: published,
    updatedAt: published,
    seoTitle: null,
    seoDescription: null,
    featured: false,
  };
}

/** Newest-first legacy posts, capped for list pages. */
export function listLegacyPublishedPostsAsCms(limit: number): PublishedPostWithId[] {
  const lim = Math.min(200, Math.max(1, limit));
  const rows = getAllBlogPosts()
    .filter((p) => Boolean(p.publishedISO?.trim()))
    .sort((a, b) => (a.publishedISO! < b.publishedISO! ? 1 : -1));
  return rows.slice(0, lim).map(legacyBlogPostToPublished);
}
