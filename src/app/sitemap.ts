import type { MetadataRoute } from "next";
import { fokusthemenMeta, getAllBlogPosts, teamOrder } from "@/data/pages";
import { getPublishedCmsPostsAllSites, listPublicCategoriesForInsights } from "@/public-site/cms";

const base = "https://www.abexis.ch";

/** Merge static legacy slugs with live CMS URLs. TODO(deploy): revalidate or use `sitemap` route segment if slugs grow large. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "/",
    "/leistungen",
    "/leistungen/executive-search",
    "/blog",
    "/ueber-uns",
    "/kontakt",
    "/termin",
    "/projectfitcheck",
    "/legal-policy",
    "/privacy-policy",
    "/en/home",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1 : 0.7,
  }));

  const fokus = fokusthemenMeta.map((f) => ({
    url: `${base}${f.href}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  const team = teamOrder.map((p) => ({
    url: `${base}/${p}`,
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.55,
  }));

  const legacyPosts = getAllBlogPosts().map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: p.publishedISO ? new Date(p.publishedISO) : new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  let cmsPosts: MetadataRoute.Sitemap = [];
  try {
    const published = await getPublishedCmsPostsAllSites(1000);
    cmsPosts = published.map((p) => ({
      url: `${base}/blog/${encodeURIComponent(p.slug)}`,
      lastModified: p.publishedAt ? new Date(p.publishedAt) : new Date(p.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  } catch (err) {
    console.error("[sitemap] Failed to fetch CMS posts", err);
  }

  let categories: MetadataRoute.Sitemap = [];
  try {
    const cats = await listPublicCategoriesForInsights();
    categories = cats.map((c) => ({
      url: `${base}/blog?category=${encodeURIComponent(c.slug)}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.4,
    }));
  } catch (err) {
    console.error("[sitemap] Failed to fetch categories", err);
  }

  const byUrl = new Map<string, MetadataRoute.Sitemap[number]>();
  // Prioritize CMS posts over legacy if slugs match (unlikely but safe)
  for (const row of [...legacyPosts, ...cmsPosts, ...categories]) {
    byUrl.set(row.url, row);
  }

  return [...staticRoutes, ...fokus, ...team, ...byUrl.values()];
}
