import Link from "next/link";
import { InsightPostCard } from "@/components/public-site/insights/InsightPostCard";
import { InsightsFeatured } from "@/components/public-site/insights/InsightsFeatured";
import { InteriorPageLayout } from "@/components/site/InteriorPageLayout";
import {
  buildCategoryLabelLookup,
  categoryLabelsForPost,
  getAuthorNameMap,
  getResolvedPublicDeploymentSite,
  listInsightsPublishedPosts,
  listPublicCategoriesForDeployment,
  partitionFeaturedForGrid,
  pickFeaturedPosts,
} from "@/public-site/cms";

export const metadata = {
  title: "Insights",
  description: "Perspektiven zu Strategie, Transformation und Führung — kuratiert von Abexis.",
};

export const dynamic = "force-dynamic";

export default async function BlogIndexPage() {
  const [posts, categories, deploymentSite] = await Promise.all([
    listInsightsPublishedPosts({}),
    listPublicCategoriesForDeployment(),
    /** Hostname hints (`NEXT_PUBLIC_SEARCH_SITE_HOST_HINTS`) + `NEXT_PUBLIC_CMS_SITE_ID` — drives Firestore filters. */
    getResolvedPublicDeploymentSite(),
  ]);

  const catLookup = buildCategoryLabelLookup(categories);
  const authorIds = [...new Set(posts.map((p) => p.authorId).filter(Boolean))];
  const authors = await getAuthorNameMap(authorIds);

  const featured = pickFeaturedPosts(posts, 3);
  const gridPosts = partitionFeaturedForGrid(posts, featured);

  const href = (slug: string) => `/blog/${encodeURIComponent(slug)}`;
  const primaryFeatured = featured[0];
  const secondaryFeatured = featured.slice(1);

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
            Strategie, Transformation und Führung — kompakt aufbereitet. Nur veröffentlichte Beiträge für diese
            Oberfläche (inkl. geteilte Inhalte).
          </span>
        </p>
      }
    >
      {posts.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-black/[0.1] bg-white/60 px-8 py-16 text-center">
          <p className="font-serif text-[22px] text-[#1d1d1f]">Noch keine Beiträge</p>
          <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-[#6e6e73]">
            Sobald Inhalte im CMS veröffentlicht sind, erscheinen sie hier — gefiltert nach dieser Website.
          </p>
          <Link
            href="/kontakt"
            className="mt-8 inline-flex rounded-full bg-[var(--brand-900)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--brand-900-hover)]"
          >
            Kontakt
          </Link>
        </div>
      ) : (
        <>
          {primaryFeatured ? (
            <InsightsFeatured
              primary={primaryFeatured}
              secondary={secondaryFeatured}
              hrefFor={(p) => href(p.slug)}
              categoryLine={
                categoryLabelsForPost(primaryFeatured.categoryIds, catLookup).slice(0, 2).join(" · ") || null
              }
              authorName={authors.get(primaryFeatured.authorId) ?? null}
            />
          ) : null}

          <section>
            <div className="mb-8 flex items-end justify-between gap-4">
              <h2 className="font-serif text-[22px] font-medium tracking-[-0.02em] text-[#1d1d1f] md:text-[24px]">
                Neueste Artikel
              </h2>
              <div className="hidden h-px flex-1 translate-y-[-8px] bg-gradient-to-r from-black/[0.08] to-transparent md:block" />
            </div>

            <ul className="grid list-none gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
              {gridPosts.map((post) => {
                const catLine = categoryLabelsForPost(post.categoryIds, catLookup).slice(0, 2).join(" · ") || null;
                return (
                  <li key={post.id} className="h-full">
                    <InsightPostCard
                      post={post}
                      href={href(post.slug)}
                      categoryLine={catLine}
                      authorName={post.authorId ? (authors.get(post.authorId) ?? null) : null}
                    />
                  </li>
                );
              })}
            </ul>
          </section>
        </>
      )}
    </InteriorPageLayout>
  );
}
