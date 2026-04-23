/**
 * ## Public site context (two domains, one CMS)
 *
 * **Resolve deployment:** `await getResolvedPublicDeploymentSite()` (hostname hints + env).
 *
 * **Query posts:** build Firestore constraints with `visiblePostSitesInClause(site)` from `./filters`
 * or call helpers in `@/public-site/cms/get-published-posts` which already use resolution internally.
 *
 * **Query categories:** `visibleCategorySiteKeysForDeployment(site)` (+ normalize legacy `both` → `shared` via
 * `@/lib/cms/normalize-category-site`).
 *
 * @example Server page — use resolved site (already wired in CMS loaders):
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
  isCategoryVisibleOnDeployment,
  isPostVisibleOnDeployment,
  visibleCategorySiteKeysForDeployment,
  visiblePostSiteKeysForDeployment,
  visiblePostSitesInClause,
  allInsightsPostSitesInClause,
} from "./filters";
