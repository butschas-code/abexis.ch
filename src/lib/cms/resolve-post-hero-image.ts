import { getBlogListCoverByIndex } from "@/data/site-images";

/**
 * Deterministic index into `getBlogListCoverByIndex` when no hero URL is set,
 * so listing cards, article heroes, and OG metadata match for the same post.
 */
function stablePoolIndexForPost(post: { id: string; slug: string }): number {
  const s = `${post.id}\0${post.slug}`;
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return h >>> 0;
}

/**
 * Resolves a URL suitable for `next/image` and hero surfaces:
 * - Uses CMS `heroImageUrl` when it looks like an absolute image URL
 * - Upgrades legacy Hoststar `http://` to `https://` (Image + hotlinking)
 * - Otherwise returns a stock blog cover, stable per post
 */
export function resolvePostHeroImageUrl(post: { heroImageUrl: string | null; id: string; slug: string }): string {
  const u = post.heroImageUrl?.trim();
  if (u) {
    if (/^https?:\/\//i.test(u)) {
      if (u.startsWith("http://files.designer.hoststar.ch")) {
        return `https://${u.slice("http://".length)}`;
      }
      return u;
    }
    if (u.startsWith("//") && u.length > 2) {
      return `https:${u}`;
    }
  }
  return getBlogListCoverByIndex(stablePoolIndexForPost(post));
}
