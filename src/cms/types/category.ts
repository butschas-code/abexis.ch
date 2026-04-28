import type { CategorySiteKey } from "./category-site";

/**
 * `categories/{categoryId}` : taxonomy scoped to a public surface.
 * Legacy `siteScope` / `site: "both"` are normalized when reading.
 */
export type Category = {
  name: string;
  slug: string;
  site: CategorySiteKey;
  description: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type CmsCategory = Category;
