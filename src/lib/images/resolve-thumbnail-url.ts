import manifest from "@/data/blog-thumbnails-manifest.json";
import { resolvePublicImageUrl } from "./resolve-public-image-url";

const THUMBNAIL_UUID_SET = new Set((manifest as string[]).map((id) => id.toLowerCase()));

const UUID_RE =
  /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i;

/**
 * Optimizes an image URL for thumbnail/card use (cards, grids, teasers):
 * 1. For migrated or Hoststar assets with a prebuilt WebP thumbnail, uses `/images/thumbs/blog/<uuid>.webp`.
 * 2. For Unsplash images, appends or updates dynamic CDN query parameters (`w=600&q=80&auto=format`).
 * 3. Preserves local `/images/thumbs/...` paths.
 * 4. Falls back to `resolvePublicImageUrl(src)`.
 */
export function resolveThumbnailUrl(src: string): string {
  const trimmed = src.trim();
  if (!trimmed) return trimmed;

  if (trimmed.startsWith("/images/thumbs/")) {
    return trimmed;
  }

  // Optimize Unsplash images dynamically via their CDN query parameters
  if (trimmed.includes("images.unsplash.com")) {
    try {
      const u = new URL(trimmed);
      u.searchParams.set("w", "600");
      u.searchParams.set("q", "80");
      u.searchParams.set("auto", "format");
      u.searchParams.set("fit", "crop");
      return u.toString();
    } catch {
      return trimmed;
    }
  }

  // Check if URL has a Hoststar / migrated UUID with a prebuilt thumbnail
  const match = trimmed.match(UUID_RE);
  if (match) {
    const uuid = match[1].toLowerCase();
    if (THUMBNAIL_UUID_SET.has(uuid)) {
      return `/images/thumbs/blog/${uuid}.webp`;
    }
  }

  return resolvePublicImageUrl(trimmed);
}

