import Link from "next/link";
import { InsightsListWithSearch } from "@/components/public-site/insights/InsightsListWithSearch";
import { InteriorPageLayout } from "@/components/site/InteriorPageLayout";
import {
  buildCategoryLabelLookup,
  getAuthorNameMap,
  getResolvedPublicDeploymentSite,
  listInsightsPublishedPosts,
  listPublicCategoriesForInsights,
  partitionFeaturedForGrid,
  pickFeaturedPosts,
} from "@/public-site/cms";

export const metadata = {
  title: "Insights",
  description: "Perspektiven zu Strategie, Transformation und Führung : kuratiert von Abexis.",
  openGraph: {
    title: "Insights | Abexis",
    description: "Perspektiven zu Strategie, Transformation und Führung.",
    type: "website",
  },
};

/** Cache briefly so client navigations feel instant; `loading.tsx` covers the first paint. */
export const revalidate = 120;
export default async function BlogIndexPage() {
  const [posts, categories, deploymentSite] = await Promise.all([
    listInsightsPublishedPosts({}),
    listPublicCategoriesForInsights(),
    /** Hostname hints (`NEXT_PUBLIC_SEARCH_SITE_HOST_HINTS`) + `NEXT_PUBLIC_CMS_SITE_ID` : drives Firestore filters. */
    getResolvedPublicDeploymentSite(),
  ]);

  const catMap = buildCategoryLabelLookup(categories);
  const authorIds = [...new Set(posts.map((p) => p.authorId).filter(Boolean))];
  const authorMap = await getAuthorNameMap(authorIds);

  const featured = pickFeaturedPosts(posts, 3);
  const gridPosts = partitionFeaturedForGrid(posts, featured);

  // Maps are not serializable across the server→client boundary; convert to plain Records.
  const catLookup = Object.fromEntries(catMap);
  const authors = Object.fromEntries(authorMap);

  return (
    <InteriorPageLayout
      eyebrow="Insights"
      title={
        <span className="font-serif font-medium tracking-[-0.03em]">
          Perspektiven<span className="text-white/70">.</span>
        </span>
      }
      heroPriority
      description={
        <p className="max-w-xl text-[17px] leading-relaxed text-white/78">
          {deploymentSite === "search" ? (
            <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">
              Executive Search
            </span>
          ) : (
            <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">
              abexis.ch
            </span>
          )}
          <span className="mt-3 block">
            Strategie, Transformation und Führung : kompakt aufbereitet. Hier finden Sie alle veröffentlichten
            Beiträge aus abexis.ch und der Executive-Search-Oberfläche (sowie geteilte Inhalte).
          </span>
        </p>
      }
    >
      {posts.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-black/[0.1] bg-white/60 px-8 py-16 text-center">
          <p className="font-serif text-[22px] text-[#1d1d1f]">Noch keine Beiträge</p>
          <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-[#6e6e73]">
            Sobald Inhalte im CMS veröffentlicht sind, erscheinen sie hier.
          </p>
          <Link
            href="/kontakt"
            className="mt-8 inline-flex rounded-full bg-[var(--brand-900)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--brand-900-hover)]"
          >
            Kontakt
          </Link>
        </div>
      ) : (
        <InsightsListWithSearch
          allPosts={posts}
          featured={featured}
          gridPosts={gridPosts}
          catLookup={catLookup}
          authors={authors}
        />
      )}
    </InteriorPageLayout>
  );
}
