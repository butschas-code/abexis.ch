"use client";

import { useState, useMemo } from "react";
import { InsightPostCard } from "./InsightPostCard";
import { InsightsFeatured } from "./InsightsFeatured";
import type { PublishedPostWithId } from "@/public-site/cms";

type Props = {
  allPosts: PublishedPostWithId[];
  featured: PublishedPostWithId[];
  gridPosts: PublishedPostWithId[];
  /** Serializable Record form of the category id → label Map */
  catLookup: Record<string, string>;
  /** Serializable Record form of the author id → name Map */
  authors: Record<string, string>;
  locale?: "de" | "en";
  itemBaseHref?: string;
};

function catLine(categoryIds: string[], lookup: Record<string, string>): string | null {
  const labels = categoryIds.map((id) => lookup[id]).filter(Boolean);
  return labels.slice(0, 2).join(" · ") || null;
}

const copy = {
  de: {
    dateLocale: "de-CH",
    searchPlaceholder: "Beiträge durchsuchen …",
    searchLabel: "Beiträge durchsuchen",
    clearSearch: "Suche leeren",
    latest: "Neueste Artikel",
    results: "Suchergebnisse",
    noMatches: "Keine Treffer",
    itemSingular: "Beitrag",
    itemPlural: "Beiträge",
    emptyTitle: "Keine Beiträge gefunden",
    emptyHint: "Versuchen Sie einen anderen Suchbegriff.",
  },
  en: {
    dateLocale: "en-GB",
    searchPlaceholder: "Search articles …",
    searchLabel: "Search articles",
    clearSearch: "Clear search",
    latest: "Latest articles",
    results: "Search results",
    noMatches: "No matches",
    itemSingular: "article",
    itemPlural: "articles",
    emptyTitle: "No articles found",
    emptyHint: "Try another search term.",
  },
} as const;

export function InsightsListWithSearch({
  allPosts,
  featured,
  gridPosts,
  catLookup,
  authors,
  locale = "de",
  itemBaseHref = "/blog",
}: Props) {
  const texts = copy[locale];
  const [query, setQuery] = useState("");
  const trimmed = query.trim().toLowerCase();
  const isSearching = trimmed.length > 0;

  const filteredPosts = useMemo<PublishedPostWithId[] | null>(() => {
    if (!isSearching) return null;
    return allPosts.filter((post) => {
      const haystack = [post.title, post.excerpt ?? "", (post.tags ?? []).join(" ")]
        .join(" ")
        .toLowerCase();
      return haystack.includes(trimmed);
    });
  }, [allPosts, trimmed, isSearching]);

  const href = (slug: string) => `${itemBaseHref}/${encodeURIComponent(slug)}`;
  const primaryFeatured = featured[0];
  const secondaryFeatured = featured.slice(1);

  return (
    <div>
      {/* Search bar */}
      <div className="mb-10 md:mb-14">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
            <svg
              className="h-4 w-4 text-[#86868b]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="6" />
              <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
            </svg>
          </div>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={texts.searchPlaceholder}
            aria-label={texts.searchLabel}
            className="w-full rounded-2xl border border-black/[0.08] bg-white/80 py-3.5 pl-11 pr-10 text-[15px] text-[#1d1d1f] placeholder:text-[#a1a1a6] shadow-sm ring-1 ring-black/[0.04] backdrop-blur-sm transition focus:border-[var(--brand-500)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]/20 md:text-[16px]"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label={texts.clearSearch}
              className="absolute inset-y-0 right-3 flex items-center px-1 text-[#86868b] transition hover:text-[#1d1d1f]"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ) : null}
        </div>
      </div>

      {/* Default layout */}
      {!isSearching && (
        <>
          {primaryFeatured ? (
            <InsightsFeatured
              primary={primaryFeatured}
              secondary={secondaryFeatured}
              hrefFor={(p) => href(p.slug)}
              categoryLine={catLine(primaryFeatured.categoryIds, catLookup)}
              authorName={authors[primaryFeatured.authorId] ?? null}
              locale={locale}
            />
          ) : null}

          <section>
            <div className="mb-8 flex items-end justify-between gap-4">
              <h2 className="font-serif text-[22px] font-medium tracking-[-0.02em] text-[#1d1d1f] md:text-[24px]">
                {texts.latest}
              </h2>
              <div className="hidden h-px flex-1 translate-y-[-8px] bg-gradient-to-r from-black/[0.08] to-transparent md:block" />
            </div>
            <ul className="grid list-none gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
              {gridPosts.map((post) => (
                <li key={post.id} className="h-full">
                  <InsightPostCard
                    post={post}
                    href={href(post.slug)}
                    categoryLine={catLine(post.categoryIds, catLookup)}
                    authorName={post.authorId ? (authors[post.authorId] ?? null) : null}
                    dateLocale={texts.dateLocale}
                  />
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      {/* Search results */}
      {isSearching && (
        <section>
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-serif text-[22px] font-medium tracking-[-0.02em] text-[#1d1d1f] md:text-[24px]">
                {texts.results}
              </h2>
              <p className="mt-1 text-[13px] text-[#86868b]">
                {filteredPosts!.length === 0
                  ? texts.noMatches
                  : `${filteredPosts!.length} ${filteredPosts!.length === 1 ? texts.itemSingular : texts.itemPlural}`}
              </p>
            </div>
            <div className="hidden h-px flex-1 translate-y-[-14px] bg-gradient-to-r from-black/[0.08] to-transparent md:block" />
          </div>

          {filteredPosts!.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-black/[0.1] bg-white/60 px-8 py-16 text-center">
              <p className="font-serif text-[22px] text-[#1d1d1f]">{texts.emptyTitle}</p>
              <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-[#6e6e73]">
                {texts.emptyHint}
              </p>
            </div>
          ) : (
            <ul className="grid list-none gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
              {filteredPosts!.map((post) => (
                <li key={post.id} className="h-full">
                  <InsightPostCard
                    post={post}
                    href={href(post.slug)}
                    categoryLine={catLine(post.categoryIds, catLookup)}
                    authorName={post.authorId ? (authors[post.authorId] ?? null) : null}
                    dateLocale={texts.dateLocale}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
