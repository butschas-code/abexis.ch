import { unstable_cache } from "next/cache";
import { COLLECTIONS } from "@/cms/firestore/collections";
import { getAdminFirestore } from "@/firebase/server";
import { getResolvedPublicDeploymentSite, visibleCategorySitesFirestoreInClause } from "@/public-site/site";

export type PublicCategoryOption = { id: string; name: string; slug: string };

/** Map stored category row to a key used with {@link visibleCategorySitesFirestoreInClause}. */
function categoryFirestoreSiteKey(data: { site?: string; siteScope?: string }): string {
  const raw = String(data.site ?? data.siteScope ?? "abexis").trim().toLowerCase();
  if (raw === "both") return "shared";
  if (raw === "abexis" || raw === "search" || raw === "shared") return raw;
  return "abexis";
}

/** Category `site` values that may still exist in Firestore pre-migration. */
export async function getVisibleCategorySitesAsync(): Promise<string[]> {
  await getResolvedPublicDeploymentSite();
  return [...visibleCategorySitesFirestoreInClause()];
}

/** Cached category list : `allowedSites` passed as arg so no `headers()` runs inside the cache callback. */
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
          const key = categoryFirestoreSiteKey(data);
          if (!allow.has(key)) continue;
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

/**
 * Categories used on the public site (legacy `site` / `siteScope` until migration).
 */
export async function listPublicCategoriesForDeployment(): Promise<PublicCategoryOption[]> {
  await getResolvedPublicDeploymentSite();
  return _listCategoriesCached([...visibleCategorySitesFirestoreInClause()]);
}

/**
 * All categories needed to label posts on `/blog` (same allow-list as deployment).
 */
export async function listPublicCategoriesForInsights(): Promise<PublicCategoryOption[]> {
  return _listCategoriesCached([...visibleCategorySitesFirestoreInClause()]);
}
