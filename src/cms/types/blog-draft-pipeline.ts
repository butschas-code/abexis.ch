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
  /** Alt text for the hero image (optional PATCH key). */
  heroImageAlt?: string;
  /** Visible credit line for the hero image (optional PATCH key). */
  heroImageCredit?: string;
  /** When true, removes hero image and Unsplash-related draft fields. */
  heroImageClear?: boolean;
};
