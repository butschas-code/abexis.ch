import type { PostStatus } from "./enums";
import type { SiteKey } from "./site";

export type { PostStatus } from "./enums";

/**
 * `posts/{postId}` : Firestore uses **Timestamp** for dates; client/API map to ISO strings.
 * Legacy `heroStoragePath` is still read in mappers; new writes use `heroImagePath`.
 */
export type Post = {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  heroImageUrl: string | null;
  /** Alt text for {@link heroImageUrl} (optional). */
  heroImageAlt: string | null;
  heroImagePath: string | null;
  authorId: string;
  categoryIds: string[];
  tags: string[];
  site: SiteKey;
  status: PostStatus;
  publishedAt: string | null;
  updatedAt: string;
  createdAt: string;
  seoTitle: string | null;
  seoDescription: string | null;
  featured: boolean;
};

/** @deprecated Prefer `Post`. */
export type CmsPost = Post;
