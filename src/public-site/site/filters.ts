import type { CategorySiteKey } from "@/cms/types/category-site";
import type { SiteKey } from "@/cms/types/site";
import type { PublicDeploymentSite } from "./keys";

/**
 * Values for `where('site', 'in', …)` on **posts** / **vacancies** (published lists).
 * After `scripts/migrate-cms-sites-to-abexis.ts`, only `abexis` remains in Firestore.
 */
export const POST_SITE_FIRESTORE_IN = ["abexis"] as const;

/**
 * Values for `where('site', 'in', …)` on **categories** (public listings).
 */
export const CATEGORY_SITE_FIRESTORE_IN = ["abexis"] as const;

/** @deprecated Use {@link POST_SITE_FIRESTORE_IN}. Kept for any external imports; same value. */
export const LEGACY_POST_SITE_FIRESTORE_IN = POST_SITE_FIRESTORE_IN;

/** @deprecated Use {@link CATEGORY_SITE_FIRESTORE_IN}. */
export const LEGACY_CATEGORY_SITE_FIRESTORE_IN = CATEGORY_SITE_FIRESTORE_IN;

/**
 * After normalization, every post row behaves as `abexis` in app types.
 */
export function visiblePostSiteKeysForDeployment(_deployment: PublicDeploymentSite): SiteKey[] {
  return ["abexis"];
}

/** Stable tuple for `where('site', 'in', …)` on posts (max 10 entries in Firestore). */
export function visiblePostSitesInClause(_deployment: PublicDeploymentSite): typeof POST_SITE_FIRESTORE_IN {
  return POST_SITE_FIRESTORE_IN;
}

export function visibleCategorySiteKeysForDeployment(_deployment: PublicDeploymentSite): CategorySiteKey[] {
  return ["abexis"];
}

/** Firestore `in` for category reads. */
export function visibleCategorySitesFirestoreInClause(): typeof CATEGORY_SITE_FIRESTORE_IN {
  return CATEGORY_SITE_FIRESTORE_IN;
}

/** Unified Insights (`/blog`) : same post `site` constraints as deployment-scoped listings. */
export function allInsightsPostSitesInClause(): typeof POST_SITE_FIRESTORE_IN {
  return POST_SITE_FIRESTORE_IN;
}

export function isPostVisibleOnDeployment(postSite: SiteKey, _deployment: PublicDeploymentSite): boolean {
  return postSite === "abexis";
}

export function isCategoryVisibleOnDeployment(categorySite: CategorySiteKey, _deployment: PublicDeploymentSite): boolean {
  return categorySite === "abexis";
}
