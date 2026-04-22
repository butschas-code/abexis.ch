import type { Metadata } from "next";
import type { PublishedPostWithId } from "@/public-site/cms/published-post";

/**
 * SEO + Open Graph (+ Twitter card) for a CMS blog post.
 * Relies on root `metadataBase` for relative path resolution.
 */
export function buildCmsPostMetadata(post: PublishedPostWithId, path: string): Metadata {
  const title = (post.seoTitle?.trim() || post.title || "Insights").trim() || "Insights";
  const description = (post.seoDescription?.trim() || post.excerpt?.trim() || "").trim() || undefined;
  let hero: string | undefined;
  try {
    hero = post.heroImageUrl?.trim() || undefined;
    if (hero) {
      // Reject relative / invalid URLs so Next metadata + OG resolution never throws.
      new URL(hero, "https://www.abexis.ch");
    }
  } catch {
    hero = undefined;
  }

  const md: Metadata = {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.publishedAt ?? undefined,
      modifiedTime: post.updatedAt ?? undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };

  if (hero) {
    const heroAlt = (post.heroImageAlt?.trim() || title).trim();
    md.openGraph = {
      ...md.openGraph,
      images: [{ url: hero, alt: heroAlt }],
    };
    md.twitter = {
      ...md.twitter,
      images: [hero],
    };
  }

  return md;
}
