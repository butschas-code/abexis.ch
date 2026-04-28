/**
 * **SiteKey** : where editorial content is routed in the shared CMS (`posts.site`, `categories.site`, …).
 * **DeploymentSiteKey** : which *single* public deployment a runtime build serves (`NEXT_PUBLIC_CMS_SITE_ID`).
 *
 * Public filtering rules (two domains, one backend) live in **`@/public-site/site`** (`PublicDeploymentSite`,
 * `visiblePostSitesInClause`, `getResolvedPublicDeploymentSite`, …).
 */
export type SiteKey = "abexis" | "search" | "both";

export type DeploymentSiteKey = "abexis" | "search";

/** @deprecated Prefer `SiteKey` in new code : identical union. */
export type CmsSiteId = SiteKey;

/** @deprecated Prefer `DeploymentSiteKey`. */
export type CmsDeploymentSite = DeploymentSiteKey;
