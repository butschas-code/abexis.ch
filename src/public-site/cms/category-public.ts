import { unstable_cache } from "next/cache";
import { COLLECTIONS } from "@/cms/firestore/collections";
import type { CategorySiteKey } from "@/cms/types/category-site";
import { getAdminFirestore } from "@/firebase/server";
import { normalizeCategorySite } from "@/lib/cms/normalize-category-site";
import { getResolvedPublicDeploymentSite, visibleCategorySiteKeysForDeployment } from "@/public-site/site";

export type PublicCategoryOption = { id: string; name: string; slug: string };

/** Category `site` values visible for the current public deployment (host-aware when resolved async). */
export async function getVisibleCategorySitesAsync(): Promise<CategorySiteKey[]> {
  const d = await getResolvedPublicDeploymentSite();
  return visibleCategorySiteKeysForDeployment(d);
}

/** Cached category list — `allowedSites` passed as arg so no `headers()` runs inside the cache callback. */
const _listCategoriesCached = async (allowedSites: string[]): Promise<PublicCategoryOption[]> => {
  const getCached = unstable_cache(
    async (): Promise<PublicCategoryOption[]> => {
      const db = getAdminFirestore();
      if (!db) return [];
      try {
        const snap = await db.collection(COLLECTIONS.categories).limit(300).get();
        const allow = new Set(allowedSites);
        const rows: PublicCategoryOption[] = [];
        for (const doc of snap.docs) {
          const data = doc.data() as { name?: string; slug?: string; site?: string; siteScope?: string };
          const site = normalizeCategorySite(data.site ?? data.siteScope);
          if (!allow.has(site)) continue;
          rows.push({
            id: doc.id,
            name: String(data.name ?? doc.id),
            slug: String(data.slug ?? doc.id),
          });
        }
        rows.sort((a, b) => a.name.localeCompare(b.name, "de"));
        return rows;
      } catch (err) {
        console.error("[cms] Admin Firestore categories list failed; returning empty.", err);
        return [];
      }
    },
    ["categories", allowedSites.join("-")],
    { revalidate: 300, tags: ["categories"] },
  );
  return getCached();
};

/** Categories that can be used to filter published posts on this site. */
export async function listPublicCategoriesForDeployment(): Promise<PublicCategoryOption[]> {
  const d = await getResolvedPublicDeploymentSite();
  const allowedSites = visibleCategorySiteKeysForDeployment(d);
  return _listCategoriesCached(allowedSites);
}
