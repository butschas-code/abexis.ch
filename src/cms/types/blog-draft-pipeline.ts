/** Fields editors may change on `blogDrafts/{id}` before publish (CMS blog automation review UI). */
export type BlogDraftEditableFields = {
  title: string;
  slug: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  articleHtml: string;
  researchSummary: string;
  sources: Array<{ title: string; url: string }>;
  /** Selected author for the eventual CMS post. */
  authorId?: string;
  /** Direct hero image URL from manual upload / media selection. */
  heroImageUrl?: string | null;
  /** Alt text for the hero image (optional PATCH key). */
  heroImageAlt?: string;
  /** Visible credit line for the hero image (optional PATCH key). */
  heroImageCredit?: string;
  /** When true, removes hero image and Unsplash-related draft fields. */
  heroImageClear?: boolean;
};
