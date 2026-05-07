/**
 * **SiteKey** : editorial routing in the CMS (`posts.site`, `categories.site`, vacancies, switch-bar metadata).
 * **DeploymentSiteKey** : the public deployment this build serves (`NEXT_PUBLIC_CMS_SITE_ID`).
 *
 * Legacy documents may still contain `search`, `both`, or `shared` until the one-shot migration runs;
 * readers normalize those values to `abexis` in mappers.
 */
export type SiteKey = "abexis";

export type DeploymentSiteKey = "abexis";

/** @deprecated Prefer `SiteKey` in new code : identical union. */
export type CmsSiteId = SiteKey;

/** @deprecated Prefer `DeploymentSiteKey`. */
export type CmsDeploymentSite = DeploymentSiteKey;
