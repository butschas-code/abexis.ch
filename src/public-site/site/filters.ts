import type { CategorySiteKey } from "@/cms/types/category-site";
import type { SiteKey } from "@/cms/types/site";
import type { PublicDeploymentSite } from "./keys";

/**
 * Firestore `posts.site` values included when querying for this deployment (`both` = both audiences).
 */
export function visiblePostSiteKeysForDeployment(deployment: PublicDeploymentSite): Array<SiteKey> {
  if (deployment === "search") return ["search", "both"];
  return ["abexis", "both"];
}

/**
 * Same as {@link visiblePostSiteKeysForDeployment} — stable array for `where('site', 'in', …)` (max 10 entries).
 */
export function visiblePostSitesInClause(deployment: PublicDeploymentSite): Array<"abexis" | "search" | "both"> {
  return visiblePostSiteKeysForDeployment(deployment);
}

/**
 * Category `site` values visible on this deployment (`shared` = both listings).
 */
export function visibleCategorySiteKeysForDeployment(deployment: PublicDeploymentSite): CategorySiteKey[] {
  if (deployment === "search") return ["search", "shared"];
  return ["abexis", "shared"];
}

/** All `posts.site` values — for unified Insights (`/blog`) listing and slug resolution across surfaces. */
export function allInsightsPostSitesInClause(): Array<"abexis" | "search" | "both"> {
  return ["abexis", "search", "both"];
}

/** Row-level check (e.g. after a broad read). */
export function isPostVisibleOnDeployment(postSite: SiteKey, deployment: PublicDeploymentSite): boolean {
  return visiblePostSiteKeysForDeployment(deployment).includes(postSite);
}

/** Row-level check for category rows. */
export function isCategoryVisibleOnDeployment(categorySite: CategorySiteKey, deployment: PublicDeploymentSite): boolean {
  return visibleCategorySiteKeysForDeployment(deployment).includes(categorySite);
}
