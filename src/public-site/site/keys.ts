/**
 * Single public deployment (**abexis.ch**) sharing one CMS with Firebase.
 *
 * | Layer | Field | Value | Meaning |
 * |-------|--------|-------|---------|
 * | **Posts** (`posts.site`) | `SiteKey` | `abexis` | New writes; legacy rows normalized on read. |
 * | **Categories** (`categories.site`) | `CategorySiteKey` | `abexis` | Same. |
 * | **This build** | `PublicDeploymentSite` | `abexis` | The marketing site served by this app. |
 *
 * Use `visiblePostSitesInClause` for Firestore `where('site','in',…)` (`["abexis"]` after migration).
 */

/** Single marketing site this runtime serves. */
export type PublicDeploymentSite = "abexis";

/** Post collection `site` field. */
export type { SiteKey } from "@/cms/types/site";

/** Category taxonomy `site`. */
export type { CategorySiteKey } from "@/cms/types/category-site";
