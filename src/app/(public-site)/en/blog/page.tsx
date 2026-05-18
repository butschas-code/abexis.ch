import Link from "next/link";
import { InsightsListWithSearch } from "@/components/public-site/insights/InsightsListWithSearch";
import { InteriorPageLayout } from "@/components/site/InteriorPageLayout";
import {
  buildCategoryLabelLookup,
  getAuthorNameMap,
  listInsightsPublishedPosts,
  listPublicCategoriesForInsights,
  partitionFeaturedForGrid,
  pickFeaturedPosts,
} from "@/public-site/cms";

export const metadata = {
  title: "Insights | Abexis",
  description: "Perspectives on strategy, transformation and leadership, curated by Abexis.",
  openGraph: {
    title: "Insights | Abexis",
    description: "Perspectives on strategy, transformation and leadership.",
    type: "website",
  },
};

/** Cache briefly so client navigations feel instant; `loading.tsx` covers the first paint. */
export const revalidate = 120;

export default async function EnglishBlogIndexPage() {
  const [posts, categories] = await Promise.all([
    listInsightsPublishedPosts({}),
    listPublicCategoriesForInsights(),
  ]);

  const catMap = buildCategoryLabelLookup(categories);
  const authorIds = [...new Set(posts.map((p) => p.authorId).filter(Boolean))];
  const authorMap = await getAuthorNameMap(authorIds);

  const featured = pickFeaturedPosts(posts, 3);
  const gridPosts = partitionFeaturedForGrid(posts, featured);

  const catLookup = Object.fromEntries(catMap);
  const authors = Object.fromEntries(authorMap);

  return (
    <InteriorPageLayout
      eyebrow="Insights"
      title={
        <span className="font-serif font-medium tracking-[-0.03em]">
          Perspectives<span className="text-white/70">.</span>
        </span>
      }
      heroPriority
      description={
        <p className="max-w-xl text-[17px] leading-relaxed text-white/78">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">abexis.ch</span>
          <span className="mt-3 block">
            Strategy, transformation and leadership in compact form. Blog articles remain available in their original language.
          </span>
        </p>
      }
    >
      {posts.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-black/[0.1] bg-white/60 px-8 py-16 text-center">
          <p className="font-serif text-[22px] text-[#1d1d1f]">No articles yet</p>
          <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-[#6e6e73]">
            Published CMS articles will appear here as soon as they are live.
          </p>
          <Link
            href="/en/kontakt"
            className="mt-8 inline-flex rounded-full bg-[var(--brand-900)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--brand-900-hover)]"
          >
            Contact
          </Link>
        </div>
      ) : (
        <InsightsListWithSearch
          allPosts={posts}
          featured={featured}
          gridPosts={gridPosts}
          catLookup={catLookup}
          authors={authors}
          locale="en"
        />
      )}
    </InteriorPageLayout>
  );
}
