/**
 * ## Public site context (single deployment: abexis.ch)
 *
 * **Resolve deployment:** `await getResolvedPublicDeploymentSite()` (always `abexis`).
 *
 * **Query posts / categories:** `visiblePostSitesInClause` / `visibleCategorySitesFirestoreInClause` use `site in ["abexis"]`
 * (adjust if you reintroduce multi-site content).
 *
 * @example Server page : use resolved site (already wired in CMS loaders):
 * ```tsx
 * import { getResolvedPublicDeploymentSite } from "@/public-site/site";
 * export default async function Page() {
 *   const site = await getResolvedPublicDeploymentSite();
 *   // pass to data loaders or use prebuilt getPublishedCmsPosts()
 * }
 * ```
 *
 * @example Guard a document client-side (edge case):
 * ```ts
 * import { getDeploymentSiteFromEnv } from "@/public-site/site";
 * import { isPostVisibleOnDeployment } from "@/public-site/site";
 * const dep = getDeploymentSiteFromEnv();
 * if (!isPostVisibleOnDeployment(post.site, dep)) return null;
 * ```
 */

export type { PublicDeploymentSite } from "./keys";
export type { SiteKey } from "./keys";
export type { CategorySiteKey } from "./keys";

export {
  getDeploymentSiteFromEnv,
  getResolvedPublicDeploymentSite,
  resolveDeploymentSiteFromHost,
} from "./resolve";

export {
  CATEGORY_SITE_FIRESTORE_IN,
  POST_SITE_FIRESTORE_IN,
  LEGACY_CATEGORY_SITE_FIRESTORE_IN,
  LEGACY_POST_SITE_FIRESTORE_IN,
  isCategoryVisibleOnDeployment,
  isPostVisibleOnDeployment,
  visibleCategorySiteKeysForDeployment,
  visibleCategorySitesFirestoreInClause,
  visiblePostSiteKeysForDeployment,
  visiblePostSitesInClause,
  allInsightsPostSitesInClause,
} from "./filters";
