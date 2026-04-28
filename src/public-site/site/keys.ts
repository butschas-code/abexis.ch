/**
 * Central vocabulary for **two public deployments** (abexis.ch vs search) sharing one CMS.
 *
 * | Layer | Field | Allowed values | Meaning |
 * |-------|--------|----------------|---------|
 * | **Posts** (`posts.site`) | `SiteKey` | `abexis` \| `search` \| `both` | `both` = visible on **both** public sites. |
 * | **Categories** (`categories.site`) | `CategorySiteKey` | `abexis` \| `search` \| `shared` | `shared` = both sites (`both` is normalized to `shared` on read). |
 * | **This build** | `PublicDeploymentSite` | `abexis` \| `search` | Exactly one per running app / Vercel project. |
 *
 * Always filter public reads with the helpers in `./filters` : never hand-roll `where('site', …)` without them.
 */

/** Which **single** marketing site this server/runtime instance serves (two possible values). */
export type PublicDeploymentSite = "abexis" | "search";

/** Post collection `site` field : includes cross-posting. Re-exported for convenience. */
export type { SiteKey } from "@/cms/types/site";

/** Category taxonomy `site` : `shared` is the cross-site sentinel (see CMS). */
export type { CategorySiteKey } from "@/cms/types/category-site";
