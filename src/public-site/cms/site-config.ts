/**
 * @deprecated Import from `@/public-site/site` for new code.
 *
 * Legacy barrel : same semantics:
 * - `getDeploymentSite()` = env-only (`NEXT_PUBLIC_CMS_SITE_ID`), for sync / build.
 * - For hostname-aware resolution use `getResolvedPublicDeploymentSite()` from `@/public-site/site`.
 */
import type { CmsDeploymentSite } from "@/cms/types/site";
import {
  getDeploymentSiteFromEnv,
  getResolvedPublicDeploymentSite,
  visiblePostSitesInClause,
} from "@/public-site/site";

/** @deprecated Use `getDeploymentSiteFromEnv` from `@/public-site/site`. */
export function getDeploymentSite(): CmsDeploymentSite {
  return getDeploymentSiteFromEnv();
}

/** @deprecated Prefer `visiblePostSitesInClause(getDeploymentSiteFromEnv())` or async resolution. */
export function getVisiblePostSites(): Array<"abexis" | "search" | "both"> {
  return visiblePostSitesInClause(getDeploymentSiteFromEnv());
}

export { getDeploymentSiteFromEnv, getResolvedPublicDeploymentSite };
