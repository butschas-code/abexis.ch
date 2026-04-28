import type { PostUpsertInput } from "./dto";
import { serializePostBody } from "@/lib/cms/post-body-storage";

/**
 * Initial editor state for a new Firestore post id.
 * Satisfies `postUpsertInputSchema` : replace title/slug before publishing.
 */
export function defaultPostUpsertDraft(id: string): PostUpsertInput {
  const slugTail = id.replace(/[^a-zA-Z0-9]+/g, "").slice(0, 12) || "x";
  return {
    id,
    title: "Neuer Beitrag",
    slug: `entwurf-${slugTail}`,
    excerpt: "",
    body: serializePostBody("<p></p>"),
    heroImageUrl: null,
    heroImageAlt: null,
    heroImagePath: null,
    authorId: "_",
    categoryIds: [],
    tags: [],
    site: "abexis",
    status: "draft",
    seoTitle: null,
    seoDescription: null,
    featured: false,
  };
}
